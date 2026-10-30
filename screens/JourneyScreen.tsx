import { Text, View, Pressable, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Check, ArrowRight } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { Page, Chick, XPBadge, ProgressTrack, PrimaryButton, design as d } from '../components/AppDesign';
import { GameIcon, CloudBackdrop } from '../components/GameArt';
import { StreakBadge } from '../components/StreakBadge';
import { useProgress } from '../contexts/ProgressContext';
import { learningUnits, unitActivities } from '../content/learningUnit';
import { getUnit, nextUnitStep, canOpenStep, isUnitAvailable } from '../lib/journeyState';
import { colors as c } from '../constants/theme';
export default function JourneyScreen() {
  const router = useRouter(); const { progress } = useProgress();
  const finished = learningUnits.filter(lesson => !!getUnit(progress, lesson.id).completedAt).length;
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 360 || fontScale > 1.2;
  const nodeSize = compact ? 76 : 90;
  return <Page sky>
    <View style={[d.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text accessibilityRole="header" style={d.section}>Learning journey</Text><View style={[d.row, { gap: 6 }]}><StreakBadge /><XPBadge value={progress.experiencePoints} /></View></View>
    <Text style={d.muted}>{finished} of 3 units complete · Original stories, language practice, and writing. Start with Unit 1 and build on what you know.</Text>
    {learningUnits.map(learningUnit => {
      const unit = getUnit(progress, learningUnit.id), next = nextUnitStep(unit);
      const unlocked = isUnitAvailable(progress, learningUnit.id);
      return <View key={learningUnit.id} style={{ gap: 18 }}>
    <View style={{ borderRadius: 28, backgroundColor: c.navy, padding: 20, gap: 16, overflow: 'hidden' }}>
      <CloudBackdrop dark />
      <View style={{ flexDirection: compact ? 'column' : 'row', alignItems: compact ? 'flex-start' : 'center', gap: 10 }}><View style={{ flex: 1, gap: 10 }}><Text style={[d.eyebrow, { color: '#D7E4F8' }]}>UNIT {learningUnit.number} · {unlocked ? unit.completedAt ? 'COMPLETED' : 'YOUR NEXT ADVENTURE' : 'UP AHEAD'}</Text><Text style={[d.section, { color: c.surface, fontSize: 25 }]}>{learningUnit.title}</Text><Text style={{ color: '#E3EEFF', fontSize: 14 }}>{learningUnit.goal}</Text></View><Chick pose="cloud" size={compact ? 100 : 123} /></View>
      <ProgressTrack completed={unit.completedSteps.length} total={3} dark />
    </View>
    <Text style={d.muted}>{!unlocked ? 'Complete the previous unit to unlock this one.' : unit.completedAt ? 'You’ve completed this unit. Revisit any activity to practice.' : 'Follow your next step. You can revisit completed activities any time.'}</Text>
    <View style={{ paddingVertical: 10 }}>
      {unitActivities.map((activity, index) => {
        const done = unit.completedSteps.includes(activity.id), current = unlocked && next === activity.id;
        const available = unlocked && canOpenStep(unit, activity.id);
        const kind = activity.id === 'reading' ? 'book' : activity.id === 'writing' ? 'pencil' : 'review';
        return <View key={activity.id}>
          <Pressable disabled={!available} accessibilityRole="button" aria-disabled={!available} accessibilityState={{ disabled: !available }} accessibilityLabel={`${activity.title}, ${done ? 'completed, practice again' : current ? 'your next activity' : 'finish the previous activity first'}`} onPress={() => router.push({ pathname: '/unit/[id]', params: { id: learningUnit.id, step: activity.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: compact ? 12 : 16, marginLeft: compact ? 0 : index % 2 ? 26 : 0 }}>
            <View style={{ width: nodeSize, height: nodeSize, padding: 5, borderRadius: 50, borderWidth: 2, borderColor: current ? '#FFF5C6' : '#FFFFFF', backgroundColor: current ? '#FFEAA0' : '#DCEBFF', shadowColor: '#3264A5', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 8 }}>
              <View style={{ flex: 1, borderRadius: 45, backgroundColor: current ? '#FFD45C' : '#F6FAFF', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 5, borderColor: current ? '#D7AA36' : '#B6D0F3' }}><GameIcon kind={kind} size={compact ? 56 : 66} /></View>
              {done && <View style={{ position: 'absolute', right: -3, top: -3, backgroundColor: c.blue, borderWidth: 3, borderColor: c.surface, borderRadius: 17, width: 29, height: 29, alignItems: 'center', justifyContent: 'center' }}><Check color={c.surface} size={17} strokeWidth={3} /></View>}
            </View>
            <View style={{ flex: 1, padding: compact ? 12 : 15, backgroundColor: c.surface, borderRadius: 23, gap: 8, borderWidth: current ? 1 : 0, borderColor: '#D7E7FA' }}>
              {current && <View style={{ alignSelf: 'flex-start', backgroundColor: c.paleYellow, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5 }}><Text style={{ color: '#765100', fontSize: 11, fontWeight: '800' }}>YOU’RE HERE</Text></View>}
              <Text style={[d.body, { fontWeight: '700' }]}>{activity.title}</Text><Text style={d.muted}>{done ? 'Completed · practice again' : current ? activity.description : 'Up next'}</Text>
              {current && <View style={{ alignSelf: 'flex-start', backgroundColor: c.blue, paddingVertical: 8, paddingHorizontal: 18, borderRadius: 16 }}><Text style={{ color: c.surface, fontSize: 14, fontWeight: '800' }}>Start →</Text></View>}
            </View>
          </Pressable>
          <Svg width={120} height={44} accessible={false}><Path d={compact ? 'M38 0 V44' : index === 0 ? 'M45 0 C45 20 71 22 71 44' : index === 1 ? 'M71 0 C71 20 45 22 45 44' : 'M45 0 V44'} stroke="#8EB9ED" strokeWidth={3} strokeDasharray="4 8" fill="none" /></Svg>
        </View>;
      })}
      <View style={[d.row, { backgroundColor: c.paleYellow, borderRadius: 25, padding: 17 }]}><GameIcon kind="chest" size={75} /><View style={{ flex: 1, gap: 7 }}><Text style={d.section}>{unit.completedAt ? `Unit ${learningUnit.number} complete!` : `Unit ${learningUnit.number} milestone`}</Text><Text style={d.muted}>{unit.completedAt ? 'You practiced reading, writing, and revising.' : 'Earn 30 XP across the three activities.'}</Text></View></View>
    </View>
    {!!unit.completedAt && <PrimaryButton label="View unit summary" onPress={() => router.push({ pathname: '/unit/[id]', params: { id: learningUnit.id, step: 'complete' } })} />}
    </View>;
    })}
    <View style={d.card}><GameIcon kind="chest" size={70} /><Text style={d.section}>{finished === 3 ? 'Three units. A growing voice.' : 'Your journey: 90 XP across 9 activities'}</Text><Text style={d.muted}>Rewards recognise completing practice, not a certified English level. Your writing is self-reviewed.</Text></View>
  </Page>;
}
