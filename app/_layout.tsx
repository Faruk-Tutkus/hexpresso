import { NoInternetModal } from '@components';
import { useDailyNotificationManager, useDailyRewardManager } from '@hooks';
import { AuthProvider, ThemeProvider, ToastProvider, useAuth, useTheme } from "@providers";
import { useNetInfo } from '@react-native-community/netinfo';
import '@utils/i18n';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from "expo-router";
import * as SystemUI from 'expo-system-ui';
import { useEffect, useState } from "react";
import mobileAds from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function AppContent() {
  const { theme, colors } = useTheme();
  const user = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(true);
  const netInfo = useNetInfo();
  const { autoInitializeDailyNotifications } = useDailyNotificationManager();
  const { autoClaimDailyReward, validateRewardSecurity } = useDailyRewardManager();

  useEffect(() => {
    if (netInfo.isConnected !== null) {
      setIsConnected(netInfo.isConnected);
    }
  }, [netInfo.isConnected]);

  const handleRetry = () => {
    // Force re-check network connection
    if (netInfo.isConnected !== null) {
      setIsConnected(netInfo.isConnected);
    }
  };

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  // Auto-initialize daily notifications when user is authenticated
  useEffect(() => {
    if (user?.user?.uid) {
      console.log('👤 User authenticated, auto-initializing daily notifications...');
      // Add a small delay to ensure everything is loaded
      setTimeout(() => {
        autoInitializeDailyNotifications();
      }, 1000);
    }
  }, [user?.user?.uid, autoInitializeDailyNotifications]);

  // Auto-claim daily reward when user is authenticated
  useEffect(() => {
    if (user?.user?.uid) {
      console.log('💰 User authenticated, checking daily reward...');
      // Add a small delay to ensure everything is loaded
      setTimeout(async () => {
        // Önce güvenlik kontrolü yap
        const isSecure = await validateRewardSecurity();
        
        if (isSecure) {
          autoClaimDailyReward();
        } else {
          console.warn('🚨 Security check failed, daily reward blocked');
        }
      }, 2000);
    }
  }, [user?.user?.uid, autoClaimDailyReward, validateRewardSecurity]);

  // Notification response handling
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('🔔 Notification response received:', response);
      
      // Check if it's a fortune completion notification
      const data = response.notification.request.content.data;
      if (data && (data.type === 'fortune_completed' || data.type === 'fortune_warning') && user) {
        console.log('🎯 Fortune notification clicked, navigating to MyFortunes');
        router.replace('/src/screens/main/navigator/(tabs)/MyFortunes');
      }
      
      // Check if it's a daily reminder notification
      if (data && data.type === 'daily_reminder' && user) {
        console.log('🌅 Daily reminder notification clicked, navigating to main app');
        router.replace('/src/screens/main/navigator/(tabs)/FortuneTellingScreen');
      }
    });

    return () => subscription.remove();
  }, [router, user]);

  const [fontsLoaded, fontError] = useFonts({
    'Almendra-Regular': require('./src/assets/fonts/Almendra-Regular.ttf'),
    'CroissantOne-Regular': require('./src/assets/fonts/CroissantOne-Regular.ttf'),
    'Domine-Regular': require('./src/assets/fonts/Domine-Regular.ttf'),
    'Domine-Medium': require('./src/assets/fonts/Domine-Medium.ttf'),
    'Domine-SemiBold': require('./src/assets/fonts/Domine-SemiBold.ttf'),
    'Domine-Bold': require('./src/assets/fonts/Domine-Bold.ttf'),
  });

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(adapterStatuses => {
        console.log('Initialization complete!', adapterStatuses);
      });
  }, []);

  // Font loading hatası durumunda da uygulamayı başlat
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <NoInternetModal 
        visible={!isConnected}
        onRetry={handleRetry}
      />
      
      {user && isConnected && (
        <Stack
          //initialRouteName="src/screens/main/navigator"
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 2500,
            statusBarStyle: theme === 'dark' ? 'light' : 'dark',
            statusBarBackgroundColor: colors.background,
            contentStyle: {
              backgroundColor: colors.background,
              marginBottom: insets.bottom,
            },
          }}
        >
          <Stack.Screen name="src/screens/side/SplashScreen/index" />
          <Stack.Screen name="src/screens/auth/Register/index" />
          <Stack.Screen name="src/screens/auth/Login/index" />
          <Stack.Screen name="src/screens/side/StartScreen/index" />
          <Stack.Screen name="src/screens/side/Introduction/index" />
          <Stack.Screen name="src/screens/main/navigator" />
          <Stack.Screen name="src/screens/main/navigator/FortuneScreens/DreamFortune/index" />
          <Stack.Screen name="src/screens/main/navigator/FortuneScreens/HandFortune/index" />
          <Stack.Screen name="src/screens/main/navigator/FortuneScreens/CoffeeFortune/index" />
          <Stack.Screen name="src/screens/main/navigator/(tabs)/MyFortunes/index" />
        </Stack>
      )}
    </>
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