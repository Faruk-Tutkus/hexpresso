import { AuthProvider, ThemeProvider, ToastProvider, useTheme } from "@providers";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";


export function AppContent() {
  const { theme, colors } = useTheme();
  const [fontsLoaded] = useFonts({
    'Almendra-Regular': require('./src/assets/fonts/Almendra-Regular.ttf'),
    'CroissantOne-Regular': require('./src/assets/fonts/CroissantOne-Regular.ttf'),
    'Domine-Regular': require('./src/assets/fonts/Domine-Regular.ttf'),
    'Domine-Medium': require('./src/assets/fonts/Domine-Medium.ttf'),
    'Domine-SemiBold': require('./src/assets/fonts/Domine-SemiBold.ttf'),
    'Domine-Bold': require('./src/assets/fonts/Domine-Bold.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Stack
      initialRouteName="src/screens/main/Introduction/index"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        statusBarStyle: theme === 'dark' ? 'light' : 'dark',
        statusBarBackgroundColor: colors.background,
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