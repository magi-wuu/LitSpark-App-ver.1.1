import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { LearningUnit } from '../content/learningUnit';
import { design as d } from './AppDesign';
import { Action } from './LearningUI';
import { colors as c } from '../constants/theme';

export function UnitPreparation({ lesson }: { lesson: LearningUnit }) {
 return <View style={d.card}><Text style={d.eyebrow}>{lesson.level} · {lesson.duration}</Text><Text accessibilityRole="header" style={d.section}>By the end, you can…</Text>{lesson.outcomes.map(outcome => <Text key={outcome} style={d.body}>• {outcome}</Text>)}<Text style={d.section}>Words to notice</Text>{lesson.words.map(item => <Text key={item.word} style={d.body}><Text style={{ fontWeight: '700' }}>{item.word}</Text> — {item.meaning}</Text>)}<Text style={d.muted}>Read once for the main idea, then again for the details. You can look back while answering.</Text></View>;
}
export function GuidedPractice({ lesson, answers, save }: { lesson: LearningUnit; answers: (number | null)[]; save: (index: number, answer: number) => Promise<void> }) {
 const [selected, setSelected] = useState<Record<number, number>>({});
 const [notice, setNotice] = useState('');
 const [pending, setPending] = useState<number | null>(null);
 const completed = answers.filter(answer => answer !== null).length;
 return <View style={d.card}><Text accessibilityRole="header" style={d.section}>Build your message</Text><Text style={d.muted}>Recommended warm-up · {completed} of {lesson.practice.length} saved. Try these before writing. You can retry without losing points; this warm-up has no separate XP reward.</Text>{lesson.practice.map((question, index) => {
 const choice = selected[index] ?? answers[index];
 return <View key={question.question} style={{ gap: 10, paddingVertical: 12 }}><Text style={[d.body, { fontWeight: '700' }]}>{index + 1}. {question.question}</Text>{question.options.map((option, answer) => <Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: choice === answer, disabled: pending !== null }} disabled={pending !== null} onPress={() => { setSelected(old => ({ ...old, [index]: answer })); setNotice(''); if (answer === question.correct) { setPending(index); void save(index, answer).catch(() => setNotice('Your practice answer has not saved. Tap it again to retry.')).finally(() => setPending(null)); } }} style={{ padding: 14, minHeight: 48, borderWidth: 2, borderRadius: 16, borderColor: choice === answer ? c.blue : c.border, backgroundColor: choice === answer ? c.paleBlue : c.surface }}><Text style={d.body}>{option}</Text></Pressable>)}{choice !== null && choice !== undefined && <View accessibilityLiveRegion="polite" style={{ backgroundColor: c.paleYellow, borderRadius: 16, padding: 14, gap: 8 }}><Text style={[d.body, { fontWeight: '700' }]}>{choice === question.correct ? 'That works!' : 'Try another choice'}</Text><Text style={d.body}>{question.explanation}</Text></View>}</View>;
 })}{!!notice && <Text accessibilityRole="alert" style={d.body}>{notice}</Text>}</View>;
}
export function WritingSupport({ lesson }: { lesson: LearningUnit }) {
 const [show, setShow] = useState(false);
 return <View style={d.card}><Text style={d.section}>Make your meaning clear</Text><Text style={d.body}>{lesson.writing.tip}</Text><Action secondary label={show ? 'Hide example' : 'Show an example'} onPress={() => setShow(value => !value)} />{show && <><Text style={d.muted}>One possible answer — use your own details. Other answers can work.</Text><Text style={d.body}>{lesson.writing.example}</Text></>}<Text style={[d.body, { fontWeight: '700' }]}>Ready for a stretch?</Text><Text style={d.body}>{lesson.writing.challenge}</Text></View>;
}
export function UnitResources({ lesson }: { lesson: LearningUnit }) {
 const [error, setError] = useState('');
 return <View style={d.card}><Text accessibilityRole="header" style={d.section}>Explore with British Council</Text><Text style={d.muted}>Optional external resources · internet required. LitSpark’s stories and questions are original; these sources informed the language focus. No affiliation or endorsement.</Text>{lesson.resources.map(resource => <Action secondary key={resource.url} label={`${resource.title} ↗ · ${resource.kind}`} onPress={() => { setError(''); void Linking.openURL(resource.url).catch(() => setError('Could not open this resource. Check your connection and try again.')); }} />)}{!!error && <Text accessibilityRole="alert" style={d.body}>{error}</Text>}</View>;
}
