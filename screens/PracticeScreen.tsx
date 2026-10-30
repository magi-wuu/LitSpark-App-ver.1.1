import { GameIcon } from '../components/GameArt';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowUpRight } from 'lucide-react-native';
import { useProgress } from '../contexts/ProgressContext';
import { Page, Chick, XPBadge, design as d } from '../components/AppDesign';
import { colors as c } from '../constants/theme';
export default function PracticeScreen() {
  const router = useRouter();
  const { progress } = useProgress();
  const options = [
    { title: 'Reading library', body: 'Short stories, vocabulary, and comprehension.', route: '/readingMod', kind: 'book', color: c.paleBlue },
    { title: 'Writing practice', body: 'Pick a prompt and return to your saved drafts.', route: '/writing', kind: 'pencil', color: c.paleYellow },
    { title: 'Everyday English', body: 'Explore practical situations at your own pace.', route: '/esl', kind: 'path', color: c.paleBlue },
    { title: 'Speaking buddy', body: 'Practice out loud with the AI conversation tool.', route: '/conversation', kind: 'mic', color: c.paleYellow },
    { title: 'Chat practice', body: 'Find your words through a text conversation.', route: '/chat', kind: 'chat', color: c.paleBlue },
  ] as const;
  return <Page sky><View style={[d.row, { justifyContent: 'space-between', flexWrap: 'wrap' }]}><Text accessibilityRole="header" style={d.title}>A little extra practice</Text><XPBadge value={progress.experiencePoints} /></View>
    <View style={[d.row, { backgroundColor: c.paleYellow, borderRadius: 24, padding: 16 }]}><Chick size={76} /><Text style={[d.body, { flex: 1 }]}>Pick what feels useful today. Your learning journey will be here when you’re ready.</Text></View>
    {options.map(({ title, body, route, kind, color }) => <Pressable key={route} accessibilityRole="button" onPress={() => router.push(route)} style={[d.row, { backgroundColor: c.surface, padding: 20, borderRadius: 24 }]}><View style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}><GameIcon kind={kind} size={47} /></View><View style={{ flex: 1, gap: 7 }}><Text style={d.section}>{title}</Text><Text style={d.muted}>{body}</Text></View><ArrowUpRight color={c.navy} size={19} /></Pressable>)}
    <Text style={d.muted}>Reading, writing, and lessons work locally. Chat and speaking need an internet connection and the external AI service.</Text>
  </Page>;
}
