import { View, Text, Pressable } from 'react-native';
import { Story } from '../types/story';
import { Clock, BookOpen } from 'lucide-react-native';


interface StoryCardProps {
  story: Story;
  onPress: () => void;
}

export function StoryCard({ story, onPress }: StoryCardProps) {
  const difficultyColors = {
    Beginner: 'bg-[#E7EFFD]',
    Intermediate: 'bg-[#FFF4CF]',
    Advanced: 'bg-[#FFD45C]'
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${story.title}, ${story.difficulty}${story.progress === 100 ? ", completed" : ""}`}
      onPress={onPress}
      className="bg-white rounded-3xl p-6 mb-4 mx-4 active:scale-[0.98]"
      style={{
        shadowColor: '#2463C4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="flex-row flex-wrap justify-between items-start mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-[#102B50] text-xl font-bold mb-2" style={{ fontFamily: 'System' }}>
            {story.title}
          </Text>
        </View>
        <View className={`${difficultyColors[story.difficulty]} px-3 py-1 rounded-full`}>
          <Text className="text-[#102B50] text-xs font-semibold uppercase tracking-wider">
            {story.difficulty}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-4">
        <Clock size={16} color="#62738A" />
        <Text className="text-[#62738A] text-sm ml-2">
          {story.readingTime} min read
        </Text>
      </View>

      {story.progress > 0 && (
        <View className="mt-2">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[#62738A] text-xs">{story.progress === 100 ? "Completed — practice again anytime" : "Progress"}</Text>
            <Text className="text-[#2463C4] text-xs font-semibold">{story.progress}%</Text>
          </View>
          <View className="h-2 bg-[#E7EFFD] rounded-full overflow-hidden">
            <View 
              className="h-full bg-[#2463C4] rounded-full"
              style={{ width: `${story.progress}%` }}
            />
          </View>
        </View>
      )}

      {story.progress === 0 && (
        <View className="flex-row items-center">
          <BookOpen size={16} color="#2463C4" />
          <Text className="text-[#2463C4] text-sm ml-2 font-medium">
            Start Reading
          </Text>
        </View>
      )}
    </Pressable>
  );
}
