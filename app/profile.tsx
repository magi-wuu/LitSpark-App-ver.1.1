import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Edit3, 
  Mail, 
  User, 
  Camera, 
  Award, 
  Trophy, 
  Target,
  Clock,
  Star,
  Calendar,
  Settings,
  Image as ImageIcon
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from 'expo-image-picker';
import { useProgress } from "../contexts/ProgressContext";
import { useUserProfile } from "../contexts/UserProfileContext";

interface UserProfile {
  name: string;
  email: string;
  profilePicture: string;
  joinDate: string;
  bio: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { progress, getLevelProgress } = useProgress();
  const { profile, updateProfile, updateProfilePicture } = useUserProfile();
  
  const [isEditing, setIsEditing] = useState(false);

  const levelProgress = getLevelProgress();

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleChangeProfilePicture = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Show options: Camera, Photo Library, or Random Avatar
    Alert.alert(
      "Change Profile Picture",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: () => pickImage('camera')
        },
        {
          text: "Photo Library", 
          onPress: () => pickImage('library')
        },
        {
          text: "Random Avatar",
          onPress: () => generateRandomAvatar()
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      // Request permissions first
      if (source === 'camera') {
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
        if (!cameraPermission.granted) {
          Alert.alert('Permission needed', 'Camera permission is required to take photos.');
          return;
        }
      } else {
        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!libraryPermission.granted) {
          Alert.alert('Permission needed', 'Photo library permission is required to select photos.');
          return;
        }
      }

      // Launch image picker with appropriate source
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only allow images
        allowsEditing: true, // Allow user to crop/edit
        aspect: [1, 1], // Square aspect ratio for profile pictures
        quality: 0.8, // Good quality but not too large file size
      });

      // If user didn't cancel, update the profile picture
      if (!result.canceled && result.assets[0]) {
        updateProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const generateRandomAvatar = () => {
    const seeds = ["alex", "sam", "jordan", "casey", "riley", "morgan", "taylor", "avery", "quinn", "sage"];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    updateProfilePicture(`https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.floor(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F7FC]">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-white">
        <TouchableOpacity
          onPress={handleBackPress}
          className="p-2 rounded-full bg-gray-100"
        >
          <ArrowLeft size={24} color="#102B50" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-[#102B50]">
          My Profile
        </Text>
        <TouchableOpacity
          onPress={handleEditProfile}
          className="p-2 rounded-full bg-gray-100"
        >
          {isEditing ? (
            <Settings size={24} color="#102B50" />
          ) : (
            <Edit3 size={24} color="#102B50" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="bg-white mx-4 mt-4 rounded-3xl p-6 shadow-sm">
          <View className="items-center">
            <Text className="text-3xl font-bold text-[#102B50] mb-1">
              Hi there!
            </Text>
            {/* Name and Email */}
            <View className="items-center mt-4 w-full">
              {isEditing ? (
                <View className="w-full">
                  <TextInput
                    value={profile.name}
                    onChangeText={(text) => updateProfile({ name: text })}
                    className="text-xl font-bold text-[#102B50] text-center border-b border-gray-300 pb-1 mb-3"
                    placeholder="Your name"
                  />
                  <TextInput
                    value={profile.bio}
                    onChangeText={(text) => updateProfile({ bio: text })}
                    className="text-gray-600 text-center border border-gray-300 rounded-lg p-2"
                    placeholder="Tell us about yourself..."
                    multiline
                    numberOfLines={3}
                  />
                  <TouchableOpacity
                    onPress={handleSaveProfile}
                    className="bg-[#102B50] rounded-full px-6 py-2 mt-4 self-center"
                  >
                    <Text className="text-white font-bold">Save Changes</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="items-center">
                  <Text className="text-xl font-bold text-[#102B50] mb-1">
                    {profile.name}
                  </Text>
                  <Text className="text-gray-600 text-center italic">
                    "{profile.bio}"
                  </Text>
                  <View className="flex-row items-center mt-2">
                    <Calendar size={16} color="#666" />
                    <Text className="text-gray-500 ml-2 text-sm">
                      Joined {formatDate(profile.joinDate)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View className="bg-white mx-4 mt-4 rounded-3xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-[#102B50] mb-4">Learning Stats</Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="items-center flex-1">
              <View className="bg-[#F4F7FC] rounded-full p-3 mb-2">
                <Trophy size={24} color="#102B50" />
              </View>
              <Text className="text-2xl font-bold text-[#102B50]">
                {levelProgress.currentLevel}
              </Text>
              <Text className="text-gray-600 text-sm">Current Level</Text>
            </View>
            
            <View className="items-center flex-1">
              <View className="bg-[#F4F7FC] rounded-full p-3 mb-2">
                <Clock size={24} color="#FFD45C" />
              </View>
              <Text className="text-2xl font-bold text-[#102B50]">
                {formatTime(progress.totalMinutesSpoken)}
              </Text>
              <Text className="text-gray-600 text-sm">Time Spoken</Text>
            </View>
            
            <View className="items-center flex-1">
              <View className="bg-[#F4F7FC] rounded-full p-3 mb-2">
                <Star size={24} color="#4dabf7" />
              </View>
              <Text className="text-2xl font-bold text-[#102B50]">
                {progress.averageScore}%
              </Text>
              <Text className="text-gray-600 text-sm">Avg Score</Text>
            </View>
          </View>

          {/* Level Progress */}
          <View className="bg-[#F4F7FC] rounded-2xl p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-bold text-[#102B50]">
                Level {levelProgress.currentLevel} Progress
              </Text>
              <Text className="text-[#4dabf7] font-bold">
                {levelProgress.progress}%
              </Text>
            </View>
            <View className="bg-gray-200 h-3 rounded-full">
              <View
                className="bg-[#FFD45C] h-3 rounded-full"
                style={{ width: `${levelProgress.progress}%` }}
              />
            </View>
            <Text className="text-gray-600 text-sm mt-2">
                {Math.round(Math.max(0, levelProgress.minutesForNext))} minutes to go Level {levelProgress.currentLevel + 1}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}