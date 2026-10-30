import { GameIcon, CloudBackdrop } from './GameArt';
import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { ArrowLeft } from 'lucide-react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { colors as c } from '../constants/theme';

export const design = StyleSheet.create({
  title: { color: c.navy, fontSize: 30, fontWeight: '800', letterSpacing: -0.8, flexShrink: 1 },
  section: { color: c.navy, fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  body: { color: c.navy, fontSize: 16, flexShrink: 1 },
  muted: { color: c.muted, fontSize: 14, flexShrink: 1 },
  eyebrow: { color: c.blue, fontSize: 11, letterSpacing: 1.2, fontWeight: '800' },
  card: { backgroundColor: c.surface, padding: 20, borderRadius: 25, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
export function Page({ children, keyboard = false, sky = false }: { children: ReactNode; keyboard?: boolean; sky?: boolean }) {
  return <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: c.background }}>
    {sky && <CloudBackdrop />}
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps={keyboard ? 'handled' : 'never'} contentContainerStyle={{ width: '100%', maxWidth: 680, alignSelf: 'center', padding: 20, paddingBottom: 28, gap: 20 }}>{children}</ScrollView>
  </SafeAreaView>;
}
export function Chick({ pose = 'welcome', size = 104 }: { pose?: 'welcome' | 'reading' | 'cloud'; size?: number }) {
  return <Image accessible={false} source={pose === 'cloud' ? require('../assets/images/chick-cloud.png') : pose === 'reading' ? require('../assets/images/chick-reading.png') : require('../assets/images/chick-welcome.png')} contentFit="contain" style={{ width: size, height: size }} />;
}
export function XPBadge({ value }: { value: number }) {
  return <View accessibilityLabel={`${value} experience points`} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: c.surface, borderRadius: 24, paddingHorizontal: 12, paddingVertical: 10 }}><GameIcon kind="spark" size={25} /><Text style={{ color: c.navy, fontSize: 14, fontWeight: '700' }}>{value} XP</Text></View>;
}
export function ProgressTrack({ completed, total, dark = false }: { completed: number; total: number; dark?: boolean }) {
  return <View accessible accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: completed }} aria-valuemin={0} aria-valuemax={total} aria-valuenow={completed} accessibilityLabel="Unit progress" style={{ gap: 8 }}>
    <View style={{ height: 8, backgroundColor: dark ? '#3D5577' : c.paleBlue, borderRadius: 8, overflow: 'hidden' }}><View style={{ width: `${total ? completed / total * 100 : 0}%`, height: 8, borderRadius: 8, backgroundColor: dark ? c.yellow : c.blue }} /></View>
    <Text style={[design.muted, dark && { color: '#D7E4F8' }]}>{completed} of {total} activities</Text>
  </View>;
}
export function BackHeader({ title = 'Your lesson', onBack }: { title?: string; onBack?: () => void }) {
  const router = useRouter();
  return <View style={[design.row, { justifyContent: 'space-between' }]}><Pressable accessibilityRole="button" accessibilityLabel="Back to learning journey" onPress={onBack ?? (() => router.replace('/learn'))} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: c.surface, alignItems: 'center', justifyContent: 'center' }}><ArrowLeft color={c.navy} size={22} /></Pressable><Text accessibilityRole="header" style={[design.section, { flex: 1, textAlign: 'center' }]}>{title}</Text><View style={{ width: 20 }} /></View>;
}
export function PrimaryButton({ label, onPress, yellow = false, disabled = false }: { label: string; onPress: () => void; yellow?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} aria-disabled={disabled} disabled={disabled} onPress={onPress} style={({ pressed }) => ({ minHeight: 50, borderRadius: 19, padding: 15, backgroundColor: yellow ? c.yellow : c.navy, transform: [{ scale: pressed ? 0.98 : 1 }], borderBottomWidth: 3, borderColor: yellow ? '#D8AD36' : '#071B34' })}>
    <Text style={{ color: yellow ? c.navy : c.surface, fontSize: 16, fontWeight: '800', textAlign: 'center' }}>{label}</Text>
  </Pressable>;
}
export function QuickCard({ title, subtitle, onPress, writing = false }: { title: string; subtitle: string; onPress: () => void; writing?: boolean }) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={{ flex: 1, minWidth: 120, backgroundColor: writing ? c.paleYellow : c.paleBlue, borderRadius: 22, padding: 16, gap: 12 }}>
    <GameIcon kind={writing ? 'pencil' : 'book'} size={62} /><Text style={{ color: c.navy, fontSize: 16, fontWeight: '700' }}>{title}</Text><Text style={design.muted}>{subtitle}</Text>
  </Pressable>;
}
export function BottomNavigation({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  return <View style={{ backgroundColor: c.surface, borderTopWidth: 1, borderColor: c.border, paddingTop: 8, paddingBottom: Math.max(insets.bottom, 10), paddingHorizontal: 10 }}>
    <View style={{ flexDirection: 'row', maxWidth: 680, width: '100%', alignSelf: 'center', gap: 4, flexWrap: fontScale > 1.6 ? 'wrap' : 'nowrap' }}>
      {state.routes.map((route, index) => {
        const selected = state.index === index;
        const title = descriptors[route.key].options.title ?? route.name;
        return <Pressable key={route.key} accessibilityRole="tab" accessibilityLabel={title} accessibilityState={{ selected }} aria-selected={selected} onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!selected && !event.defaultPrevented) navigation.navigate(route.name);
        }} style={{ flex: fontScale > 1.6 ? undefined : 1, width: fontScale > 1.6 ? '48%' : undefined, minHeight: 58, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 2, borderRadius: 19, gap: 5, backgroundColor: selected ? c.paleBlue : c.surface }}>
          <GameIcon kind={route.name === 'home' ? 'home' : route.name === 'learn' ? 'book' : route.name === 'practice' ? 'pencil' : 'profile'} size={30} />
          <Text style={{ color: c.navy, fontSize: 12, textAlign: 'center', fontWeight: selected ? '700' : '500' }}>{title}</Text>
        </Pressable>;
      })}
    </View>
  </View>;
}
