import { Tabs } from 'expo-router';
import { BottomNavigation } from '../../components/AppDesign';
export default function MainTabs() {
  return <Tabs tabBar={props => <BottomNavigation {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: '#F4F7FC' } }}>
    <Tabs.Screen name="home" options={{ title: 'Home' }} />
    <Tabs.Screen name="learn" options={{ title: 'Learn' }} />
    <Tabs.Screen name="practice" options={{ title: 'Practice' }} />
    <Tabs.Screen name="account" options={{ title: 'Profile' }} />
  </Tabs>;
}
