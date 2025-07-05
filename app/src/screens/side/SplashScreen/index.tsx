import { db } from "@api/config.firebase";
import { Animation } from "@components";
import { useFetchData, useFetchSeers } from "@hooks";
import { useAuth, useTheme } from "@providers";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styles from "./styles";

const SplashScreen = () => {
  const router = useRouter()
  const { theme, colors } = useTheme()
  const { user, loading: authLoading } = useAuth()
  const [texts] = useState([
    "İçindeki gücü keşfet, bugün her şeye yetersin!",
    "Harika bir gün seni bekliyor, mucizelere açık ol!",
    "Kalbinin sesini dinle, doğru yol orada!",
    "Yıldızlar senin için hizalanıyor, dileklerini dile getir!",
    "Her adımın seni başarıya bir adım daha yaklaştırıyor!",
    "Bugün evrenin sana sürprizleri var, gülümse!",
    "Gözlerini kapat ve hayallerini gerçeğe dönüştür!",
    "Potansiyelin sınırsız, bugün yeni bir başlangıç yap!",
    "Geleceğin parlıyor, ışığını saçmaya devam et!",
    "Aradığın cevaplar içinde, sadece inan!",
    "Şans seninle, cesur adımlar at!",
    "Bugün enerjin harika, etrafına neşe saç!",
    "Her bitiş yeni bir başlangıçtır, ileriye bak!",
    "Mutluluk sana doğru geliyor, kalbini açık tut!",
    "Geçmiş tecrübelerin seni güçlendirdi, unutma!",
    "Yarın için heyecanlan, yeni zaferler seni bekliyor!",
 ])

  const [randomText, setRandomText] = useState('');

  useEffect(() => {
    const index = Math.floor(Math.random() * texts.length);
    setRandomText(texts[index]);
  }, []);

  // Yeni hook yapısı - FetchSeers ile aynı
  const { signs, loading: dataLoading, error } = useFetchData(user);
  const { seers, loading: seersLoading, error: seersError } = useFetchSeers(user);

  // Auth ve data durumuna göre yönlendirme
  useEffect(() => {
    const checkAndNavigate = async () => {
      // Auth loading'i bekle
      if (authLoading) {
        console.log('🔄 SplashScreen: Auth loading, bekleniyor...');
        return;
      }

      // User yoksa direkt StartScreen'e git
      if (!user) {
        console.log('👤 SplashScreen: User yok, StartScreen\'e yönlendiriliyor');
        setTimeout(() => {
          router.replace("/src/screens/side/StartScreen");
        }, 3000);
        return;
      }

      // User varsa önce newUser kontrolü yap
      try {
        const userRef = doc(db, "users", user.uid);
        const docRef = await getDoc(userRef);
        
        if (docRef.data()?.newUser) {
          console.log('👤 SplashScreen: Yeni kullanıcı, StartScreen\'e yönlendiriliyor');
          setTimeout(() => {
            router.replace("/src/screens/side/StartScreen");
          }, 3000);
          return;
        }
      } catch (error) {
        console.error('❌ SplashScreen: User dokümanı kontrol hatası:', error);
        // Hata durumunda StartScreen'e yönlendir
        setTimeout(() => {
          router.replace("/src/screens/side/StartScreen");
        }, 3000);
        return;
      }

      // User var ve newUser değil - data yüklenmesini bekle
      if (!dataLoading && !seersLoading) {
        const userRef = doc(db, "users", user.uid);
        const docRef = await getDoc(userRef);
        if (signs && signs.length > 0 && seers && seers.length > 0 && !docRef.data()?.newUser && docRef.exists() && user.emailVerified) {
          console.log('✅ SplashScreen: Veri yüklendi, ana ekrana yönlendiriliyor');
          router.replace('/src/screens/main/navigator/FortuneTellingScreen');
        } else if (error || seersError || docRef.data()?.newUser || !user.emailVerified) {
          console.log('⚠️ SplashScreen: Veri yüklenemedi, Introduction\'a yönlendiriliyor');
          router.replace('/src/screens/side/Introduction');
        }
        else if (!docRef.exists()) {
          console.log('⚠️ SplashScreen: User dokümanı bulunamadı, StartScreen\'e yönlendiriliyor');
          router.replace('/src/screens/side/StartScreen');
        }
      }
    };
    
    checkAndNavigate();
  }, [user, authLoading, dataLoading, signs, error, router]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animation
        src={theme === 'dark' ?
          "https://lottie.host/c94da6c6-be00-4b27-a410-c168024457e2/vfhKoIwBCz.lottie" :
          "https://lottie.host/be109cbf-2c26-4b68-a18d-d1526e22752c/NIPHAUmyob.lottie"}
        contentStyle={styles.loading}
      />
      <Text style={[styles.text, { color: colors.text }]}>
        {randomText}
      </Text>
    </View>
  )
}
export default SplashScreen