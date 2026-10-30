import { recordPracticeDay } from '../lib/streak';
import { recordUnitAnswer, saveWritingDraft, toggleReviewCheck, completeUnitActivity } from '../lib/journeyState';
import { UnitStep } from '../content/learningUnit';
import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStore } from '../hooks/useLocalStore';
import { defaultProgress, decodeProgress, UserProgress, calculateLevel, levelRequirement, completeActivity, withScore } from '../lib/learningState';

interface ProgressContextType {
  progress: UserProgress;
  loaded: boolean;
  saving: boolean;
  dirty: boolean;
  error: 'load' | 'save' | null;
  retry: () => Promise<void>;
  flush: () => Promise<void>;
  addSpeakingTime: (minutes: number) => void;
  addExperience: (points: number) => void;
  updateScore: (score: number) => void;
  completeLesson: (id: string, score: number, total: number, xp: number) => Promise<void>;
  saveDraft: (id: string, text: string) => Promise<void>;
  answerUnitQuestion: (index: number, answer: number, unitId?: string, practice?: boolean) => Promise<void>;
  checkUnitReview: (index: number, unitId?: string) => Promise<void>;
  finishUnitStep: (step: UnitStep, unitId?: string) => Promise<void>;
  finishWritingPractice: () => Promise<void>;
  getLevelProgress: () => { currentLevel: number; progress: number; minutesForNext: number };
  resetProgress: () => void;
}
const ProgressContext = createContext<ProgressContextType | undefined>(undefined);
export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: progress, update, ...storage } = useLocalStore('userProgress', defaultProgress, decodeProgress);
  const completeLesson = useCallback((id: string, score: number, total: number, xp: number) =>
    update(current => completeActivity(current, id, score, total, xp, new Date().toISOString())), [update]);
  const saveDraft = useCallback((id: string, text: string) => update(current => saveWritingDraft(current, id, text, new Date().toISOString())), [update]);
  const answerUnitQuestion = useCallback((index: number, answer: number, unitId?: string, practice?: boolean) => update(current => recordUnitAnswer(current, index, answer, unitId, practice)), [update]);
  const checkUnitReview = useCallback((index: number, unitId?: string) => update(current => toggleReviewCheck(current, index, unitId)), [update]);
  const finishUnitStep = useCallback((step: UnitStep, unitId?: string) => update(current => completeUnitActivity(current, step, new Date().toISOString(), unitId)), [update]);
  const finishWritingPractice = useCallback(() => update(current => recordPracticeDay(current, new Date().toISOString())), [update]);
  const addSpeakingTime = (minutes: number) => {
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    void update(current => {
      const total = current.totalMinutesSpoken + minutes;
      const level = calculateLevel(total);
      const achievements = new Set(current.achievements);
      if (level > current.currentLevel) achievements.add(`level_${level}`);
      if (total >= 10) achievements.add('10_minutes');
      if (total >= 60) achievements.add('1_hour');
      if (total >= 300) achievements.add('5_hours');
      return { ...recordPracticeDay(current, new Date().toISOString()), totalMinutesSpoken: total, currentLevel: level,
        experiencePoints: current.experiencePoints + Math.floor(minutes * 10),
        sessionsCompleted: current.sessionsCompleted + 1, lastSessionDate: new Date().toISOString(), achievements: [...achievements] };
    }).catch(() => {});
  };
  const addExperience = (points: number) => {
    if (Number.isFinite(points) && points > 0) void update(current => ({ ...current, experiencePoints: current.experiencePoints + Math.floor(points) })).catch(() => {});
  };
  const updateScore = (score: number) => { void update(current => withScore(current, score)).catch(() => {}); };
  const getLevelProgress = () => {
    let used = 0;
    for (let i = 1; i < progress.currentLevel; i++) used += levelRequirement(i);
    const needed = levelRequirement(progress.currentLevel);
    const minutes = progress.totalMinutesSpoken - used;
    return { currentLevel: progress.currentLevel, progress: Math.max(0, Math.min(100, Math.round(minutes / needed * 100))), minutesForNext: Math.max(0, needed - minutes) };
  };
  const resetProgress = () => { void update(() => ({ ...defaultProgress })).catch(() => {}); };
  return <ProgressContext.Provider value={{ progress, ...storage, completeLesson, saveDraft, answerUnitQuestion, checkUnitReview, finishUnitStep, finishWritingPractice, addSpeakingTime, addExperience, updateScore, getLevelProgress, resetProgress }}>{children}</ProgressContext.Provider>;
};
export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within a ProgressProvider');
  return context;
}
