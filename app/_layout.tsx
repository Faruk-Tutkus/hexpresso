import { AuthProvider, ThemeProvider, ToastProvider, useTheme } from "@providers";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SystemUI from 'expo-system-ui';
import { useEffect } from "react";

export function AppContent() {
  const { theme, colors } = useTheme();
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);
  const [fontsLoaded, fontError] = useFonts({
    'Almendra-Regular': require('./src/assets/fonts/Almendra-Regular.ttf'),
    'CroissantOne-Regular': require('./src/assets/fonts/CroissantOne-Regular.ttf'),
    'Domine-Regular': require('./src/assets/fonts/Domine-Regular.ttf'),
    'Domine-Medium': require('./src/assets/fonts/Domine-Medium.ttf'),
    'Domine-SemiBold': require('./src/assets/fonts/Domine-SemiBold.ttf'),
    'Domine-Bold': require('./src/assets/fonts/Domine-Bold.ttf'),
  });
  
  // Font loading hatası durumunda da uygulamayı başlat
  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <Stack
      //initialRouteName="src/screens/auth/Login/index"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 2500,
        statusBarStyle: theme === 'dark' ? 'light' : 'dark',
        statusBarBackgroundColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="src/screens/side/SplashScreen/index" />
      <Stack.Screen name="src/screens/auth/Register/index" />
      <Stack.Screen name="src/screens/auth/Login/index" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
);
}