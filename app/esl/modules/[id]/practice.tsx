import { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { modules } from '../../../data/modules';
import QuestionCard from '../../../components/QuestionCard';
import FeedbackPanel from '../../../components/FeedbackPanel';
import { useProgress } from '../../../../contexts/ProgressContext';
import { Action, StateScreen, ui } from '../../../../components/LearningUI';
export default function PracticeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const module = modules.find(item => item.id === id);
  const { completeLesson, flush, progress } = useProgress();
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const answered = useRef(false);
  const advancing = useRef(false);
  useEffect(() => { answered.current = false; advancing.current = false; }, [index]);
  const question = module?.questions[index];
  if (!module || !question) return <StateScreen title="This lesson isn’t ready" message="Choose another lesson while we update its practice questions." action="Back to lessons" onAction={() => router.replace('/esl')} />;
  const handleAnswer = (answer: string | number) => {
    if (answered.current || advancing.current) return;
    answered.current = true;
    const isCorrect = answer === question.correctAnswer;
    setCorrect(isCorrect);
    if (isCorrect) setCorrectCount(count => count + 1);
    setFeedback(true);
  };
  const next = async () => {
    if (!answered.current || advancing.current) return;
    advancing.current = true;
    if (index < module.questions.length - 1) {
      setFeedback(false); setIndex(index + 1);
      return;
    }
    setSaving(true); setError(''); setFeedback(false);
    try {
      await completeLesson(`module:${module.id}`, correctCount, module.questions.length, correctCount);
      await flush();
      router.replace({ pathname: '/esl/modules/[id]/complete', params: { id: module.id } });
    } catch {
      setError('Your result hasn’t saved. Retry here before leaving; the same lesson won’t award XP twice.');
      advancing.current = false;
    } finally { setSaving(false); }
  };
  return <SafeAreaView style={ui.screen}>
    <View style={{ padding: 16, gap: 10 }}><Action secondary label="Back to lessons" disabled={saving} onPress={() => router.replace('/esl')} /><Text style={ui.muted}>Question {index + 1} of {module.questions.length}{progress.completions[`module:${module.id}`] ? ' · Practice replay (no additional XP)' : ''}</Text></View>
    <QuestionCard key={`${module.id}:${index}`} question={question} onAnswer={handleAnswer} disabled={feedback || saving || !!error} />
    <FeedbackPanel visible={feedback} correct={correct} explanation={question.explanation} onContinue={() => { void next(); }} />
    {(saving || !!error) && <View style={{ padding: 20, gap: 12 }}><Text accessibilityRole={error ? 'alert' : undefined} style={ui.body}>{saving ? 'Saving your result…' : error}</Text>{!!error && <Action label="Retry saving result" onPress={() => { void next(); }} />}</View>}
  </SafeAreaView>;
}
