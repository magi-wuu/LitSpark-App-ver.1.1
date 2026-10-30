const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { defaultProgress, decodeProgress } = require(path.join(process.env.LITSPARK_TEST_BUILD, 'learningState.js'));
const { LocalStore } = require(path.join(process.env.LITSPARK_TEST_BUILD, 'localStore.js'));
const { getUnit, nextUnitStep, recordUnitAnswer, saveWritingDraft, toggleReviewCheck, completeUnitActivity } = require(path.join(process.env.LITSPARK_TEST_BUILD, 'journeyState.js'));
const at = '2026-10-29T20:00:00.000Z';
const answers = [1, 0, 2];
const draftId = 'unit-asking-for-help';
function read(current = defaultProgress) { for (let i = 0; i < answers.length; i++) current = recordUnitAnswer(current, i, answers[i]); return completeUnitActivity(current, 'reading', at); }
function write(current = read()) { return completeUnitActivity(saveWritingDraft(current, draftId, 'Hello Ms. Chen, could you explain the task? Thank you!', at), 'writing', at); }
function review(current = write()) { for (let i = 0; i < 3; i++) current = toggleReviewCheck(current, i); return completeUnitActivity(current, 'review', at); }

test('a new learner starts at reading and cannot skip to writing or review', () => {
  assert.equal(nextUnitStep(getUnit(defaultProgress)), 'reading');
  assert.equal(completeUnitActivity(defaultProgress, 'writing', at), defaultProgress);
  assert.equal(completeUnitActivity(defaultProgress, 'review', at), defaultProgress);
  assert.equal(completeUnitActivity(defaultProgress, 'reading', at), defaultProgress);
});
test('wrong or out-of-range reading answers do not advance saved progress', () => {
  assert.equal(recordUnitAnswer(defaultProgress, 0, 0), defaultProgress);
  assert.equal(recordUnitAnswer(defaultProgress, -1, 1), defaultProgress);
  assert.equal(recordUnitAnswer(defaultProgress, 100, 1), defaultProgress);
  const partial = recordUnitAnswer(defaultProgress, 0, 1);
  assert.equal(completeUnitActivity(partial, 'reading', at), partial);
  assert.deepEqual(getUnit(decodeProgress(JSON.parse(JSON.stringify(partial)))).readingAnswers, [1, null, null]);
});
test('reading completion advances to writing and awards ten XP once', () => {
  const progress = read();
  assert.equal(progress.experiencePoints, 10); assert.equal(progress.scoreCount, 0);
  assert.equal(nextUnitStep(getUnit(progress)), 'writing');
  assert.equal(completeUnitActivity(progress, 'reading', at), progress);
});
test('writing needs a nonempty message; generic drafts remain separate from unit drafts', () => {
  const progress = read();
  assert.equal(completeUnitActivity(progress, 'writing', at), progress);
  const generic = saveWritingDraft(progress, 'ask-for-help', 'A different draft', at);
  assert.equal(completeUnitActivity(generic, 'writing', at), generic);
  const whitespace = saveWritingDraft(progress, draftId, '   ', at);
  assert.equal(completeUnitActivity(whitespace, 'writing', at), whitespace);
  assert.equal(nextUnitStep(getUnit(write())), 'review');
});
test('review requires every self-check and editing a draft clears those checks', () => {
  let progress = write();
  assert.equal(completeUnitActivity(progress, 'review', at), progress);
  progress = toggleReviewCheck(progress, 0); progress = toggleReviewCheck(progress, 1);
  assert.equal(completeUnitActivity(progress, 'review', at), progress);
  progress = saveWritingDraft(progress, draftId, 'Could you explain question three?', at);
  assert.deepEqual(getUnit(progress).reviewChecks, [false, false, false]);
});
test('the whole unit survives decoding with 30 XP, its draft, and a reviewed snapshot', () => {
  const progress = decodeProgress(JSON.parse(JSON.stringify(review())));
  assert.equal(progress.experiencePoints, 30); assert.equal(progress.sessionsCompleted, 3);
  assert.equal(progress.scoreCount, 0, 'self-review is not treated as a scored language test');
  assert.equal(nextUnitStep(getUnit(progress)), 'complete');
  assert.equal(getUnit(progress).completedAt, at);
  assert.equal(getUnit(progress).submittedText, progress.writingDrafts[draftId].text);
});
test('replaying completed activities cannot duplicate unit rewards', () => {
  let progress = review();
  for (let repeat = 0; repeat < 3; repeat++) for (const step of ['reading', 'writing', 'review']) progress = completeUnitActivity(progress, step, at);
  assert.equal(progress.experiencePoints, 30); assert.equal(progress.sessionsCompleted, 3);
});
test('legacy totals and drafts migrate without inventing unit completion', () => {
  const progress = decodeProgress({ experiencePoints: 120, writingDrafts: { 'ask-for-help': { text: 'My original draft', updatedAt: at } } });
  assert.equal(progress.experiencePoints, 120); assert.deepEqual(progress.units, {});
  assert.equal(progress.writingDrafts['ask-for-help'].text, 'My original draft');
});
test('a failed unit reward write can retry without awarding XP twice', async () => {
  let raw = JSON.stringify(write()); let fail = true;
  const store = new LocalStore('userProgress', defaultProgress, decodeProgress, { getItem: async () => raw, setItem: async (_key, next) => { if (fail) throw Error('disk full'); raw = next; } });
  await store.load();
  await assert.rejects(store.update(current => review(current)));
  assert.equal(store.getSnapshot().data.experiencePoints, 30);
  fail = false;
  await store.update(current => completeUnitActivity(current, 'review', at));
  assert.equal(JSON.parse(raw).experiencePoints, 30);
  assert.equal(getUnit(decodeProgress(JSON.parse(raw))).completedSteps.length, 3);
});
test('malformed saved unit progress is rejected rather than silently replaced', () => {
  const progress = review();
  const invalid = { ...progress, units: { 'asking-for-help': { ...getUnit(progress), completedSteps: ['review'] } } };
  assert.throws(() => decodeProgress(invalid));
  assert.throws(() => decodeProgress({ ...progress, units: [] }));
});
