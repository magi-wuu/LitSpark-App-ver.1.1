import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useProgress } from "../contexts/ProgressContext";
import { Mic, Play, ArrowLeft, Square } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import avatar from "../assets/images/LS.png";

interface ConversationMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FeedbackResponse {
  feedback: string;
  response: string;
  improvements?: string[];
}

export default function ConversationScreen() {
  const router = useRouter();
  const { addSpeakingTime, updateScore, getLevelProgress } = useProgress();

  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState("");
  const [lastFeedback, setLastFeedback] = useState<FeedbackResponse | null>(null);
  const [recordingStartTime, setRecordingStartTime] = useState<Date | null>(null);
  const [sessionSpeakingTime, setSessionSpeakingTime] = useState(0);
  const [lastRecordingUri, setLastRecordingUri] = useState<string | null>(null);
  const [conversationMode, setConversationMode] = useState<'practice' | 'chat'>('practice');
  const [isThinking, setIsThinking] = useState(false);
  const [isTTSLoading, setIsTTSLoading] = useState(false);
  const [isUserRecordingPlaying, setIsUserRecordingPlaying] = useState(false);


  const recording = useRef<Audio.Recording | null>(null);
  const sound = useRef<Audio.Sound | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const API_BASE = "https://lsapp-backend.vercel.app";

  const [conversation, setConversation] = useState<ConversationMessage[]>([
    { id: 1, text: "Hello! How are you today?", isUser: false, timestamp: new Date() },
  ]);

  // Auto-scroll when a new message arrives
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  const stopAndUnloadSound = async () => {
    if (!sound.current) return;
    try {
      await sound.current.stopAsync();
      await sound.current.unloadAsync();
    } catch (e) {
      // ignore — happens if already unloaded
    } finally {
      sound.current = null;
      setIsSpeaking(false);
      setIsUserRecordingPlaying(false); // Add this line
    }
  };

    const handleBackPress = () => {
      if (sessionSpeakingTime > 0) {
        addSpeakingTime(sessionSpeakingTime / 60);
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      router.back();
    };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.current = newRecording;
      setIsRecording(true);
      setRecordingStartTime(new Date());
    } catch (err) {
      console.error("Failed to start recording", err);
      Alert.alert("Error", "Failed to start recording. Please check microphone permissions.");
    }
  };

  const stopRecording = async () => {
    if (!recording.current || !recordingStartTime) return;

    const recordingEndTime = new Date();
    const speakingDuration =
      (recordingEndTime.getTime() - recordingStartTime.getTime()) / 1000;

    setSessionSpeakingTime((prev) => prev + speakingDuration);
    setIsRecording(false);
    setIsTranscribing(true);
    setRecordingStartTime(null);

    try {
      // Get URI before unloading
      const uri = recording.current.getURI();
      await recording.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      setLastRecordingUri(uri); // Save URI for playback
      recording.current = null;

      console.log("Recording stopped:", uri);
      console.log(`Speaking duration: ${speakingDuration.toFixed(1)} seconds`);

      // Transcribe audio
      await transcribeAudio(uri);
    } catch (error) {
      console.error("Error stopping recording:", error);
      setIsTranscribing(false);
    }
  };

  const transcribeAudio = async (audioUri: string | null) => {
    if (!audioUri) return;
    setIsTranscribing(true);

    try {
      const audioBlob = await fetch(audioUri).then(res => res.blob());
      const response = await fetch(`${API_BASE}/api/transcribe`, {
        method: "POST",
        headers: {
          "Content-Type": "audio/m4a", // match backend expectation
        },
        body: audioBlob,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();

      const transcribedText = data.text;
      setCurrentTranscription(transcribedText);

      const userMessage: ConversationMessage = {
        id: conversation.length + 1,
        text: transcribedText,
        isUser: true,
        timestamp: new Date(),
      };

      setConversation((prev) => [...prev, userMessage]);

      await generateAIResponse(transcribedText);
    } catch (error) {
      console.error("Transcription error:", error);
      Alert.alert("Error", "Failed to transcribe audio. Please try again.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const generateAIResponse = async (userText: string) => {
    if (!userText || !userText.trim()) return;

    setIsThinking(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userText,
          conversationMode,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }
      const data = await response.json();
      const aiText = data.aiText;

      if (!aiText) {
        Alert.alert("Error", "AI returned an empty response.");
        return;
      }

      const aiMessage: ConversationMessage = {
        id: Date.now(),
        text: aiText.trim(),
        isUser: false,
        timestamp: new Date(),
      };

      await addAIMessage(aiText.trim());
      setLastFeedback({
        feedback: "AI response",
        response: aiText.trim(),
      });
      setHasResponse(true);

    } catch (err) {
      console.error("Groq AI error:", err);
      Alert.alert("Error", "Failed to get AI response.");
    } finally {
      setIsThinking(false);
    }
  };

  const addAIMessage = async (text: string) => {
    if (isTTSLoading || isSpeaking) {return} // prevent overlapping TTS
    const newMessage = { id: Date.now(), text, isUser: false, timestamp: new Date() };
    setConversation((prev) => [...prev, newMessage]);

    setIsTTSLoading(true);

    // Play TTS immediately
    try {
      //make sure to stop any prev audio
      await stopAndUnloadSound();

      console.log("Requesting TTS for text:", text);
      const response = await fetch(`${API_BASE}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) {
            throw new Error(await response.text());
          }

      const data = await response.json();
      if (!data.audio) {
          throw new Error("No audio data received from TTS API");
        }
      const {audio} = data;
      const fileUri = `${FileSystem.cacheDirectory}tts.mp3`;
      // `audio` is a base64-encoded string from the server; write it directly
      await FileSystem.writeAsStringAsync(fileUri, audio, { encoding: FileSystem.EncodingType.Base64 });

      //load sound
      const {sound: newSound, status} = await Audio.Sound.createAsync({ uri: fileUri }, { shouldPlay: false });
      sound.current = newSound;
      setIsTTSLoading(false);
      setIsSpeaking(true);

      // track playback lifecycle
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) {
          // Update your UI for the unloaded state
          return;
        }
        if (status.didJustFinish) {
          setIsSpeaking(false);
          stopAndUnloadSound();
        }
      });

      // play sound only after its loaded
      await newSound.playAsync();
    } catch (err:any) {
      console.error("TTS playback error:", err);
      Alert.alert("Audio Error", `LitSpark couldn't speak right now! Please try again.`);
      setIsTTSLoading(false);
      setIsSpeaking(false);
    }
  };


    const toggleRecording = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isRecording) await stopRecording();
    else await startRecording();
  };

  const playUserRecording = async () => {
    if (!lastRecordingUri) {
      Alert.alert("No recording available");
      return;
    }

    try {
      // If already playing, stop it
      if (isUserRecordingPlaying && sound.current) {
        await stopAndUnloadSound();
        setIsUserRecordingPlaying(false);
        return;
      }

      // Stop any AI speech first
      if (isSpeaking) {
        await stopAndUnloadSound();
        setIsSpeaking(false);
      }

      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri: lastRecordingUri },
        { shouldPlay: true }
      );
      sound.current = playbackObject;
      setIsUserRecordingPlaying(true);

      playbackObject.setOnPlaybackStatusUpdate((status) => {
        if ("isLoaded" in status && status.isLoaded && (status as any).didJustFinish) {
          playbackObject.unloadAsync();
          sound.current = null;
          setIsUserRecordingPlaying(false);
        }
      });
    } catch (err) {
      console.error("Error playing user audio:", err);
      setIsUserRecordingPlaying(false);
    }
  };

  const getRecordingButtonText = () => {
    if (isTranscribing) return "Thinking...";
    if (isRecording) return "Recording...";
    return "Tap to speak";
  };

  const levelProgress = getLevelProgress();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F7FC' }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 }}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={{
            padding: 8,
            borderRadius: 9999,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}
        >
          <ArrowLeft size={24} color="#102B50" />
        </TouchableOpacity>

        <View style={{ flex: 1, marginHorizontal: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#102B50', textAlign: 'center' }}>
            Practice Speaking
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
            <Text style={{ fontSize: 12, color: '#555', marginRight: 8 }}>Level {levelProgress.currentLevel}</Text>
            <View style={{ flex: 1, height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, maxWidth: 100 }}>
              <View style={{ width: `${levelProgress.progress}%`, height: 8, backgroundColor: '#FFD45C', borderRadius: 4 }} />
            </View>
            <Text style={{ fontSize: 10, color: '#777', marginLeft: 8 }}>{levelProgress.progress}%</Text>
          </View>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Session Indicator */}
      {sessionSpeakingTime > 0 && (
        <View style={{ marginHorizontal: 16, marginBottom: 8, padding: 8, backgroundColor: '#d1fae5', borderRadius: 12, borderWidth: 1, borderColor: '#a7f3d0' }}>
          <Text style={{ fontSize: 12, color: '#065f46', textAlign: 'center' }}>
            🎯 Session: {Math.floor(sessionSpeakingTime / 60)}m {Math.floor(sessionSpeakingTime % 60)}s spoken
          </Text>
        </View>
      )}

      {/* AI Avatar */}
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 16 }}>
        <View style={{
          width: 132,
          height: 132,
          borderRadius: 64,
          backgroundColor: '#E7EFFD',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          opacity: isSpeaking ? 0.7 : 1,
        }}>
          <Image
            source={avatar}
            style={{ width: 124, height: 124 }}
            contentFit="contain"
          />
        </View>
        <Text style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
          {isRecording && "Recording…"}
          {isTranscribing && "Understanding..."}
          {isThinking && "Thinking…"}
          {isTTSLoading && "Preparing voice…"}
          {isSpeaking && "Speaking…"}
          {!isRecording &&
          !isTranscribing &&
          !isThinking &&
          !isTTSLoading &&
          !isSpeaking &&
          "Your language buddy"}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginHorizontal: 16, marginTop: 16, gap: 12 }}>
        <TouchableOpacity
          onPress={() => setConversationMode('practice')}
          style={{
            flex: 1,
            paddingVertical: 8,
            backgroundColor: conversationMode === 'practice' ? '#102B50' : '#e2e8f0',
            borderRadius: 12,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: conversationMode === 'practice' ? 'white' : '#102B50', fontWeight: '600' }}>
            Practice English
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setConversationMode('chat')}
          style={{
            flex: 1,
            paddingVertical: 8,
            backgroundColor: conversationMode === 'chat' ? '#102B50' : '#e2e8f0',
            borderRadius: 12,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: conversationMode === 'chat' ? 'white' : '#102B50', fontWeight: '600' }}>
            Chat Normally
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conversation */}
      <ScrollView
        ref={scrollViewRef}  // <-- add this line
        className="flex-1 px-4 py-4 mt-2 bg-white mx-4 rounded-2xl shadow-sm"
        contentContainerStyle={{ paddingBottom: 20 }}
      >

        {conversation.map((message) => (
          <View
            key={message.id}
            style={{
              marginBottom: 16,
              maxWidth: '80%',
              alignSelf: message.isUser ? 'flex-end' : 'flex-start',
            }}
          >
            <View style={{
              padding: 12,
              borderRadius: 16,
              backgroundColor: message.isUser ? '#FFD45C' : '#E7EFFD'
            }}>
              <Text style={{ color: '#102B50' }}>{message.text}</Text>
            </View>
            <Text style={{ fontSize: 10, color: '#555', marginTop: 4 }}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Recording Button */}
      <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 16 }}>
        <Pressable
          onPress={toggleRecording}
          disabled={isTranscribing}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            backgroundColor: isRecording ? '#ef4444' : isTranscribing ? '#9ca3af' : '#102B50'
          }}
        >
          {isRecording ? <Square size={32} color="white" /> : <Mic size={32} color="white" />}
        </Pressable>
        <Text style={{ marginTop: 8, fontSize: 12, color: '#555' }}>{getRecordingButtonText()}</Text>
      </View>

      {/* Playback Controls */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 16, gap: 16 }}>
        <TouchableOpacity
          onPress={playUserRecording}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: isUserRecordingPlaying ? '#ef4444' : '#102B50',
            borderRadius: 9999
          }}
        >
          {isUserRecordingPlaying ? (
            <>
              <Square size={16} color="white" />
              <Text style={{ color: 'white', marginLeft: 8 }}>Stop Your Speech</Text>
            </>
          ) : (
            <>
              <Play size={16} color="white" />
              <Text style={{ color: 'white', marginLeft: 8 }}>Play Your Speech</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            await stopAndUnloadSound();
            setIsSpeaking(false);
            setIsUserRecordingPlaying(false); // Add this line
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: isSpeaking ? '#ef4444' : '#9ca3af',
            borderRadius: 9999
          }}
        >
          <Text style={{ color: 'white', marginLeft: 8 }}>
            {isSpeaking ? 'Stop AI Speech' : 'AI Speech'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
