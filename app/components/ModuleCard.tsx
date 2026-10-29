import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ArrowUpRight, Clock } from 'lucide-react-native';
import { Module } from '../data/modules';
import { useRouter } from 'expo-router';
import { colors as c } from '../../constants/theme';
export default function ModuleCard({ module }: { module: Module }) {
  const router = useRouter();
  return <Pressable accessibilityRole="button" onPress={() => router.push(`/esl/modules/${module.id}` as any)} style={s.card}>
    <View style={s.top}><View style={s.icon}><Text style={{ fontSize: 28 }}>{module.icon}</Text></View><ArrowUpRight size={22} color={c.blue} /></View>
    <Text style={s.title}>{module.title}</Text><Text style={s.body}>{module.description}</Text>
    <View style={s.meta}><Clock size={14} color={c.muted} /><Text style={s.caption}>{module.estimatedTime}</Text><Text style={s.caption}>• {module.questions.length} questions</Text></View>
  </Pressable>;
}
const s = StyleSheet.create({ card: { backgroundColor: c.surface, borderRadius: 26, padding: 22, marginBottom: 14, borderWidth: 1, borderColor: c.border }, top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }, icon: { backgroundColor: c.paleBlue, padding: 12, borderRadius: 18 }, title: { color: c.navy, fontSize: 21, fontWeight: '700' }, body: { color: c.muted, fontSize: 14, lineHeight: 22, marginTop: 8 }, meta: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 18 }, caption: { color: c.muted, fontSize: 12 } });
