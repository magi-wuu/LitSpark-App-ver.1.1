import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ArrowLeft, Send, Award, MessageCircle } from "lucide-react-native";
import avatar from "../assets/images/LS.png";
const API_BASE = "https://lsapp-backend.vercel.app"; // <-- set this

type ChatMessage = {
  id: string;
  text: string;
  sender: "user" | "ai";
};

const topics = [
  { id: "1", name: "Greetings", icon: "👋" },
  { id: "2", name: "Food & Dining", icon: "🍽️" },
  { id: "3", name: "Travel", icon: "✈️" },
  { id: "4", name: "Shopping", icon: "🛍️" },
  { id: "5", name: "Hobbies", icon: "🎨" },
];

export default function ChatScreen() {
  const router = useRouter();

  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: "Hello! How can I help you practice today?",
      sender: "ai",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const generateAIResponse = async (userText: string) => {
    if (!userText.trim()) return;

    setIsThinking(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userText,
          conversationMode: selectedTopic.name,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();
      const aiText = data.aiText;

      if (!aiText) throw new Error("Empty AI response");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: aiText.trim(),
          sender: "ai",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Sorry — I couldn’t respond right now. Please try again.",
          sender: "ai",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    await generateAIResponse(userMessage.text);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7FC]">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-[#F4F7FC] border-b border-[#E1E8F2]">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color="#102B50" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <Image
            source={avatar}
            style={{ width: 32, height: 32 }}
            className="rounded-full bg-[#FFD45C]"
          />
          <Text className="ml-2 text-lg font-bold text-[#102B50]">
            Chat Practice
          </Text>
        </View>

        <TouchableOpacity className="p-2">
          <Award size={24} color="#102B50" />
        </TouchableOpacity>
      </View>    

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4 pt-2"
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View
            className={`mb-4 max-w-[80%] ${
              item.sender === "user" ? "self-end ml-auto" : "self-start"
            }`}
          >
            <View
              className={`rounded-3xl p-4 ${
                item.sender === "user"
                  ? "bg-[#102B50]"
                  : "bg-[#E7EFFD]"
              }`}
            >
              <Text
                className={`${
                  item.sender === "user"
                    ? "text-white"
                    : "text-[#102B50]"
                }`}
              >
                {item.text}
              </Text>
            </View>

            {item.sender === "ai" && (
              <View className="mt-1 flex-row items-center">
                <Image
                  source={avatar}
                  style={{ width: 16, height: 16 }}
                  className="rounded-full bg-[#FFD45C]"
                />
                <Text className="text-xs text-gray-500 ml-1">LitSpark</Text>
              </View>
            )}
          </View>
        )}
      />

      {/* AI typing indicator */}
      {isThinking && (
        <View className="px-4 pb-2">
          <Text className="text-sm italic text-gray-400">
            AI is typing…
          </Text>
        </View>
      )}

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="border-t border-[#E1E8F2] bg-white"
      >
        <View className="flex-row items-center px-4 py-2">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
            className="flex-1 border border-[#E7EFFD] rounded-full px-4 py-2 mr-2 bg-[#F4F7FC]"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim()}
            className="bg-[#102B50] p-3 rounded-full"
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
