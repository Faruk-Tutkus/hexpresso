import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "./ThemeContext";


export function AppContent() {
  const { theme, colors } = useTheme();
  return (
    <Stack
      initialRouteName="src/screens/auth/Login/index"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        statusBarStyle: theme === 'dark' ? 'light' : 'dark',
        statusBarBackgroundColor: colors.background,
      }}
    >
      <Stack.Screen name="src/screens/side/SplashScreen/index" />
      <Stack.Screen name="src/screens/auth/Login/index" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider themeColor="dark">
      <AppContent />
    </ThemeProvider>
  );
}