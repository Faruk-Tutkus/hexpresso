import { Animation } from "@components";
import { useTheme } from "@providers";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import styles from "./styles";

const  SplashScreen = () => {
  const router = useRouter()
  const { theme, colors } = useTheme()
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
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/src/screens/main/StartScreen")
    }
    , 3000)
    return () => clearTimeout(timer)
  },[])

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