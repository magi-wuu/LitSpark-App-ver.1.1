const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const build = process.env.LITSPARK_TEST_BUILD;
const { defaultProgress, decodeProgress } = require(path.join(build, 'learningState.js'));
const { learningUnits } = require(path.join(build, '../content/learningUnit.js'));
const { getUnit, recordUnitAnswer, saveWritingDraft, toggleReviewCheck, completeUnitActivity, isUnitAvailable, currentLearningUnit } = require(path.join(build, 'journeyState.js'));
const at = '2026-10-29T20:00:00.000Z';
function finish(progress, lesson) {
 for (const [index, q] of lesson.reading.questions.entries()) progress = recordUnitAnswer(progress, index, q.correct, lesson.id);
 progress = completeUnitActivity(progress, 'reading', at, lesson.id);
 for (const [index, q] of lesson.practice.entries()) progress = recordUnitAnswer(progress, index, q.correct, lesson.id, true);
 progress = saveWritingDraft(progress, lesson.draftId, lesson.writing.example, at);
 progress = completeUnitActivity(progress, 'writing', at, lesson.id);
 for (const index of lesson.writing.checks.keys()) progress = toggleReviewCheck(progress, index, lesson.id);
 return completeUnitActivity(progress, 'review', at, lesson.id);
}
test('three original units have complete supported lessons, valid answer keys, and https resources', () => {
 assert.equal(learningUnits.length, 3);
 assert.equal(new Set(learningUnits.map(u => u.id)).size, 3);
 assert.equal(new Set(learningUnits.map(u => u.draftId)).size, 3);
 for (const [i, unit] of learningUnits.entries()) {
  assert.equal(unit.number, i + 1);
  assert.equal(unit.outcomes.length, 3); assert.equal(unit.words.length, 3);
  assert.equal(unit.reading.questions.length, 3); assert.equal(unit.practice.length, 3);
  assert.ok(unit.reading.paragraphs.join(' ').length > 200);
  assert.ok(unit.writing.example && unit.writing.tip && unit.writing.challenge);
  for (const q of [...unit.reading.questions, ...unit.practice]) {
   assert.equal(new Set(q.options).size, q.options.length);
   assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length);
   assert.ok(q.explanation.length > 35);
  }
  for (const resource of unit.resources) assert.equal(new URL(resource.url).protocol, 'https:');
 }
});
test('units unlock in order and URL or state transitions cannot skip a unit', () => {
 const second = learningUnits[1];
 assert.equal(isUnitAvailable(defaultProgress, second.id), false);
 assert.equal(recordUnitAnswer(defaultProgress, 0, second.reading.questions[0].correct, second.id), defaultProgress);
 assert.equal(completeUnitActivity(defaultProgress, 'reading', at, second.id), defaultProgress);
 const next = finish(defaultProgress, learningUnits[0]);
 assert.equal(isUnitAvailable(next, second.id), true);
 assert.equal(currentLearningUnit(next).id, second.id);
 assert.equal(isUnitAvailable(next, learningUnits[2].id), false);
});
test('all three units persist independently with 90 XP and no duplicate rewards', () => {
 let progress = defaultProgress;
 for (const lesson of learningUnits) progress = finish(progress, lesson);
 progress = decodeProgress(JSON.parse(JSON.stringify(progress)));
 assert.equal(progress.experiencePoints, 90); assert.equal(progress.sessionsCompleted, 9);
 assert.equal(progress.scoreCount, 0);
 for (const lesson of learningUnits) {
  const saved = getUnit(progress, lesson.id);
  assert.equal(saved.completedAt, at);
  assert.equal(saved.submittedText, lesson.writing.example);
  assert.deepEqual(saved.practiceAnswers, lesson.practice.map(q => q.correct));
  progress = finish(progress, lesson);
 }
 assert.equal(progress.experiencePoints, 90); assert.equal(progress.sessionsCompleted, 9);
});
test('legacy first-unit saves gain empty warm-up answers without losing completion, draft, or XP', () => {
 const progress = finish(defaultProgress, learningUnits[0]);
 const legacy = JSON.parse(JSON.stringify(progress));
 delete legacy.units['asking-for-help'].practiceAnswers;
 const restored = decodeProgress(legacy);
 assert.equal(restored.experiencePoints, 30);
 assert.equal(getUnit(restored).completedAt, at);
 assert.deepEqual(getUnit(restored).practiceAnswers, [null, null, null]);
 assert.equal(restored.writingDrafts[learningUnits[0].draftId].text, learningUnits[0].writing.example);
});
test('warm-up answers validate, survive reload, and cannot award XP', () => {
 const lesson = learningUnits[0];
 assert.equal(recordUnitAnswer(defaultProgress, 0, 1, lesson.id, true), defaultProgress);
 let progress = defaultProgress;
 for (const [i, q] of lesson.reading.questions.entries()) progress = recordUnitAnswer(progress, i, q.correct);
 progress = completeUnitActivity(progress, 'reading', at);
 assert.equal(recordUnitAnswer(progress, 0, 0, lesson.id, true), progress);
 assert.equal(recordUnitAnswer(progress, 99, 1, lesson.id, true), progress);
 progress = recordUnitAnswer(progress, 0, 1, lesson.id, true);
 const restored = decodeProgress(JSON.parse(JSON.stringify(progress)));
 assert.deepEqual(getUnit(restored).practiceAnswers, [1, null, null]);
 assert.equal(restored.experiencePoints, 10);
 const invalid = JSON.parse(JSON.stringify(progress)); invalid.units[lesson.id].practiceAnswers[0] = 0;
 assert.throws(() => decodeProgress(invalid));
});
test('editing one unit clears only its own review checks and preserves historical rewards', () => {
 let progress = defaultProgress;
 for (const lesson of learningUnits) progress = finish(progress, lesson);
 progress = saveWritingDraft(progress, learningUnits[1].draftId, 'A revised plan.', at);
 assert.deepEqual(getUnit(progress, learningUnits[1].id).reviewChecks, [false, false, false]);
 assert.deepEqual(getUnit(progress, learningUnits[0].id).reviewChecks, [true, true, true]);
 assert.equal(progress.experiencePoints, 90);
 assert.equal(getUnit(progress, learningUnits[2].id).submittedText, learningUnits[2].writing.example);
});
