import { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StoryCard } from './components/StoryCard';
import { StoryReader } from './components/StoryReader';
import { QuizView } from './components/QuizView';
import { CompletionModal } from './components/CompletionModal';
import { stories } from './data/stories';
import { Story } from './types/story';
import { useProgress } from '../contexts/ProgressContext';
import { Action, ui } from '../components/LearningUI';
export default function ReadingScreen() {
  const router = useRouter();
  const { progress, completeLesson, flush } = useProgress();
  const [selected, setSelected] = useState<Story | null>(null);
  const [mode, setMode] = useState<'grid' | 'reader' | 'quiz'>('grid');
  const [result, setResult] = useState<{ score: number; total: number; replay: boolean } | null>(null);
  const replay = useRef(false);
  const close = () => { setMode('grid'); setSelected(null); setResult(null); };
  const complete = async (score: number, total: number) => {
    if (!selected) return;
    await completeLesson(`reading:${selected.id}`, score, total, 10);
    await flush();
    setResult({ score, total, replay: replay.current });
  };
  if (mode === 'reader' && selected) return <StoryReader story={selected} onClose={close} onComplete={() => setMode('quiz')} />;
  if (mode === 'quiz' && selected) return <View style={{ flex: 1 }}><QuizView story={selected} onClose={close} onComplete={complete} /><CompletionModal visible={!!result} score={result?.score ?? 0} total={result?.total ?? 0} replay={result?.replay} onClose={close} /></View>;
  return <SafeAreaView style={ui.screen}><ScrollView contentContainerStyle={ui.content}>
    <Action secondary label="Back to home" onPress={() => router.back()} />
    <Text accessibilityRole="header" style={ui.heading}>Find your next story</Text><Text style={ui.body}>Read, reflect, and practice. Completed stories stay marked when you return.</Text>
    <Text style={ui.muted}>Earn 10 XP the first time you finish a story quiz. Replays are for practice.</Text>
    {stories.length === 0 && <View style={ui.card}><Text style={ui.title}>New stories are on the way</Text><Text style={ui.body}>Try an everyday English lesson while we prepare more reading.</Text><Action label="Explore lessons" onPress={() => router.push('/esl')} /></View>}
    {stories.map(story => <StoryCard key={story.id} story={{ ...story, progress: progress.completions[`reading:${story.id}`] ? 100 : 0 }} onPress={() => { replay.current = !!progress.completions[`reading:${story.id}`]; setSelected(story); setMode('reader'); }} />)}
  </ScrollView></SafeAreaView>;
}
