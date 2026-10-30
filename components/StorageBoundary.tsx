import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useProgress } from '../contexts/ProgressContext';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Action, StateScreen, ui } from './LearningUI';
import { colors as c } from '../constants/theme';

export function StorageBoundary({ children }: { children: React.ReactNode }) {
  const learning = useProgress();
  const profile = useUserProfile();
  const retry = () => { void Promise.all([learning.retry(), profile.retry()]).catch(() => {}); };
  if (learning.error === 'load' || profile.error === 'load') return <StateScreen title="We couldn’t open your saved work" message="Your existing data has been left untouched. Check available device storage, close other app tabs if you’re using a browser, and try again. If this continues, contact LitSpark before clearing app data." action="Try loading again" onAction={retry} />;
  if (!learning.loaded || !profile.loaded) return <StateScreen loading title="Getting your learning ready" message="Loading your profile, completed activities, and drafts from this device." />;
  const failed = learning.error === 'save' || profile.error === 'save';
  return <View style={{ flex: 1 }}>
    {failed && <ScrollView style={{ maxHeight: '45%', backgroundColor: c.paleYellow }} contentContainerStyle={{ padding: 16, gap: 10 }}><Text accessibilityRole="alert" style={ui.body}>Some changes haven’t saved to this device. They’re still available while the app stays open. Free up storage and retry before closing.</Text><Action label="Retry saving" onPress={retry} /></ScrollView>}
    {children}
  </View>;
}
