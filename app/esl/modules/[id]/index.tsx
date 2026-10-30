import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { modules } from '../../../data/modules';
import { Action, StateScreen, ui } from '../../../../components/LearningUI';
import { useProgress } from '../../../../contexts/ProgressContext';
export default function ModuleIntroScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { progress } = useProgress();
  const module = modules.find(item => item.id === id);
  if (!module) return <StateScreen title="Lesson not found" message="This lesson may have moved. Choose another topic to keep practicing." action="Back to lessons" onAction={() => router.replace('/esl')} />;
  return <SafeAreaView style={ui.screen}><ScrollView contentContainerStyle={ui.content}>
    <Action secondary label="Back to lessons" onPress={() => router.replace('/esl')} />
    <View style={ui.card}><Text style={{ fontSize: 48 }}>{module.icon}</Text><Text accessibilityRole="header" style={ui.heading}>{module.title}</Text><Text style={ui.body}>{module.description}</Text>
      <Text style={ui.muted}>{module.questions.length} questions · {module.estimatedTime}</Text>
      <Text style={ui.body}>{progress.completions[`module:${module.id}`] ? 'You’ve completed this lesson. Practice again any time; replays don’t earn additional XP.' : 'Earn one XP per correct answer on your first completion. You can always replay for practice.'}</Text>
      <Action label={progress.completions[`module:${module.id}`] ? 'Practice again' : 'Start practice'} onPress={() => router.push(`/esl/modules/${module.id}/practice`)} />
    </View>
  </ScrollView></SafeAreaView>;
}
