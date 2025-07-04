import '@utils/i18n';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
export default function Index() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return <Redirect href="/src/screens/side/SplashScreen" />;
} 