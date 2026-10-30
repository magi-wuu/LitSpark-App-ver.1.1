import { useStreak } from '../hooks/useStreak';
import { useState } from 'react';
import { Page, Chick, design as d } from '../components/AppDesign';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProgress } from '../contexts/ProgressContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Action, ui } from '../components/LearningUI';
import { colors as c } from '../constants/theme';
export default function ProfileScreen() {
  const router = useRouter();
  const streak = useStreak();
  const { progress, getLevelProgress } = useProgress();
  const { profile, updateProfile, flush, dirty, saving, error } = useUserProfile();
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');
  const save = async () => {
    try { await flush(); setEditing(false); setNotice('Profile saved on this device.'); }
    catch { setNotice('Your profile hasn’t saved. Retry before closing the app.'); }
  };
  return <Page keyboard>
    <View style={{ alignItems: 'center', gap: 12 }}><Chick size={100} /><Text style={d.eyebrow}>YOUR LITSPARK JOURNEY</Text></View>
    <Text accessibilityRole="header" style={ui.heading}>My profile</Text>
    <View style={ui.card}>{editing ? <>
      <Text style={ui.body}>Your name</Text><TextInput accessibilityLabel="Your name" value={profile.name} onChangeText={name => { setNotice(''); updateProfile({ name }); }} maxLength={80} style={{ padding: 14, borderWidth: 1, borderColor: c.muted, borderRadius: 12, color: c.navy, fontSize: 18 }} />
      <Text style={ui.body}>About you</Text><TextInput accessibilityLabel="About you" value={profile.bio} onChangeText={bio => { setNotice(''); updateProfile({ bio }); }} multiline maxLength={500} style={{ padding: 14, minHeight: 100, borderWidth: 1, borderColor: c.muted, borderRadius: 12, color: c.navy, fontSize: 16, textAlignVertical: 'top' }} />
      <Action label={saving ? 'Saving…' : 'Save changes'} disabled={saving} onPress={() => { void save(); }} />
    </> : <><Text style={ui.title}>{profile.name || 'Learner'}</Text><Text style={ui.body}>{profile.bio || 'Make this space your own.'}</Text><Action secondary label="Edit profile" onPress={() => { setEditing(true); setNotice(''); }} /></>}
      <Text accessibilityLiveRegion="polite" style={ui.muted}>{error === 'save' ? 'Not saved — use Retry saving above.' : saving || dirty ? 'Saving profile…' : 'Saved on this device'}</Text>
      {!!notice && <Text accessibilityRole="alert" style={ui.body}>{notice}</Text>}
    </View>
    <View style={ui.card}><Text style={ui.title}>Your learning</Text><Text style={ui.body}>{streak.current}-day streak · Best: {streak.longest} days</Text><Text style={ui.body}>Practice level {getLevelProgress().currentLevel} · {progress.experiencePoints} XP</Text><Text style={ui.body}>{Object.keys(progress.completions).length + Object.values(progress.units).reduce((sum, unit) => sum + unit.completedSteps.length, 0)} activities completed</Text><Text style={ui.body}>{Math.floor(progress.totalMinutesSpoken)} minutes spoken</Text><Text style={ui.body}>{progress.scoreCount ? `First-completion quiz average: ${progress.averageScore}%` : 'Finish your first quiz to see a score.'}</Text></View>
    <Text style={ui.muted}>Your profile, drafts, and progress are stored locally. Clearing app data or uninstalling can remove them. Cloud backup and accounts are not available yet.</Text>
  </Page>;
}
