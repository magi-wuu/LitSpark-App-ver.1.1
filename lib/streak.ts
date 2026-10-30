/** Device-local calendar days; elapsed 24-hour periods do not handle DST reliably. */
export function localDay(date = new Date()): string {
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid activity date');
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function dayNumber(day: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error('Invalid practice day');
  const [year, month, date] = day.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, date));
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== date) throw new Error('Invalid practice day');
  return Math.floor(parsed.getTime() / 86400000);
}
export function normalizeDays(value: unknown): string[] {
  if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) throw new Error('Invalid practice days');
  value.forEach(dayNumber);
  return [...new Set(value as string[])].sort();
}
export function streakSummary(days: string[], now = new Date()) {
  const today = localDay(now), todayNumber = dayNumber(today);
  const history = [...new Set(days)].filter(day => dayNumber(day) <= todayNumber).sort();
  let longest = 0, run = 0, previous = -Infinity;
  for (const day of history) {
    const number = dayNumber(day);
    run = number === previous + 1 ? run + 1 : 1;
    longest = Math.max(longest, run); previous = number;
  }
  const last = history.length ? dayNumber(history[history.length - 1]) : -Infinity;
  return { current: last >= todayNumber - 1 ? run : 0, longest, practicedToday: history.includes(today), today };
}
export function recordPracticeDay<T extends { practiceDays: string[]; streak: number }>(current: T, at: string): T {
  const date = new Date(at), day = localDay(date);
  if (current.practiceDays.includes(day)) return current;
  const practiceDays = [...current.practiceDays, day].sort();
  return { ...current, practiceDays, streak: streakSummary(practiceDays, date).current };
}
