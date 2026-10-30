import { GameIcon, CloudBackdrop } from '../components/GameArt';
import { StreakBadge } from '../components/StreakBadge';
import { useStreak } from '../hooks/useStreak';
import { Text, View, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { useProgress } from '../contexts/ProgressContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { learningUnits } from '../content/learningUnit';
import { getUnit, nextUnitStep, currentLearningUnit } from '../lib/journeyState';
import { Page, Chick, XPBadge, ProgressTrack, PrimaryButton, QuickCard, design as d } from '../components/AppDesign';
import { colors as c } from '../constants/theme';
export default function HomeScreen() {
  const router = useRouter();
  const { progress } = useProgress();
  const { profile } = useUserProfile();
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 360 || fontScale > 1.2;
  const streak = useStreak();
  const learningUnit = currentLearningUnit(progress);
  const unit = getUnit(progress, learningUnit.id);
  const finishedUnits = learningUnits.filter(lesson => !!getUnit(progress, lesson.id).completedAt).length;
  const next = nextUnitStep(unit);
  const completed = unit.completedSteps.length;
  const totalActivities = Object.keys(progress.completions).length + Object.values(progress.units).reduce((sum, item) => sum + item.completedSteps.length, 0);
  return <Page sky>
    <View style={[d.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text style={{ fontSize: 25, fontWeight: '800', color: c.navy }}>LitSpark<Text style={{ color: '#956500' }}>✦</Text></Text><View style={[d.row, { gap: 6 }]}><StreakBadge /><XPBadge value={progress.experiencePoints} /></View></View>
    <View style={[d.row, { alignItems: 'center' }]}><View style={{ flex: 1 }}><Text style={[d.body, { marginBottom: 8 }]}>Hi, {profile.name === 'New Learner' ? 'learner' : profile.name || 'learner'}!</Text><Text accessibilityRole="header" style={[d.title, { fontSize: compact ? 28 : 32 }]}>Your English.{"\n"}A little stronger.</Text></View>{!compact && <Chick size={102} />}</View>
    <View style={{ flexDirection: compact ? 'column' : 'row', gap: 10 }}>
      {[{ kind: 'flame' as const, value: streak.current, label: 'day streak' }, { kind: 'spark' as const, value: progress.experiencePoints, label: 'total XP' }, { kind: 'book' as const, value: totalActivities, label: 'activities' }].map(({ kind, value, label }) => <View key={label} style={{ flex: 1, padding: 14, backgroundColor: c.surface, borderRadius: 20, gap: 6, alignItems: 'center' }}><GameIcon kind={kind} size={37} /><Text style={{ fontSize: 23, fontWeight: '800', color: c.navy }}>{value}</Text><Text style={d.muted}>{label}</Text></View>)}
    </View>
    <View style={{ padding: 20, borderRadius: 27, backgroundColor: c.navy, gap: 16, overflow: 'hidden' }}>
      <CloudBackdrop dark />
      <Text style={[d.eyebrow, { color: '#D7E4F8' }]}>UNIT {learningUnit.number} · {learningUnit.theme.toUpperCase()}</Text>
      <View style={d.row}><View style={{ flex: 1, gap: 9 }}><Text style={[d.section, { color: c.surface, fontSize: 25 }]}>{learningUnit.title}</Text><Text style={{ color: '#D7E4F8', fontSize: 14 }}>{next === 'complete' ? 'You did it. Keep your confidence growing.' : next === 'reading' ? 'Start with a story. Find the words for real life.' : next === 'writing' ? 'Reading done. Your words are next.' : 'Your message is ready for a little revision.'}</Text></View>{!compact && <Chick pose="reading" size={94} />}</View>
      <ProgressTrack completed={completed} total={3} dark />
      <PrimaryButton yellow label={next === 'complete' ? 'Revisit your unit' : completed ? 'Continue lesson →' : `Start Unit ${learningUnit.number} →`} onPress={() => router.push(next === 'complete' ? '/learn' : { pathname: '/unit/[id]', params: { id: learningUnit.id, step: next } })} />
    </View>
    <Text accessibilityRole="header" style={d.section}>Your next little milestone</Text>
    <View style={d.card}><View style={[d.row, { justifyContent: 'space-between' }]}><View style={{ flex: 1, gap: 8 }}><Text style={[d.body, { fontWeight: '700' }]}>{finishedUnits === 3 ? 'All three units, complete!' : `Finish Unit ${learningUnit.number}: ${learningUnit.title}`}</Text><Text style={d.muted}>{finishedUnits} of 3 units complete · 30 XP available per unit.</Text></View><GameIcon kind="chest" size={64} /></View><ProgressTrack completed={completed} total={3} /></View>
    <Text accessibilityRole="header" style={d.section}>Quick practice</Text>
    <View style={{ flexDirection: compact ? 'column' : 'row', gap: 12 }}><QuickCard title="Read a story" subtitle="Build your vocabulary" onPress={() => router.push('/readingMod')} /><QuickCard writing title="Write a message" subtitle="Find your own words" onPress={() => router.push('/writing')} /></View>
    <Pressable accessibilityRole="button" onPress={() => router.push('/practice')} style={[d.row, { justifyContent: 'space-between', paddingVertical: 10, minHeight: 48 }]}><Text style={[d.body, { color: c.blue, fontWeight: '700' }]}>Explore all practice</Text><ArrowRight color={c.blue} size={20} /></Pressable>
    <Text style={[d.muted, { textAlign: 'center', fontSize: 12 }]}>A little practice. A big spark. · LitSpark Youth</Text>
  </Page>;
}
