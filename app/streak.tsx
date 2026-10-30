import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, BackHeader, PrimaryButton, design as d } from '../components/AppDesign';
import { GameIcon } from '../components/GameArt';
import { useStreak } from '../hooks/useStreak';
import { localDay } from '../lib/streak';
import { colors as c } from '../constants/theme';
export default function StreakScreen() {
  const router = useRouter(); const streak = useStreak();
  const week = Array.from({ length: 7 }, (_, i) => { const date = new Date(streak.now.getFullYear(), streak.now.getMonth(), streak.now.getDate() - 6 + i); return { date, day: localDay(date) }; });
  return <Page sky><BackHeader title="Your learning streak" onBack={() => router.back()} />
    <View style={[d.card, { alignItems: 'center', backgroundColor: c.paleYellow }]}><GameIcon kind="flame" size={95} /><Text accessibilityRole="header" style={d.title}>{streak.current}-day streak</Text><Text style={[d.body, { textAlign: 'center' }]}>{streak.practicedToday ? 'You’ve practiced today. Keep your spark going tomorrow!' : streak.current ? 'Your streak is still going. Finish an activity today to keep it.' : 'One small activity is all it takes to start your streak.'}</Text><Text style={d.muted}>Longest streak: {streak.longest} {streak.longest === 1 ? 'day' : 'days'}</Text></View>
    <View style={d.card}><Text style={d.section}>Your last seven days</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>{week.map(({ date, day }) => { const done = streak.days.includes(day); return <View key={day} accessible accessibilityLabel={`${date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}: ${done ? 'practiced' : 'no completed practice'}`} style={{ minWidth: 36, flex: 1, alignItems: 'center', gap: 8, paddingVertical: 12, borderRadius: 18, backgroundColor: done ? c.paleYellow : c.paleBlue }}><Text style={d.muted}>{date.toLocaleDateString(undefined, { weekday: 'short' })}</Text>{done ? <GameIcon kind="flame" size={30} /> : <Text style={[d.body, { minHeight: 30 }]}>·</Text>}<Text style={d.body}>{date.getDate()}</Text></View>; })}</View></View>
    <View style={d.card}><Text style={d.section}>Small steps, every day</Text><Text style={d.body}>Finish a reading quiz, lesson activity, reviewed writing practice, or a speaking session to count a day. Replays count as practice without adding duplicate XP.</Text><Text style={d.muted}>Days follow your device’s local calendar. Several activities on the same day count once. If you miss a full day, the current streak restarts; your longest streak and learning progress stay saved.</Text></View>
    <PrimaryButton label="Continue my learning journey" onPress={() => router.replace('/learn')} />
  </Page>;
}
