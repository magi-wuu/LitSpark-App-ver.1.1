import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StorageBoundary } from '../components/StorageBoundary';
import { ProgressProvider } from '../contexts/ProgressContext';
import { UserProfileProvider } from '../contexts/UserProfileContext';
import '../global.css';
import 'react-native-reanimated';

void SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, fontError] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') });
  useEffect(() => {
    // Continue with system fonts if the optional bundled font cannot load.
    if (loaded || fontError) void SplashScreen.hideAsync();
  }, [loaded, fontError]);
  if (!loaded && !fontError) return null;
  return <SafeAreaProvider>
    <UserProfileProvider>
      <ProgressProvider>
        <StorageBoundary>
          <Stack screenOptions={{ headerShown: false }}><Stack.Screen name="index" /><Stack.Screen name="(tabs)" /></Stack>
          <StatusBar style="auto" />
        </StorageBoundary>
      </ProgressProvider>
    </UserProfileProvider>
  </SafeAreaProvider>;
}
