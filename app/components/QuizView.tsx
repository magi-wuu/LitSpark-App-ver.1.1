import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Story } from '../types/story';
import { Action, StateScreen, ui } from '../../components/LearningUI';
import { validScore } from '../../lib/learningState';
import { colors as c } from '../../constants/theme';
interface Props { story: Story; onClose: () => void; onComplete: (score: number, total: number) => Promise<void> }
export function QuizView({ story, onClose, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const locked = useRef(false);
  const finished = useRef(false);
  useEffect(() => { locked.current = false; finished.current = false; }, [index]);
  const total = story.questions.length;
  const question = story.questions[index];
  if (!question || !question.options.length || !validScore(question.correctAnswer + 1, question.options.length)) return <StateScreen title="This quiz isn’t ready yet" message="This story needs valid practice questions. Choose another story while we update it." action="Back to stories" onAction={onClose} />;
  const choose = (value: number) => {
    if (locked.current || finished.current) return;
    locked.current = true;
    setAnswer(value);
    if (value === question.correctAnswer) setScore(current => current + 1);
  };
  const next = async () => {
    if (answer === null || finished.current) return;
    finished.current = true;
    if (index < total - 1) {
      setIndex(index + 1); setAnswer(null);
      return;
    }
    setBusy(true); setError('');
    try { await onComplete(score, total); }
    catch { setError('Your result hasn’t saved yet. It is still available here. Try saving again; you won’t earn duplicate rewards.'); finished.current = false; }
    finally { setBusy(false); }
  };
  return <SafeAreaView style={ui.screen}><ScrollView contentContainerStyle={ui.content}>
    <Action secondary label="Back to stories" onPress={onClose} disabled={busy} />
    <Text accessibilityRole="header" style={ui.heading}>Comprehension quiz</Text><Text style={ui.muted}>Question {index + 1} of {total}</Text>
    <View style={ui.card}><Text style={ui.title}>{question.question}</Text>
      {question.options.map((option, optionIndex) => <Action key={optionIndex} secondary={answer !== optionIndex} label={`${answer === optionIndex ? 'Selected: ' : ''}${option}`} disabled={answer !== null} onPress={() => choose(optionIndex)} />)}
    </View>
    {answer !== null && <View style={[ui.card, { backgroundColor: c.paleBlue }]}><Text accessibilityRole="header" style={ui.title}>{answer === question.correctAnswer ? 'Correct!' : 'Keep learning'}</Text><Text style={ui.body}>{answer === question.correctAnswer ? 'You understood this part of the story.' : `The correct answer is: ${question.options[question.correctAnswer]}`}</Text><Action label={busy ? 'Saving result…' : error ? 'Retry saving result' : index < total - 1 ? 'Next question' : 'Finish quiz'} disabled={busy} onPress={() => { void next(); }} /></View>}
    {!!error && <Text accessibilityRole="alert" style={ui.body}>{error}</Text>}
  </ScrollView></SafeAreaView>;
}
