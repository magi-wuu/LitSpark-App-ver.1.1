import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors as c } from '../constants/theme';

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.background },
  content: { padding: 20, paddingBottom: 40, width: '100%', maxWidth: 680, alignSelf: 'center', gap: 16 },
  card: { padding: 20, borderRadius: 24, backgroundColor: c.surface, gap: 12 },
  heading: { fontSize: 28, fontWeight: '800', color: c.navy, flexShrink: 1 },
  title: { fontSize: 20, fontWeight: '700', color: c.navy, flexShrink: 1 },
  body: { fontSize: 16, color: c.navy, flexShrink: 1 },
  muted: { fontSize: 14, color: c.muted, flexShrink: 1 },
  button: { backgroundColor: c.navy, minHeight: 48, borderRadius: 18, padding: 15, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: c.surface, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  secondary: { backgroundColor: c.paleBlue }, secondaryText: { color: c.navy },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
});
export function Action({ label, onPress, disabled = false, secondary = false }: { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} aria-disabled={disabled} disabled={disabled} onPress={onPress} style={[ui.button, secondary && ui.secondary, disabled && { borderWidth: 1, borderColor: c.border }]}><Text style={[ui.buttonText, secondary && ui.secondaryText]}>{label}</Text></Pressable>;
}
export function StateScreen({ title, message, loading = false, action, onAction }: { title: string; message: string; loading?: boolean; action?: string; onAction?: () => void }) {
  return <SafeAreaView style={ui.screen}><ScrollView contentContainerStyle={[ui.content, { flexGrow: 1, justifyContent: 'center' }]}><View style={ui.card}>{loading && <ActivityIndicator accessibilityLabel="Loading saved learning data" color={c.navy} size="large" />}<Text accessibilityRole="header" style={ui.heading}>{title}</Text><Text style={ui.body}>{message}</Text>{action && onAction && <Action label={action} onPress={onAction} />}</View></ScrollView></SafeAreaView>;
}
