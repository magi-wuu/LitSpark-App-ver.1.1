import { Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useStreak } from '../hooks/useStreak';
import { GameIcon } from './GameArt';
import { colors as c } from '../constants/theme';
export function StreakBadge() {
  const router = useRouter(); const streak = useStreak();
  return <Pressable accessibilityRole="button" accessibilityLabel={`${streak.current}-day streak. ${streak.practicedToday ? 'Practice completed today.' : 'Finish an activity today.'} View streak details.`} onPress={() => router.push('/streak')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: c.surface, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 24, minHeight: 46 }}><GameIcon kind="flame" size={28} /><Text style={{ fontSize: 14, fontWeight: '800', color: c.navy }}>{streak.current}</Text></Pressable>;
}
