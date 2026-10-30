import { localDay, normalizeDays, streakSummary, recordPracticeDay } from './streak';
import { decodeUnits, UnitProgress } from './journeyState';
export interface Completion {
  score: number;
  total: number;
  xp: number;
  completedAt: string;
}
export interface WritingDraft { text: string; updatedAt: string }
export interface UserProgress {
  totalMinutesSpoken: number;
  currentLevel: number;
  experiencePoints: number;
  sessionsCompleted: number;
  averageScore: number;
  scoreCount: number;
  streak: number;
  practiceDays: string[];
  lastSessionDate: string | null;
  achievements: string[];
  completions: Record<string, Completion>;
  writingDrafts: Record<string, WritingDraft>;
  units: Record<string, UnitProgress>;
}
export const defaultProgress: UserProgress = {
  totalMinutesSpoken: 0, currentLevel: 1, experiencePoints: 0,
  sessionsCompleted: 0, averageScore: 0, scoreCount: 0, streak: 0, practiceDays: [],
  lastSessionDate: null, achievements: [], completions: {}, writingDrafts: {}, units: {},
};
export interface UserProfile { name: string; joinDate: string; bio: string; profilePicture?: string }
export const defaultProfile: UserProfile = {
  name: 'New Learner', joinDate: new Date().toISOString(),
  bio: 'Learning a little more English every day.',
};
function record(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid saved object');
  return value as Record<string, unknown>;
}
function number(value: unknown, fallback: number): number {
  if (value === undefined) return fallback;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('Invalid saved number');
  return value;
}
function text(value: unknown, fallback: string): string {
  if (value === undefined) return fallback;
  if (typeof value !== 'string') throw new Error('Invalid saved text');
  return value;
}
function date(value: unknown): string {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) throw new Error('Invalid saved date');
  return value;
}
export function decodeProfile(value: unknown): UserProfile {
  const raw = record(value);
  return {
    name: text(raw.name, defaultProfile.name), bio: text(raw.bio, defaultProfile.bio),
    joinDate: raw.joinDate === undefined ? defaultProfile.joinDate : date(raw.joinDate),
    ...(raw.profilePicture === undefined ? {} : { profilePicture: text(raw.profilePicture, '') }),
  };
}
export const levelRequirement = (level: number) => Math.floor(10 * Math.pow(1.5, level - 1));
export function calculateLevel(minutes: number) {
  let level = 1, used = 0;
  while (minutes >= used + levelRequirement(level)) { used += levelRequirement(level); level++; }
  return level;
}
/** Add new fields to older installations without discarding existing progress. */
export function decodeProgress(value: unknown): UserProgress {
  const raw = record(value);
  const result = { ...defaultProgress };
  const keys = ['totalMinutesSpoken', 'experiencePoints', 'sessionsCompleted', 'averageScore', 'scoreCount', 'streak'] as const;
  keys.forEach(key => { result[key] = number(raw[key], defaultProgress[key]); });
  if (result.averageScore > 100 || !Number.isInteger(result.scoreCount)) throw new Error('Invalid saved score');
  result.currentLevel = calculateLevel(result.totalMinutesSpoken);
  result.lastSessionDate = raw.lastSessionDate == null ? null : date(raw.lastSessionDate);
  if (raw.achievements !== undefined && (!Array.isArray(raw.achievements) || !raw.achievements.every(item => typeof item === 'string'))) throw new Error('Invalid achievements');
  result.achievements = [...new Set((raw.achievements as string[] | undefined) ?? [])];
  result.completions = {};
  for (const [id, item] of Object.entries(raw.completions === undefined ? {} : record(raw.completions))) {
    const completion = record(item);
    const score = number(completion.score, -1), total = number(completion.total, 0);
    if (!/^(reading|module):[\w-]+$/.test(id) || !validScore(score, total)) throw new Error('Invalid completion');
    result.completions[id] = { score, total, xp: number(completion.xp, 0), completedAt: date(completion.completedAt) };
  }
  result.writingDrafts = {};
  for (const [id, item] of Object.entries(raw.writingDrafts === undefined ? {} : record(raw.writingDrafts))) {
    const draft = record(item);
    if (!/^[\w-]+$/.test(id) || ['__proto__', 'constructor', 'prototype'].includes(id) || typeof draft.text !== 'string') throw new Error('Invalid draft');
    result.writingDrafts[id] = { text: draft.text, updatedAt: date(draft.updatedAt) };
  }
  result.units = decodeUnits(raw.units);
  // Older versions had no day ledger. Recover only dates backed by saved activity records.
  const knownDates = [result.lastSessionDate, ...Object.values(result.completions).map(item => item.completedAt), ...Object.values(result.units).map(item => item.completedAt)].filter((item): item is string => !!item);
  result.practiceDays = raw.practiceDays === undefined ? [...new Set(knownDates.map(item => localDay(new Date(item))))].sort() : normalizeDays(raw.practiceDays);
  result.streak = streakSummary(result.practiceDays).current;
  return result;
}
export function validScore(score: number, total: number) {
  return Number.isInteger(score) && Number.isInteger(total) && total > 0 && score >= 0 && score <= total;
}
export function withScore(current: UserProgress, score: number): UserProgress {
  if (!Number.isFinite(score) || score < 0 || score > 100) return current;
  return { ...current, scoreCount: current.scoreCount + 1,
    averageScore: Math.round((current.averageScore * current.scoreCount + score) / (current.scoreCount + 1)) };
}
/** Completion and its reward live in one saved record; replay is deliberately reward-free. */
export function completeActivity(current: UserProgress, id: string, score: number, total: number, xp: number, at: string): UserProgress {
  if (!/^(reading|module):[\w-]+$/.test(id) || !validScore(score, total) || !Number.isInteger(xp) || xp < 0) return current;
  if (Object.prototype.hasOwnProperty.call(current.completions, id)) return recordPracticeDay(current, at);
  return {
    ...recordPracticeDay(withScore(current, Math.round(score / total * 100)), at),
    experiencePoints: current.experiencePoints + xp,
    sessionsCompleted: current.sessionsCompleted + 1, lastSessionDate: at,
    completions: { ...current.completions, [id]: { score, total, xp, completedAt: at } },
  };
}
