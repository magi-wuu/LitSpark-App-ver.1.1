import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight } from "lucide-react-native";

export default function OnboardingScreen() {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#102B50]">
      <StatusBar style="light" />
      <View className="flex-1 items-center justify-between py-8 px-6">
        {/* LitSpark chick mascot */}
        <View className="flex-1 justify-center items-center w-full">
          <Image
            source={require('../assets/images/LS.png')}
            className="w-72 h-72"
            style={{ width: 280, height: 280 }}
            resizeMode="contain"
          />
        </View>

        {/* Title and button section */}
        <View className="w-full items-center space-y-8 mb-10">
          <Text className="text-4xl font-bold text-white text-center">
            Ready to learn?
          </Text>

          <TouchableOpacity
            onPress={handleStartLearning}
            className="bg-[#FFD45C] py-4 px-8 rounded-full flex-row items-center justify-center w-64"
            activeOpacity={0.8}
          >
            <Text className="text-[#102B50] text-xl font-bold mr-2">
              Start Learning
            </Text>
            <ArrowRight size={24} color="#102B50" />
          </TouchableOpacity>

          <Text className="text-[#7fb3ff] text-center text-base">
            Build your English confidence with your friendly practice buddy.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
