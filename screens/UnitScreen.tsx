import { useEffect, useRef, useState } from 'react';
import { AppState, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Check, Circle, Lightbulb, Target, Sparkles } from 'lucide-react-native';
import { learningUnit, learningUnits, findLearningUnit, unitActivities, UnitStep } from '../content/learningUnit';
import { getUnit, nextUnitStep, canOpenStep, isUnitAvailable } from '../lib/journeyState';
import { useProgress } from '../contexts/ProgressContext';
import { BackHeader, Chick, PrimaryButton, ProgressTrack, design as d } from '../components/AppDesign';
import { Action, StateScreen } from '../components/LearningUI';
import { colors as c } from '../constants/theme';

import { UnitPreparation, GuidedPractice, WritingSupport, UnitResources } from '../components/UnitSupport';

type Step = UnitStep | 'complete';
export default function UnitScreen() {
  const params = useLocalSearchParams<{ id: string; step?: string }>();
  const router = useRouter();
  const { progress, answerUnitQuestion, saveDraft, checkUnitReview, finishUnitStep, flush, saving, dirty, error } = useProgress();
  const lesson = findLearningUnit(params.id) ?? learningUnit;
  const unit = getUnit(progress, lesson.id);
  const followingUnit = learningUnits[lesson.number];
  const initialStep = (): Step => params.step === 'complete' ? 'complete' : unitActivities.some(item => item.id === params.step) ? params.step as UnitStep : nextUnitStep(unit);
  const [step, setStep] = useState<Step>(initialStep);
  const firstUnanswered = unit.readingAnswers.findIndex(answer => answer === null);
  const [questionIndex, setQuestionIndex] = useState(firstUnanswered < 0 ? 0 : firstUnanswered);
  const [quizActive, setQuizActive] = useState(firstUnanswered >= 0);
  const [feedback, setFeedback] = useState<{ answer: number; correct: boolean } | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const working = useRef(false);
  const answered = useRef(false);
  const scroll = useRef<ScrollView>(null);
  const text = progress.writingDrafts[lesson.draftId]?.text ?? '';
  const question = lesson.reading.questions[questionIndex];
  const allRead = unit.readingAnswers.every(answer => answer !== null);

  useEffect(() => {
    setStep(initialStep()); setFeedback(null); setNotice(''); answered.current = false;
    const index = unit.readingAnswers.findIndex(answer => answer === null);
    setQuestionIndex(index < 0 ? 0 : index); setQuizActive(index >= 0);
    // Route changes select an activity; ordinary autosaves must not move the learner's screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, params.step]);
  useEffect(() => {
    const sub = AppState.addEventListener('change', state => { if (state !== 'active') void flush().catch(() => {}); });
    return () => sub.remove();
  }, [flush]);
  const run = async (task: () => Promise<void>) => {
    if (working.current) return;
    working.current = true; setBusy(true); setNotice('');
    try { await task(); }
    catch { setNotice('Your latest work hasn’t saved yet. Try again before leaving. Repeating this action won’t award XP twice.'); }
    finally { working.current = false; setBusy(false); }
  };
  const moveTo = (next: Step) => { setStep(next); router.setParams({ step: next }); setNotice(''); scroll.current?.scrollTo({ y: 0, animated: false }); };
  const finish = (activity: UnitStep) => run(async () => {
    await finishUnitStep(activity, lesson.id); await flush();
    moveTo(activity === 'reading' ? 'writing' : activity === 'writing' ? 'review' : 'complete');
  });
  const leave = () => { void run(async () => { await flush(); router.replace('/learn'); }); };
  const choose = (answer: number) => {
    if (answered.current || busy) return;
    answered.current = true;
    const correct = answer === question.correct;
    setFeedback({ answer, correct });
    if (correct) void answerUnitQuestion(questionIndex, answer, lesson.id).catch(() => setNotice('Your answer is still here, but hasn’t saved. Continue to retry saving.'));
  };
  const nextQuestion = () => {
    if (!feedback) return;
    if (!feedback.correct) { setFeedback(null); answered.current = false; return; }
    void run(async () => {
      await answerUnitQuestion(questionIndex, feedback.answer, lesson.id); await flush();
      if (questionIndex === lesson.reading.questions.length - 1) {
        await finishUnitStep('reading', lesson.id); await flush(); moveTo('writing');
      } else {
        setQuestionIndex(index => index + 1); setFeedback(null); answered.current = false;
      }
    });
  };
  if (!findLearningUnit(params.id)) return <StateScreen title="This unit isn’t available" message="Choose a unit from your learning journey." action="Open learning journey" onAction={() => router.replace('/learn')} />;
  if (!isUnitAvailable(progress, lesson.id)) return <StateScreen title="Your next adventure is ahead" message="Complete the previous unit first, then return to this one." action="Open learning journey" onAction={() => router.replace('/learn')} />;
  if (step === 'complete' && !unit.completedAt) return <StateScreen title="Keep going" message="Your summary will be ready after you review your writing." action="Continue unit" onAction={() => moveTo(nextUnitStep(unit))} />;
  if (step !== 'complete' && !canOpenStep(unit, step)) return <StateScreen title="One little step at a time" message="Finish the previous activity first so you have everything you need for this one." action="Continue your journey" onAction={() => moveTo(nextUnitStep(unit))} />;
  const status = error === 'save' ? 'Not saved — use Retry saving above before closing.' : saving || dirty ? 'Saving your work…' : 'Saved on this device';

  return <SafeAreaView edges={['top', 'left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: c.background }}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 20, paddingBottom: 36, gap: 20, width: '100%', maxWidth: 680, alignSelf: 'center' }}>
      <BackHeader title={lesson.title} onBack={leave} />
      <ProgressTrack completed={unit.completedSteps.length} total={3} />
      {step !== 'complete' && <View style={[d.row, { backgroundColor: c.paleYellow, borderRadius: 23, padding: 12 }]}><Chick pose={step === 'reading' ? 'reading' : 'welcome'} size={74} /><Text style={[d.body, { flex: 1, fontWeight: '600' }]}>{step === 'reading' ? 'Read for the main idea, then find the details.' : step === 'writing' ? 'You’ve got this. Try it in your own words!' : 'A little revision is progress.'}</Text></View>}

      {step === 'reading' && <>
        <UnitPreparation lesson={lesson} /><Text style={d.eyebrow}>ACTIVITY 1 · READ AND UNDERSTAND</Text><Text accessibilityRole="header" style={d.title}>{lesson.reading.title}</Text>
        <View style={d.card}>{lesson.reading.paragraphs.map(paragraph => <Text key={paragraph} style={[d.body, { lineHeight: 27 }]}>{paragraph}</Text>)}</View>
        <View style={[d.card, { backgroundColor: c.paleBlue }]}><Text style={[d.body, { fontWeight: '700' }]}>A useful phrase</Text><Text style={d.body}>{lesson.reading.vocabulary}</Text></View>
        {!quizActive && allRead ? <View style={d.card}><Text style={d.section}>Your reading answers are saved</Text><Text style={d.body}>You’ve practiced all the reading questions. Take the next step or revisit the questions.</Text><PrimaryButton disabled={busy} label={busy ? 'Saving…' : 'Continue to writing'} onPress={() => { void finish('reading'); }} /><Action secondary label="Review reading questions" onPress={() => { setQuizActive(true); setQuestionIndex(0); setFeedback(null); answered.current = false; }} /></View> : <View style={d.card}>
          <Text style={d.eyebrow}>QUESTION {questionIndex + 1} OF {lesson.reading.questions.length}</Text><Text accessibilityRole="header" style={d.section}>{question.question}</Text>
          {question.options.map((option, index) => <Pressable key={option} accessibilityRole="button" accessibilityState={{ disabled: !!feedback, selected: feedback?.answer === index }} aria-disabled={!!feedback || busy} aria-selected={feedback?.answer === index} disabled={!!feedback || busy} onPress={() => choose(index)} style={{ padding: 16, borderRadius: 18, borderWidth: 2, borderColor: feedback?.answer === index ? c.blue : c.border, backgroundColor: feedback?.answer === index ? c.paleBlue : c.surface, minHeight: 48 }}><Text style={d.body}>{option}</Text></Pressable>)}
          {feedback && <View style={{ backgroundColor: c.paleBlue, borderRadius: 20, padding: 16, gap: 12 }}><Text accessibilityRole="header" style={d.section}>{feedback.correct ? 'That’s right!' : 'Have another look'}</Text><Text style={d.body}>{question.explanation}</Text><PrimaryButton disabled={busy} label={busy ? 'Saving…' : !feedback.correct ? 'Try this question again' : questionIndex < lesson.reading.questions.length - 1 ? 'Next question' : 'Continue to writing'} onPress={nextQuestion} /></View>}
        </View>}
      </>}

      {(step === 'writing' || step === 'review') && <>
        {step === 'writing' && <GuidedPractice key={lesson.id} lesson={lesson} answers={unit.practiceAnswers} save={async (index, answer) => { await answerUnitQuestion(index, answer, lesson.id, true); await flush(); }} />}
        <Text style={d.eyebrow}>{step === 'writing' ? 'ACTIVITY 2 · YOUR OWN WORDS' : 'ACTIVITY 3 · REVIEW AND REVISE'}</Text>
        <View style={d.card}><View style={d.row}><Target color={c.blue} size={22} /><Text style={d.eyebrow}>YOUR MISSION</Text></View><Text accessibilityRole="header" style={d.title}>{lesson.writing.title}</Text><Text style={d.body}>{lesson.writing.task}</Text>
          <View style={{ backgroundColor: c.paleBlue, borderRadius: 19, padding: 16, gap: 8 }}><View style={d.row}><Lightbulb color={c.blue} size={22} /><Text style={[d.body, { fontWeight: '700' }]}>Need a little help?</Text></View><Text style={d.body}>{lesson.writing.starter}</Text></View>
        </View>
        <WritingSupport key={lesson.id} lesson={lesson} />
        <View style={d.card}><Text style={d.section}>Your message</Text><TextInput accessibilityLabel="Your unit message" multiline textAlignVertical="top" maxLength={10000} placeholder="Write your message here…" placeholderTextColor={c.muted} value={text} onChangeText={value => { setNotice(''); void saveDraft(lesson.draftId, value).catch(() => {}); }} style={{ minHeight: 190, padding: 16, color: c.navy, backgroundColor: c.surface, fontSize: 18, borderWidth: 1, borderColor: c.muted, borderRadius: 18 }} />
          <Text accessibilityLiveRegion="polite" style={d.muted}>{status}</Text><Text style={d.muted}>{text.length.toLocaleString()} / 10,000 characters</Text>
          <Action secondary label={error === 'save' ? 'Retry saving message' : 'Save message'} disabled={busy} onPress={() => { void run(async () => { await flush(); setNotice('Your message is saved on this device.'); }); }} />
        </View>
        {step === 'writing' ? <>
          <Text style={d.muted}>This is writing practice, not an automatic grade. Write a message to continue, then check and revise it.</Text>
          <PrimaryButton disabled={!text.trim() || busy} label={busy ? 'Saving…' : 'Review my writing'} onPress={() => { void finish('writing'); }} />
          {!text.trim() && <Text style={d.muted}>Start your message to continue to the review.</Text>}
        </> : <View style={d.card}>
          <Text accessibilityRole="header" style={d.section}>Read, check, and revise</Text><Text style={d.muted}>Check each statement after reading your message. Editing the message clears the checks so you can review the revision.</Text>
          {lesson.writing.checks.map((check, index) => <Pressable key={check} accessibilityRole="checkbox" accessibilityLabel={check} accessibilityState={{ checked: unit.reviewChecks[index], disabled: busy }} aria-checked={unit.reviewChecks[index]} aria-disabled={busy} disabled={busy} onPress={() => { void checkUnitReview(index, lesson.id).catch(() => {}); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, minHeight: 48 }}><View style={{ borderWidth: 2, borderColor: c.blue, width: 27, height: 27, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: unit.reviewChecks[index] ? c.blue : c.surface }}>{unit.reviewChecks[index] && <Check color={c.surface} size={20} />}</View><Text style={[d.body, { flex: 1 }]}>{check}</Text></Pressable>)}
          <Text style={d.muted}>Self-review records your practice. It does not verify your English as correct.</Text><PrimaryButton disabled={busy || !text.trim() || !unit.reviewChecks.every(Boolean)} label={busy ? 'Saving your unit…' : unit.completedAt ? 'View unit completion' : 'Finish this unit'} onPress={() => { void finish('review'); }} />
        </View>}
      </>}

      {step === 'complete' && <>
        <View style={{ alignItems: 'center', gap: 14 }}><Chick size={150} /><Text style={d.eyebrow}>UNIT {lesson.number} · COMPLETE</Text><Text accessibilityRole="header" style={[d.title, { textAlign: 'center' }]}>Look what you can do.</Text><Text style={[d.body, { textAlign: 'center' }]}>{lesson.goal} You practised reading, writing, and revising to work towards this goal.</Text></View>
        <View style={[d.card, { backgroundColor: c.paleYellow }]}><View style={d.row}><Sparkles size={26} color="#876000" /><Text style={d.section}>30 XP across three activities</Text></View><Text style={d.body}>First-completion rewards are saved. You can revisit the unit without earning the same rewards again.</Text></View>
        {unit.submittedText && <View style={d.card}><Text style={d.section}>Your first reviewed message</Text><Text style={d.body}>{unit.submittedText}</Text><Text style={d.muted}>Your latest draft is still available when you revisit writing.</Text></View>}
        {followingUnit && <PrimaryButton yellow label={`Continue to Unit ${followingUnit.number}: ${followingUnit.title}`} onPress={() => router.replace({ pathname: '/unit/[id]', params: { id: followingUnit.id } })} />}
        <PrimaryButton label="Back to my learning journey" onPress={leave} /><Action secondary label="Explore more practice" onPress={() => router.replace('/practice')} />
      </>}
      <UnitResources lesson={lesson} />
      {!!notice && <Text accessibilityRole="alert" style={d.body}>{notice}</Text>}
      <Text style={[d.muted, { textAlign: 'center', fontSize: 12 }]}>Progress is saved on this device. Cloud backup isn’t available yet.</Text>
    </ScrollView>
  </KeyboardAvoidingView></SafeAreaView>;
}
