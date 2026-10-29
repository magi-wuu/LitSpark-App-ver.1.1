import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StoryCard } from "./components/StoryCard";
import { StoryReader } from "./components/StoryReader";
import { QuizView } from "./components/QuizView";
import { CompletionModal } from "./components/CompletionModal";
import { stories as initialStories } from "./data/stories";
import { Story } from "./types/story";
import { BookOpen } from "lucide-react-native";
import { router, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useProgress } from "../contexts/ProgressContext";


type ViewMode = 'grid' | 'reader' | 'quiz';

export default function HomeScreen() {
  const {updateScore} = useProgress();
  const [stories, setStories] = useState(initialStories);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showCompletion, setShowCompletion] = useState(false);
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 });

    const handleBackPress = () => {
        router.back();
      };

  const handleStorySelect = (story: Story) => {
    setSelectedStory(story);
    setViewMode('reader');
  };

  const handleCloseReader = () => {
    setViewMode('grid');
    setSelectedStory(null);
  };

  const handleStartQuiz = () => {
    setViewMode('quiz');
  };

  const handleQuizComplete = (score: number, total: number) => {
  if (!selectedStory) return;

  setQuizScore({ score, total });
  updateScore(Math.round((score / total) * 100));
    // Update story progress
    setStories(prev =>
      prev.map(s =>
        s.id === selectedStory.id
          ? { ...s, progress: 100 }
          : s
      )
    );

    setShowCompletion(true);
  };

  const handleCloseCompletion = () => {
    setShowCompletion(false);
    handleCloseReader();
  };

  if (viewMode === 'reader' && selectedStory) {
    return (

      <View style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <StoryReader
          story={selectedStory}
          onClose={handleCloseReader}
          onComplete={handleStartQuiz}
        />
      </View>
    );
  }

  if (viewMode === 'quiz' && selectedStory) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <QuizView
          story={selectedStory}
          onClose={handleCloseReader}
          onComplete={handleQuizComplete}
        />
        <CompletionModal
          visible={showCompletion}
          score={quizScore.score}
          total={quizScore.total}
          onClose={handleCloseCompletion}
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7FC]" edges={['top']}>
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
        </View>

        <View style={{ width: 40 }} />
      </View>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View 
        className="bg-white px-6 py-6"
        style={{
          shadowColor: '#367CE8',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center mb-2">
          <View className="bg-[#367CE8] w-10 h-10 rounded-full items-center justify-center mr-3">
            <BookOpen size={20} color="white" />
          </View>
          <Text className="text-[#102B50] text-2xl font-bold" style={{ fontFamily: 'System' }}>
            Find your next story
          </Text>
        </View>
        <Text className="text-[#62738A] text-base ml-[52px]">
          A little reading. A whole new world of words.
        </Text>
      </View>

      {/* Story Grid */}
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingVertical: 24, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onPress={() => handleStorySelect(story)}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
