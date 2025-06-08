import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@providers";
import { Tabs } from "expo-router";
import * as SystemUI from 'expo-system-ui';

const TabLayout = () => {
  const { theme, colors } = useTheme();
  SystemUI.setBackgroundColorAsync(colors.background);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Tabs.Screen 
        name="HomeScreen/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }} 
      />
      <Tabs.Screen 
        name="HomeScreen/styles"
        options={{
          href: null,
        }} 
      />
    </Tabs>
  )
}

export default TabLayout;