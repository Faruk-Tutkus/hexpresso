import { auth } from '@api/config.firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { MMKV } from "react-native-mmkv";

const Logout = () => {
  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth);
        const storage = new MMKV({ id: 'signs_data' });
        storage.clearAll();
        await AsyncStorage.clear();
      } catch (error) {
        console.log(error);
      }
    };
    doLogout();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed, user:", user);
      if (!user) {
        router.replace('/src/screens/side/StartScreen');
      }
    });
    return () => unsubscribe();
  }, []);

  return null;
};

export default Logout;