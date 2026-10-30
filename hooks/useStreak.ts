import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useProgress } from '../contexts/ProgressContext';
import { streakSummary } from '../lib/streak';
/** Refresh on resume and at most a minute after midnight, without editing saved history. */
export function useStreak() {
  const { progress } = useProgress();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const refresh = () => setNow(new Date());
    const timer = setInterval(refresh, 60000);
    const sub = AppState.addEventListener('change', state => { if (state === 'active') refresh(); });
    return () => { clearInterval(timer); sub.remove(); };
  }, []);
  return { ...streakSummary(progress.practiceDays, now), now, days: progress.practiceDays };
}
