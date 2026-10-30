import { View, Text, ScrollView, Pressable, LayoutChangeEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Story } from '../types/story';
import { X } from 'lucide-react-native';
import { useState, useEffect } from 'react';

interface StoryReaderProps {
  story: Story;
  onClose: () => void;
  onComplete: () => void;
}

export function StoryReader({ story, onClose, onComplete }: StoryReaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Show button after a short delay if content doesn't need scrolling
  useEffect(() => {
    if (contentHeight > 0 && containerHeight > 0) {
      // If content fits within container (no scrolling needed), show button
      if (contentHeight <= containerHeight + 50) {
        const timer = setTimeout(() => {
          setShowCompleteButton(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [contentHeight, containerHeight]);

  // Fallback: Always show button after 3 seconds
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!showCompleteButton) {
        setShowCompleteButton(true);
      }
    }, 3000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollableHeight = contentSize.height - layoutMeasurement.height;
    
    if (scrollableHeight <= 0) {
      setScrollProgress(100);
      if (!showCompleteButton) {
        setShowCompleteButton(true);
      }
      return;
    }
    
    const scrollPercentage = (contentOffset.y / scrollableHeight) * 100;
    setScrollProgress(Math.min(100, Math.max(0, scrollPercentage)));

    if (scrollPercentage > 80 && !showCompleteButton) {
      setShowCompleteButton(true);
    }
  };

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerHeight(event.nativeEvent.layout.height);
  };

  const paragraphs = story.content ? story.content.split('\n\n').filter(p => p.trim()) : [];

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7FC]" edges={['top']}>
      {/* Header */}
      <View 
        className="bg-white px-4 py-4 flex-row justify-between items-center"
        style={{
          shadowColor: '#2463C4',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-1 mr-4">
          <Text className="text-[#102B50] text-2xl font-bold" style={{ fontFamily: 'System' }}>
            {story.title}
          </Text>
          <Text className="text-[#62738A] text-sm mt-1">
            {story.difficulty} • {story.readingTime} min read
          </Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to stories" onPress={onClose} style={{ minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' }}>
          <X size={24} color="#102B50" />
        </Pressable>
      </View>

      {/* Progress Bar */}
      <View className="h-1 bg-[#F4F7FC]">
        <View 
          className="h-full bg-[#2463C4]"
          style={{ width: `${scrollProgress}%` }}
        />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 24, flexGrow: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
      >
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <Text 
              key={index}
              className="text-[#102B50] text-lg leading-8 mb-6"
              style={{ fontFamily: 'System' }}
            >
              {paragraph}
            </Text>
          ))
        ) : (
          <Text className="text-[#62738A] text-lg">This story has no text yet. Return to the library and choose another story.</Text>
        )}
      </ScrollView>

      {/* Complete Button */}
      {showCompleteButton && paragraphs.length > 0 && (
        <View
          style={{ padding: 16 }}
        >
          <Pressable
            accessibilityRole="button"
            onPress={onComplete}
            className="bg-[#2463C4] rounded-full py-4 px-8 active:scale-95"
            style={{
              shadowColor: '#2463C4',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text className="text-white text-center text-lg font-bold">
              Take the Quiz
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
