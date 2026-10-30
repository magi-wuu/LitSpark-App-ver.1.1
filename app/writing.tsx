import { useEffect, useRef, useState } from 'react';
import { AppState, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProgress } from '../contexts/ProgressContext';
import { writingPrompts } from '../content/writingPrompts';
import { Action, ui } from '../components/LearningUI';
import { colors as c } from '../constants/theme';

export default function WritingScreen() {
  const router = useRouter();
  const { progress, saveDraft, finishWritingPractice, flush, dirty, saving, error } = useProgress();
  const [selected, setSelected] = useState<string | null>(null);
  const [review, setReview] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const finishLock = useRef(false);
  const [notice, setNotice] = useState('');
  const prompt = writingPrompts.find(item => item.id === selected);
  const text = selected ? progress.writingDrafts[selected]?.text ?? '' : '';
  const input = useRef<TextInput>(null);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active') void flush().catch(() => {});
    });
    return () => subscription.remove();
  }, [flush]);
  const leave = async () => {
    try { await flush(); if (selected) { setSelected(null); setReview(false); setNotice(''); } else router.back(); }
    catch { setNotice('Your latest changes haven’t saved. Retry saving before leaving.'); }
  };
  const finish = async () => {
    if (!text.trim() || finishLock.current) return;
    finishLock.current = true; setFinishing(true);
    try { await finishWritingPractice(); await flush(); setNotice('Practice saved for today. Your streak is up to date.'); }
    catch { setNotice('Practice hasn’t saved yet. Retry before closing.'); }
    finally { finishLock.current = false; setFinishing(false); }
  };
  const save = async () => {
    try { await flush(); setNotice('Your draft is saved on this device.'); }
    catch { setNotice('Saving failed. Your draft is still here; try again before closing.'); }
  };
  return <SafeAreaView style={ui.screen}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={ui.content}>
      <Action secondary label={selected ? 'Back to writing prompts' : 'Back to home'} onPress={() => { void leave(); }} />
      <Text accessibilityRole="header" style={ui.heading}>{prompt ? prompt.title : 'Find your words'}</Text>
      <Text style={ui.muted}>Drafts are saved on this device. They don’t sync to other devices.</Text>
      {!prompt ? <>
        <View style={ui.card}><Text style={ui.title}>{Object.values(progress.writingDrafts).some(draft => draft.text.trim()) ? 'Pick up where you left off' : 'Your first draft starts here'}</Text><Text style={ui.body}>Choose a prompt. Use the sentence starter if it helps, then review and revise your own words.</Text></View>
        {writingPrompts.map(item => <View key={item.id} style={ui.card}><Text style={ui.title}>{item.title}</Text><Text style={ui.body}>{item.task}</Text><Action label={progress.writingDrafts[item.id]?.text.trim() ? 'Continue draft' : 'Start writing'} onPress={() => { setSelected(item.id); setReview(false); setNotice(''); }} /></View>)}
      </> : <>
        <View style={ui.card}><Text style={ui.body}>{prompt.task}</Text><Text style={ui.title}>A little help getting started</Text><Text style={ui.body}>{prompt.starter}</Text></View>
        <View style={ui.card}>
          <Text accessibilityRole="header" style={ui.title}>Your draft</Text>
          <TextInput ref={input} accessibilityLabel="Your writing draft" placeholder="Write your message here…" placeholderTextColor={c.muted} multiline maxLength={10000} textAlignVertical="top" value={text}
            onChangeText={value => { setNotice(''); void saveDraft(prompt.id, value).catch(() => {}); }}
            style={{ minHeight: 220, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: c.muted, color: c.navy, backgroundColor: c.surface, fontSize: 18 }} />
          <Text accessibilityLiveRegion="polite" style={ui.muted}>{error === 'save' ? 'Not saved — retry saving before closing.' : saving || dirty ? 'Saving your draft…' : progress.writingDrafts[prompt.id] ? 'Saved on this device' : 'Your draft will save as you type.'}</Text>
          <Text style={ui.muted}>{text.length.toLocaleString()} / 10,000 characters</Text>
          <Action label={error === 'save' ? 'Retry saving draft' : 'Save draft'} onPress={() => { void save(); }} />
          <Action secondary label="Review my writing" disabled={!text.trim()} onPress={() => { setReview(true); input.current?.blur(); }} />
          {!text.trim() && <Text style={ui.muted}>Write something to unlock the review checklist.</Text>}
        </View>
        {review && <View style={ui.card}><Text style={ui.title}>Read, check, and revise</Text>{prompt.checks.map(check => <Text key={check} style={ui.body}>• {check}</Text>)}<Text style={ui.muted}>This is a self-review checklist, not an automatic grade. Try improving one part of your message.</Text><Action label={finishing ? "Saving practice…" : "I’ve reviewed my message"} disabled={finishing || !text.trim()} onPress={() => { void finish(); }} /><Action secondary label="Keep editing" onPress={() => { setReview(false); input.current?.focus(); }} /></View>}
      </>}
      {!!notice && <Text accessibilityRole="alert" style={ui.body}>{notice}</Text>}
    </ScrollView>
  </KeyboardAvoidingView></SafeAreaView>;
}
