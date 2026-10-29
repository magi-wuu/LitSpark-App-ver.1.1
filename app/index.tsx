import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowUpRight, ArrowRight, BookOpen, MessageCircle, Mic, Sparkles, Trophy, UserRound } from 'lucide-react-native';
import { useProgress } from '../contexts/ProgressContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { colors as c } from '../constants/theme';

export default function HomePage() {
  const router = useRouter();
  const { progress, getLevelProgress } = useProgress();
  const { profile } = useUserProfile();
  const level = getLevelProgress();
  return (
    <SafeAreaView style={s.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <View style={s.brand}>
            <Image source={require('../assets/images/icon.png')} style={s.logo} />
            <View><Text style={s.brandName}>LitSpark</Text><Text style={s.eyebrow}>A LITTLE PRACTICE. A BIG SPARK.</Text></View>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Open your profile" onPress={() => router.push('/profile')} style={s.profile}><UserRound size={22} color={c.navy} /></Pressable>
        </View>
        <Text style={s.greeting}>Hello, {profile.name === 'New Learner' ? 'learner' : profile.name} 👋</Text>
        <Text style={s.heading}>Your English.{'\n'}A little stronger.</Text>
        <Text style={s.subtitle}>Build confidence, one conversation at a time.</Text>
        <View style={s.hero}>
          <View style={s.heroCopy}>
            <View style={s.tag}><Sparkles size={13} color={c.navy} /><Text style={s.tagText}>YOUR SPEAKING BUDDY</Text></View>
            <Text style={s.heroTitle}>Let’s talk{'\n'}about your day.</Text>
            <Text style={s.heroBody}>No pressure. Just you, your voice, and a little practice.</Text>
          </View>
          <Image source={require('../assets/images/LS.png')} style={s.mascot} contentFit="contain" />
          <Pressable accessibilityRole="button" onPress={() => router.push('/conversation')} style={s.heroButton}><Mic size={20} color={c.navy} /><Text style={s.buttonText}>Start speaking</Text><ArrowRight size={20} color={c.navy} /></Pressable>
        </View>
        <View style={s.sectionHeader}><Text style={s.sectionTitle}>Find your next spark</Text><Text style={s.small}>Go at your own pace</Text></View>
        <View style={s.grid}>
          <Pressable accessibilityRole="button" onPress={() => router.push('/esl')} style={[s.tile, { backgroundColor: c.paleBlue }]}>
            <View style={s.tileTop}><View style={[s.icon, { backgroundColor: c.blue }]}><BookOpen color="white" size={24} /></View><ArrowUpRight color={c.navy} size={22} /></View>
            <Text style={s.tileTitle}>Everyday English</Text><Text style={s.tileBody}>Small lessons. Real-life confidence.</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/chat')} style={[s.tile, { backgroundColor: c.paleYellow }]}>
            <View style={s.tileTop}><View style={[s.icon, { backgroundColor: c.yellow }]}><MessageCircle color={c.navy} size={24} /></View><ArrowUpRight color={c.navy} size={22} /></View>
            <Text style={s.tileTitle}>Chat practice</Text><Text style={s.tileBody}>Find the words, at your own pace.</Text>
          </Pressable>
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push('/readingMod')} style={s.reading}><View style={[s.icon, { backgroundColor: c.paleBlue }]}><BookOpen color={c.blue} size={24} /></View><View style={{ flex: 1 }}><Text style={s.tileTitle}>A story, a new perspective</Text><Text style={s.tileBody}>Read something short. Learn something new.</Text></View><ArrowRight size={20} color={c.navy} /></Pressable>
        <View style={s.sectionHeader}><Text style={s.sectionTitle}>Look how far you’ve come</Text><Trophy size={20} color={c.blue} /></View>
        <View style={s.progressCard}>
          <View style={s.progressHeader}><Text style={s.tileTitle}>Practice level {level.currentLevel}</Text><Text style={s.small}>{level.progress}% to next level</Text></View>
          <View style={s.track}><View style={[s.fill, { width: `${level.progress}%` }]} /></View>
          <View style={s.stats}>{[{ value: Math.floor(progress.totalMinutesSpoken), label: 'minutes spoken' }, { value: progress.sessionsCompleted, label: 'sessions' }, { value: progress.experiencePoints, label: 'XP earned' }].map(stat => <View key={stat.label} style={s.stat}><Text style={s.statValue}>{stat.value}</Text><Text style={s.small}>{stat.label}</Text></View>)}</View>
          {progress.sessionsCompleted === 0 && <Text style={s.encouragement}>Your first conversation is a great place to start.</Text>}
        </View>
        <Text style={s.footer}>Made for your journey by LitSpark Youth</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.background }, content: { padding: 24, paddingBottom: 36, maxWidth: 680, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }, brand: { flexDirection: 'row', alignItems: 'center', gap: 10 }, logo: { width: 44, height: 44, borderRadius: 14 }, brandName: { fontSize: 21, fontWeight: '800', color: c.navy }, eyebrow: { fontSize: 8, letterSpacing: 1, color: c.muted, marginTop: 3 }, profile: { padding: 13, backgroundColor: c.surface, borderRadius: 24 },
  greeting: { color: c.muted, fontSize: 15, marginBottom: 10 }, heading: { fontSize: 36, lineHeight: 42, fontWeight: '800', color: c.navy, letterSpacing: -1 }, subtitle: { fontSize: 15, lineHeight: 23, color: c.muted, marginTop: 12, marginBottom: 24 },
  hero: { backgroundColor: c.navy, borderRadius: 30, padding: 22, overflow: 'hidden' }, heroCopy: { width: '64%', zIndex: 1 }, tag: { backgroundColor: c.yellow, padding: 7, borderRadius: 12, flexDirection: 'row', gap: 5, alignSelf: 'flex-start', alignItems: 'center' }, tagText: { fontSize: 9, fontWeight: '800', color: c.navy }, heroTitle: { color: 'white', fontSize: 27, fontWeight: '700', lineHeight: 33, marginTop: 16 }, heroBody: { color: '#CADBF4', fontSize: 13, lineHeight: 20, marginTop: 10 }, mascot: { position: 'absolute', right: 15, top: 65, width: '33%', height: 115 }, heroButton: { backgroundColor: c.yellow, borderRadius: 19, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }, buttonText: { fontSize: 16, fontWeight: '700', color: c.navy },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 28, marginBottom: 14 }, sectionTitle: { fontSize: 18, fontWeight: '700', color: c.navy }, small: { fontSize: 11, color: c.muted }, grid: { flexDirection: 'row', gap: 12 }, tile: { flex: 1, padding: 18, borderRadius: 25 }, tileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }, icon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, tileTitle: { fontSize: 16, fontWeight: '700', color: c.navy }, tileBody: { fontSize: 13, lineHeight: 19, color: c.muted, marginTop: 6 }, reading: { flexDirection: 'row', gap: 14, alignItems: 'center', backgroundColor: c.surface, borderRadius: 25, padding: 18, marginTop: 12 },
  progressCard: { backgroundColor: c.surface, borderRadius: 25, padding: 20 }, progressHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', alignItems: 'center' }, track: { height: 8, backgroundColor: c.paleBlue, borderRadius: 8, marginTop: 16, overflow: 'hidden' }, fill: { height: 8, backgroundColor: c.blue, borderRadius: 8 }, stats: { flexDirection: 'row', marginTop: 20 }, stat: { flex: 1, alignItems: 'center', gap: 5 }, statValue: { color: c.navy, fontSize: 24, fontWeight: '700' }, encouragement: { color: c.muted, fontSize: 12, textAlign: 'center', marginTop: 20, lineHeight: 18 }, footer: { color: c.muted, textAlign: 'center', fontSize: 11, marginTop: 28 },
});
