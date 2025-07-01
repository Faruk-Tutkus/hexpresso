import { auth } from '@api/config.firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useRef } from "react";
import { MMKV } from "react-native-mmkv";

const Logout = () => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    const performLogout = async () => {
      try {
        console.log("Logout işlemi başlıyor...");
        
        // Firebase'den çıkış yap
        await signOut(auth);
        console.log("Firebase logout tamamlandı");

        // Google'dan da çıkış yap
        try {
          await GoogleSignin.signOut();
          console.log("Google Sign-In logout tamamlandı");
        } catch (googleError) {
          console.log("Google signOut hatası:", googleError);
          // Hata olsa bile devam et
        }

        // MMKV cache'lerini temizle
        try {
          const signsStorage = new MMKV({ id: 'signs_data' });
          signsStorage.clearAll();
          console.log("MMKV signs_data temizlendi");
          
          const seersStorage = new MMKV({ id: 'seers_data' });
          seersStorage.clearAll();
          console.log("MMKV seers_data temizlendi");
          
          // Diğer olası MMKV storage'ları da temizle
          const defaultStorage = new MMKV();
          defaultStorage.clearAll();
          console.log("MMKV default storage temizlendi");
        } catch (mmkvError) {
          console.log("MMKV temizleme hatası:", mmkvError);
        }

        // AsyncStorage'ı tamamen temizle
        try {
          const allKeys = await AsyncStorage.getAllKeys();
          console.log("AsyncStorage keys:", allKeys);
          
          if (allKeys.length > 0) {
            await AsyncStorage.multiRemove(allKeys);
            console.log("AsyncStorage tüm keys silindi");
          }
          
          // Ekstra güvenlik için clear() da çağır
          await AsyncStorage.clear();
          console.log("AsyncStorage clear() tamamlandı");
        } catch (asyncError) {
          console.log("AsyncStorage temizleme hatası:", asyncError);
        }

        // Cache temizleme işlemleri tamamlandıktan sonra navigation yap
        if (isMountedRef.current) {
          console.log("StartScreen'e yönlendiriliyor...");
          router.replace('/src/screens/side/StartScreen');
        }

      } catch (error) {
        console.log("Logout hatası:", error);
        // Hata durumunda da navigation yap
        if (isMountedRef.current) {
          router.replace('/src/screens/side/StartScreen');
        }
      }
    };

    performLogout();

    // Component unmount olduğunda flag'i güncelle
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return null;
};

export default Logout;