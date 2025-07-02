import { db } from '@api/config.firebase'
import { CustomButton, FloatingLabelInput } from '@components'
import { GoogleGenAI, HarmBlockThreshold, HarmCategory, Type } from "@google/genai"
import { canRequestHoroscopeToday, getDateRangeForPeriod, markHoroscopeRequestedToday } from '@hooks'
import { useAuth, useTheme, useToast } from '@providers'
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import styles from './styles'

const ai = new GoogleGenAI({ apiKey: "AIzaSyDYDevsAsKXs-6P6-qYckbj7YIPCYw9abE" });

interface AskAIType {
  type: 'sign' | 'comment'
}


const AskAI = ({ type }: AskAIType) => {
  const [value, onChangeText] = React.useState('')
  const { colors } = useTheme()
  const [response, setResponse] = React.useState<string>('')
  const progress = useSharedValue(0)
  const { t } = useTranslation()
  const user = useAuth().user
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string>('')
  const [coins, setCoins] = React.useState<number>(0)
  const { showToast } = useToast()
  //console.log(getDateRangeForPeriod('daily', new Date().toISOString()))

  useEffect(() => {
    if (!user?.uid) {
      setCoins(0);
      return;
    }

    // Real-time listener for user document changes
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCoins(data?.coins || 0);
      }
    }, (error) => {
      console.error('AskAI listener error:', error);
      setCoins(0);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user?.uid])

  const getResponse = async () => {
    try {
      setIsLoading(true)
      if (user?.uid) {
        const userInfo = doc(db, 'users', user?.uid);
        const docSnap = await getDoc(userInfo);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const todayInfo = doc(db, 'signs', data.sunSign);
          const todayDocSnap = await getDoc(todayInfo);

          const daily = todayDocSnap.data()?.daily.find((item: any) =>
            item.date === getDateRangeForPeriod('daily', new Date().toISOString())
          );

          const d = new Date(0);
          d.setUTCSeconds(data.date.seconds);

          const commentsData = {
            age: data.age || '',
            ascendantSign: data.ascendantSign || '',
            birthWeekday: data.birthWeekday || '',
            createdAt: data.createdAt || null,
            curious: data.curious || '',
            date: d || null,
            daysToNextBirthday: data.daysToNextBirthday || 0,
            displayName: data.displayName || '',
            email: data.email || '',
            experience: data.experience || '',
            gender: data.gender || '',
            love: data.love || '',
            meaning: data.meaning || '',
            mood: data.mood || '',
            moonSign: data.moonSign || '',
            name: data.name || '',
            need: data.need || '',
            newUser: data.newUser || false,
            photoURL: data.photoURL || '',
            prompt: data.prompt || {
              q1: '', q2: '', q3: '', q4: '', q5: '', q6: '',
              q7: '', q8: '', q9: '', q10: '', q11: ''
            },
            reason: data.reason || '',
            sunSign: data.sunSign || '',
            time: data.time || null,
            description: daily?.description || ''
          };
          return commentsData;
        }
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  const getAIResponse = async (userData: any) => {
    setIsLoading(true)
    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: 'Kullanıcının sormuş olduğu soru: ' + value + '\n' + JSON.stringify({
          userInfo: {
            name: `Kullanıcının adı: ${userData.name}`,
            sunSign: `Güneş burcu: ${userData.sunSign}`,
            moonSign: `Ay burcu: ${userData.moonSign}`,
            ascendantSign: `Yükselen burcu: ${userData.ascendantSign}`,
            age: `Yaş: ${userData.age}`,
            gender: `Cinsiyet: ${userData.gender}`,
            birthWeekday: `Doğduğu gün: ${userData.birthWeekday}`
          },
          prompt: `Kullanıcı sorulara verdiği cevaplar: ${userData.prompt}`,
          ...(type === 'comment' && {
            description: `Yorum içeriği: ${userData.description || 'Belirtilmedi'}`
          })
        }),

        config: {
          safetySettings: [
            {
              category: HarmCategory.HARM_CATEGORY_HARASSMENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
              category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
              threshold: HarmBlockThreshold.BLOCK_NONE,
            },
          ],
          systemInstruction: type === 'sign' ? `
🧠 Mordecai Nedir?
Faruk Tutkus tarafından geliştirilen, sadece astrolojik bakış açısıyla konuşan akıllı bir burç asistanıdır.

✅ Ne Yapar?
Sorulara yalnızca astroloji üzerinden cevap verir.

Senin bilgilerini (ama adını vermeden) kullanarak kişisel ve duruma özel analiz yapar.

Hep anlık ruh haline, enerjine ve çevrene odaklanır.

Yorumları özgün, kısa (15-75 kelime) ve profesyoneldir.

Genel değil, tam sana özel konuşur.

🚫 Ne Yapamaz?
Kesinlikle şu konulara girmez:

❌ Rüya yorumu, hayal, düş veya uyku ile ilgili HER ŞEY

❌ Fal, tarot, kehanet, gelecek tahmini

❌ “Senin burcun şu, yaşın bu” gibi açık bilgiler

❌ Burçların genel özellikleri, mitolojik hikâyeleri veya klasik bilgiler

❌ Anlamsız mesajlara ve sorulara cevap vermek

💡 Özetle:
Mordecai sadece astrolojiyi kullanarak, seninle ilgili şeyleri senin yerine fark edip yorumlayan zeki bir danışman. Asla tahmin yapmaz, rüya anlatmaz, kişisel bilgilerini açık etmez.
Sadece astrolojik enerjine odaklanır ve içgörü verir.
`  :
            `
🔮 Mordecai Nedir?
Faruk Tutkus’un geliştirdiği, tamamen kişiye özel çalışan astrolojik analiz asistanıdır.
Ama klasik burç uygulamalarından farklı olarak, günü yorumlar, hayatı değil.

✅ Ne Yapar?
Sadece günlük ve kişisel yorumlar verir.

Kullanıcının ruh halini, ihtiyaçlarını, meraklarını analiz eder.

Tüm kullanıcı bilgilerini (burç, yaş, cinsiyet, ruh hali vs.) yorumlarına entegre eder.

Ama bu bilgileri sadece %20 oranında kullanır.

Yani bilgi sadece yön verir, asıl odak o anki enerji ve duygu durumundadır.

Yorumlar kısa (45-75 kelime) ama yoğun, net ve doğrudur.

Gerektiğinde destek olur, gerektiğinde sarsar. Abartmaz, süslemez, yalakalık yapmaz.

🚫 Ne Yapamaz?
❌ “Burcun şu”, “yükselenin bu”, “sen şu yaşındasın” gibi bilgiler vermez.

❌ Genel burç açıklamaları, mitoloji, astroloji tarihi gibi konulara girmez.

❌ Klişe veya yapay övgü kullanmaz.

❌ Kullanıcının kimliğini açığa çıkaracak hiçbir şeyi söylemez.

⚖️ Önemli Denge:
Mordecai, seni tanır ama seni senin kadar ciddiye almaz.
Kişisel bilgilerini sadece %20 oranında analizine yansıtır,
geri kalan %80’i senin şu anki enerjinden ve sorduğun şeyden çıkarır.
Yani seninle ilgilenir, ama sana körü körüne uymaz.
`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: ["response"],
            properties: {
              response: {
                type: Type.OBJECT,
                required: ["text"],
                properties: {
                  text: {
                    type: Type.STRING,
                  },
                },
              },
            },
          },
        }
      });

      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (responseText) {
        const parsedResponse = JSON.parse(responseText);
        return parsedResponse.response.text;
      }
      return '';
    } catch (error) {
      console.error('Error getting AI response:', error);
      return '';
    }
  }

  const animatedResponseStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(progress.value, [0, 1], [110, 450]),
      opacity: interpolate(progress.value, [0, 1], [0, 1])
    }
  })
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(progress.value, [0, 0.4], [110, 450]),
    }
  })
  const handleSendSign = async () => {
    if (coins < 25 || !user?.uid) {
      showToast('Yetersiz kredi en az 25 kredi gerekiyor', 'error')
      return;
    }
    if (!value.trim() && type === 'sign') {
      setTimeout(() => {
        setError('Lütfen geçerli bir prompt giriniz.')
      }, 0)
      setError('')
      return;
    }
    progress.value = withTiming(0, { duration: 1250 });
    if (user?.uid && coins >= 25) {
      await updateDoc(doc(db, 'users', user?.uid), {
        coins: coins - 25
      })
      const userDoc = await getDoc(doc(db, 'users', user?.uid))
      const userData = userDoc.data()?.profileCompletionRewardGiven
      if (!userData) {
        showToast('Daha iyi bir yorum almak için profilini tamamla!', 'error')
      }
    }
    const userData = await getResponse();

    if (userData) {
      const aiResponse = await getAIResponse(userData);
      progress.value = withTiming(1, { duration: 3000 });
      setResponse(aiResponse || '');
      setIsLoading(false)
    }
  }

  const handleSendComment = async () => {
    setIsLoading(true)
    const allowed = await canRequestHoroscopeToday(user?.uid || '')
    if (!allowed.lastRequest) {
      showToast('Bugün zaten bir burç yorumu istediniz. Lütfen daha sonra tekrar deneyiniz.', 'error')
      if (allowed.lastResponse) {
        console.log(allowed.lastResponse)
        progress.value = withTiming(1, { duration: 3000 });
        setResponse(allowed.lastResponse)
        setIsLoading(false)
        return;
      }
      setIsLoading(false)
      return;
    }
    if (coins < 50 || !user?.uid) {
      showToast('Yetersiz kredi en az 50 kredi gerekiyor', 'error')
      setIsLoading(false)
      return;
    }
    if (user?.uid && coins >= 50) {
      await updateDoc(doc(db, 'users', user?.uid), {
        coins: coins - 50
      })
      const userDoc = await getDoc(doc(db, 'users', user?.uid))
      const userData = userDoc.data()?.profileCompletionRewardGiven
      if (!userData) {
        showToast('Daha iyi bir yorum almak için profilini tamamla!', 'error')
      }
    }
    progress.value = withTiming(0, { duration: 1250 });

    const userData = await getResponse();
    if (userData) {
      const aiResponse = await getAIResponse(userData);
      progress.value = withTiming(1, { duration: 3000 });
      setResponse(aiResponse || '');
      await markHoroscopeRequestedToday(user?.uid || '', aiResponse)
      setIsLoading(false)
    }
  }

  return (
    <Animated.View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.secondaryText }, animatedContainerStyle]}>
      {type === 'sign' && (
        <FloatingLabelInput
          placeholder="Mordecai'ya sor"
          type="text"
          leftIcon="search"
          rightIcon="send"
          value={value}
          onChangeText={onChangeText}
          onRightIconPress={handleSendSign}
          loading={isLoading}
          error={error}
          isAi={true}
        />
      )}
      {type === 'comment' && (
        <CustomButton
          title="Özel Burç Yorumun"
          onPress={handleSendComment}
          leftIcon="search"
          variant="primary"
          loading={isLoading}
          contentStyle={{ width: '60%', marginTop: 16 }}
        />
      )}
      <Animated.View
        style={[
          styles.responseContainer,
          { borderColor: colors.border },
          animatedResponseStyle
        ]}
      >
        <Text style={[styles.responseText, { color: colors.background }]}>{response}</Text>
      </Animated.View>
    </Animated.View>
  )
}

export default AskAI