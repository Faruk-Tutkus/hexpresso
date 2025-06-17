import { db } from "@api/config.firebase";
import { Animation } from "@components";
import { useAuth, useTheme } from "@providers";
import { useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { MMKV } from 'react-native-mmkv';
import styles from "./styles";

const  SplashScreen = () => {
  const router = useRouter()
  const { theme, colors } = useTheme()
  const { user } = useAuth()
  const [texts] = useState([
    "Sana bir sır fısıldayacağım, hazır ol...",
    "Bugün kaderini değiştirecek bir şey olacak...",
    "Boşuna bekleme, mesaj gelmeyecek...",
    "Yıldızlar kulağıma senin adını fısıldadı...",
    "Fal fincanın sana konuşmak istiyor...",
    "Bugün evrende senin adına bir kıpırtı var...",
    "Gözlerini kapat... Dileğini tuttun mu?",
    "Kahvenin dibinde bir sır saklı...",
    "Geleceğin gölgeleri şekillenmeye başladı...",
    "Kalbinin cevabını bulmaya çok yakınsın...",
    "Yıldızlar seninle dalga geçmiyor bu kez...",
    "Bugün enerjin bambaşka, fark ettin mi?",
    "O kişi sana göre değildi zaten, takılma...",
    "Mutsuzluğunun sebebi sana doğru gelmekte...",
    "Geçen yıl bugün ne oldu hatırlıyor musun?",
    "Yarın için heyecanlı mısın?",
  ])

  const [signs, setSigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const storage = new MMKV({ id: 'signs_data' });

  function cacheData(id: string, data: any) {
    try {
      storage.set(id, JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = collection(db, "signs");
        const docSnap = (await getDocs(docRef)).docs.map((item) => item.data())
        
        if (!docSnap || docSnap.length === 0) {
          setLoading(true);
          return;
        }
        
        setSigns(docSnap);
        setLoading(false);

        // Eğer kullanıcı varsa veriyi cache'e kaydet
        if (user) {
          cacheData('signs_data', docSnap);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(true);
      }
    }
    fetchData();
  }, [user])

  // Data ve user durumuna göre yönlendirme
  useEffect(() => {
    if (!loading && signs.length > 0) {
      if (user) {
        router.replace("/src/screens/main/navigator/(tabs)/HomeScreen");
      } else {
        router.replace("/src/screens/side/StartScreen");
      }
    }
    // Eğer data yok ve loading false ise splash screen'de kal
  }, [loading, signs, user])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animation
        src = {theme === 'dark' ?
          "https://lottie.host/c94da6c6-be00-4b27-a410-c168024457e2/vfhKoIwBCz.lottie":
          "https://lottie.host/be109cbf-2c26-4b68-a18d-d1526e22752c/NIPHAUmyob.lottie"}
        contentStyle={styles.loading}
      />
      <Text style={[styles.text, { color: colors.text }]}>
        {texts[Math.floor(Math.random() * texts.length)]}
      </Text>
    </View>
  )
}
export default SplashScreen