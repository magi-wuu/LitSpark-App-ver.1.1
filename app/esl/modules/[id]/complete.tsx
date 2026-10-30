import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProgress } from '../../../../contexts/ProgressContext';
import { modules } from '../../../data/modules';
import { Action, StateScreen, ui } from '../../../../components/LearningUI';
export default function CompletionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { progress } = useProgress();
  const module = modules.find(item => item.id === id);
  const completion = module && progress.completions[`module:${module.id}`];
  if (!completion) return <StateScreen title="No completed result yet" message="Complete a lesson to save its result. Opening this page by itself doesn’t award XP." action="Choose a lesson" onAction={() => router.replace('/esl')} />;
  return <SafeAreaView style={ui.screen}><ScrollView contentContainerStyle={ui.content}>
    <Text accessibilityRole="header" style={ui.heading}>Keep your spark going!</Text><Text style={ui.body}>{module.title}</Text>
    <View style={ui.card}><Text style={ui.title}>First completion saved</Text><Text style={ui.body}>{completion.score} / {completion.total} correct · {Math.round(completion.score / completion.total * 100)}%</Text><Text style={ui.title}>{completion.xp} XP awarded on first completion</Text><Text style={ui.muted}>You can replay this lesson to practice. Replays don’t add more XP or change this first-completion result.</Text></View>
    <Action label="Explore more lessons" onPress={() => router.replace('/esl')} /><Action secondary label="Practice this lesson again" onPress={() => router.replace(`/esl/modules/${module.id}/practice`)} />
  </ScrollView></SafeAreaView>;
}
