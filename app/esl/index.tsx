import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { modules } from '../data/modules';
import ModuleCard from '../components/ModuleCard';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors as c } from '../../constants/theme';
export default function ESLHomeScreen() {
  const router = useRouter();
  return <SafeAreaView style={{ flex: 1, backgroundColor: c.background }}>
    <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back to home" onPress={() => router.push('/')} style={s.back}><ArrowLeft color={c.navy} size={22} /></Pressable>
      <View style={s.label}><Sparkles color={c.blue} size={16} /><Text style={s.labelText}>YOUR EVERYDAY TOOLKIT</Text></View>
      <Text style={s.title}>Small lessons.{'\n'}More confidence.</Text>
      <Text style={s.body}>Find the words for the moments that matter. Pick a topic and go at your own pace.</Text>
      <Text style={s.caption}>{modules.length} topics to explore</Text>
      {modules.map(module => <ModuleCard key={module.id} module={module} />)}
    </ScrollView>
  </SafeAreaView>;
}
const s = StyleSheet.create({ content: { padding: 24, maxWidth: 680, width: '100%', alignSelf: 'center' }, back: { backgroundColor: c.surface, padding: 13, borderRadius: 24, alignSelf: 'flex-start', marginBottom: 28 }, label: { flexDirection: 'row', gap: 7, alignItems: 'center' }, labelText: { color: c.blue, fontWeight: '700', letterSpacing: 1, fontSize: 10 }, title: { color: c.navy, fontSize: 34, lineHeight: 40, fontWeight: '800', marginTop: 12 }, body: { color: c.muted, fontSize: 15, lineHeight: 23, marginTop: 12 }, caption: { color: c.muted, fontSize: 12, marginTop: 28, marginBottom: 14 } });
