import { recordPracticeDay } from './streak';
import { learningUnit, learningUnits, findLearningUnit, LearningUnit, unitActivities, UnitStep } from '../content/learningUnit';
import type { UserProgress } from './learningState';
export interface UnitProgress {
  practiceAnswers: (number | null)[];
  readingAnswers: (number | null)[];
  completedSteps: UnitStep[];
  reviewChecks: boolean[];
  completedAt: string | null;
  submittedText: string;
}
export const emptyUnit = (lesson: LearningUnit = learningUnit): UnitProgress => ({ practiceAnswers: lesson.practice.map(() => null), readingAnswers: lesson.reading.questions.map(() => null), completedSteps: [], reviewChecks: lesson.writing.checks.map(() => false), completedAt: null, submittedText: '' });
export const getUnit = (progress: UserProgress, id = learningUnit.id) => progress.units[id] ?? emptyUnit(findLearningUnit(id));
export const isUnitAvailable = (progress: UserProgress, id: string) => {
 const index = learningUnits.findIndex(unit => unit.id === id);
 return index >= 0 && learningUnits.slice(0, index).every(unit => !!getUnit(progress, unit.id).completedAt);
};
export const currentLearningUnit = (progress: UserProgress) => learningUnits.find(unit => !getUnit(progress, unit.id).completedAt) ?? learningUnits[learningUnits.length - 1];
export const nextUnitStep = (progress: UnitProgress): UnitStep | 'complete' => unitActivities.find(item => !progress.completedSteps.includes(item.id))?.id ?? 'complete';
export function canOpenStep(unit: UnitProgress, step: UnitStep) {
  const index = unitActivities.findIndex(item => item.id === step);
  return unitActivities.slice(0, index).every(item => unit.completedSteps.includes(item.id));
}
export function decodeUnits(value: unknown): Record<string, UnitProgress> {
  if (value === undefined) return {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid units');
  const result: Record<string, UnitProgress> = {};
  for (const [id, saved] of Object.entries(value)) {
    const lesson = findLearningUnit(id);
    if (!lesson || !saved || typeof saved !== 'object' || Array.isArray(saved)) throw new Error('Invalid unit record');
    const raw = saved as Record<string, unknown>;
    const answers = raw.readingAnswers;
    const practice = raw.practiceAnswers === undefined ? lesson.practice.map(() => null) : raw.practiceAnswers;
    if (!Array.isArray(practice) || practice.length !== lesson.practice.length || !practice.every((answer, index) => answer === null || answer === lesson.practice[index].correct)) throw new Error('Invalid practice answers');
    const checks = raw.reviewChecks;
    const steps = raw.completedSteps;
    if (!Array.isArray(answers) || answers.length !== lesson.reading.questions.length || !answers.every((answer, index) => answer === null || answer === lesson.reading.questions[index].correct)) throw new Error('Invalid reading answers');
    if (!Array.isArray(checks) || checks.length !== lesson.writing.checks.length || !checks.every(item => typeof item === 'boolean')) throw new Error('Invalid review checks');
    if (!Array.isArray(steps) || !steps.every(step => unitActivities.some(item => item.id === step)) || new Set(steps).size !== steps.length) throw new Error('Invalid unit steps');
    const completedSteps = steps as UnitStep[];
    if (completedSteps.some(step => !canOpenStep({ ...emptyUnit(), completedSteps }, step))) throw new Error('Invalid step order');
    if (completedSteps.includes('reading') && answers.some(answer => answer === null)) throw new Error('Incomplete reading');
    if (raw.completedAt !== null && (typeof raw.completedAt !== 'string' || !Number.isFinite(Date.parse(raw.completedAt)))) throw new Error('Invalid unit date');
    if (typeof raw.submittedText !== 'string' || (completedSteps.includes('review') && (!raw.submittedText.trim() || !raw.completedAt))) throw new Error('Invalid reviewed message');
    result[id] = { practiceAnswers: practice as (number | null)[], readingAnswers: answers as (number | null)[], reviewChecks: checks as boolean[], completedSteps, completedAt: raw.completedAt as string | null, submittedText: raw.submittedText };
  }
  return result;
}
function updateUnit(current: UserProgress, unit: UnitProgress, id = learningUnit.id): UserProgress {
  return { ...current, units: { ...current.units, [id]: unit } };
}
export function recordUnitAnswer(current: UserProgress, index: number, answer: number, id = learningUnit.id, practice = false): UserProgress {
  const lesson = findLearningUnit(id);
  if (!lesson || !isUnitAvailable(current, id)) return current;
  const questions = practice ? lesson.practice : lesson.reading.questions;
  if (!Number.isInteger(index) || index < 0 || index >= questions.length || answer !== questions[index].correct) return current;
  const unit = getUnit(current, id);
  if (practice && !unit.completedSteps.includes('reading')) return current;
  const key = practice ? 'practiceAnswers' : 'readingAnswers';
  if (unit[key][index] === answer) return current;
  const answers = [...unit[key]]; answers[index] = answer;
  return updateUnit(current, { ...unit, [key]: answers }, id);
}
export function saveWritingDraft(current: UserProgress, id: string, text: string, at: string): UserProgress {
  if (!/^[\w-]+$/.test(id) || ['__proto__', 'constructor', 'prototype'].includes(id) || text.length > 10000 || current.writingDrafts[id]?.text === text) return current;
  const next = { ...current, writingDrafts: { ...current.writingDrafts, [id]: { text, updatedAt: at } } };
  // A revision invalidates self-checks, but never removes historical completions or rewards.
  const lesson = learningUnits.find(unit => unit.draftId === id);
  return lesson ? updateUnit(next, { ...getUnit(current, lesson.id), reviewChecks: lesson.writing.checks.map(() => false) }, lesson.id) : next;
}
export function toggleReviewCheck(current: UserProgress, index: number, id = learningUnit.id): UserProgress {
  if (!findLearningUnit(id) || !isUnitAvailable(current, id)) return current;
  const unit = getUnit(current, id);
  if (!Number.isInteger(index) || index < 0 || index >= unit.reviewChecks.length || !unit.completedSteps.includes('writing')) return current;
  const checks = [...unit.reviewChecks]; checks[index] = !checks[index];
  return updateUnit(current, { ...unit, reviewChecks: checks }, id);
}
export function completeUnitActivity(current: UserProgress, step: UnitStep, at: string, id = learningUnit.id): UserProgress {
  const lesson = findLearningUnit(id);
  if (!lesson || !isUnitAvailable(current, id)) return current;
  const unit = getUnit(current, id);
  if (!unitActivities.some(item => item.id === step) || !canOpenStep(unit, step)) return current;
  if (unit.completedSteps.includes(step)) return recordPracticeDay(current, at);
  const message = current.writingDrafts[lesson.draftId]?.text.trim() ?? '';
  if (step === 'reading' && unit.readingAnswers.some(answer => answer === null)) return current;
  if ((step === 'writing' || step === 'review') && !message) return current;
  if (step === 'review' && !unit.reviewChecks.every(Boolean)) return current;
  return updateUnit({ ...recordPracticeDay(current, at), experiencePoints: current.experiencePoints + 10, sessionsCompleted: current.sessionsCompleted + 1, lastSessionDate: at }, {
    ...unit, completedSteps: [...unit.completedSteps, step],
    completedAt: step === 'review' ? at : unit.completedAt,
    submittedText: step === 'review' ? message : unit.submittedText,
  }, id);
}
