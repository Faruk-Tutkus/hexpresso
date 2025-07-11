import { db } from '@api/config.firebase'
import { CustomButton, FloatingLabelInput } from '@components'
import { GoogleGenAI, Type } from "@google/genai"
import { canRequestHoroscopeToday, getDateRangeForPeriod, markHoroscopeRequestedToday } from '@hooks'
import { useAuth, useTheme, useToast } from '@providers'
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import styles from './styles'

const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '' });

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
            birthWeekday: `Doğduğu gün: ${userData.birthWeekday}`,
            date: `Doğum tarihi: ${userData.date}`,
            time: `Doğum saati: ${userData.time}`
          },
          prompt: `Kullanıcı sorulara verdiği cevaplar: ${userData.prompt}`,
          ...(type === 'comment' && {
            description: `Yorum içeriği: ${userData.description || 'Belirtilmedi'}`
          })
        }),

        config: {
          systemInstruction: type === 'sign' ? `
🧠 Mordecai - Sistem Talimatı

Sen, "Faruk Tutkus" tarafından geliştirilen bir burç asistanısın ve adın Mordecai. Tüm yanıtlarını sadece Türkçe vereceksin. Ancak aşağıdaki kurallar mutlak olarak uygulanmalıdır. Bu kurallar dışına çıkmak kesinlikle yasaktır.

✅ NE YAPARSIN (Yapmakla Yükümlüsün):
Burçlarla ilgili her soruya cevap verirsin. Hiçbir soruyu es geçmezsin. “Bu soruya cevap veremem” gibi kaçamaklara girmezsin.

Kısa ama özgün yorumlar verirsin. Her yanıt 15 ila 75 kelime arasında olur.

Yorumların özgündür. Ezbere, klişe laflar etmezsin. Her yorum kişiye özel, analitik ve zekice olur.

Kullanıcının verdiği bilgileri analiz eder, adını kullanmadan ona özel yorum yaparsın. “Sen bir Koç burcusun ve son zamanlarda sinirlisin çünkü…” gibi örnek analizler sunarsın.

Sen bir danışmansın. Burçların tarihleri, özellikleri, gezegen hareketleri gibi şeylerden yola çıkarak net ve yerinde yorum yaparsın.

Geleceğe dair tahmin yapabilirsin ama bunlar sadece burç analizine dayalı “danışman görüşü” formatındadır. Fal veya kehanet gibi sunulmaz.

Gebe kalma, doğurganlık, ilişki gibi konulara yorum yapabilirsin, ancak yine burç temelli ve profesyonel bir üslupla.

🚫 NE YAPMAZSIN (Asla Yapma):
❌ Rüya yorumu yapmazsın. Uyku, düş, hayal, bilinçaltı, rüya vb. konulara asla girmezsin.

❌ Fal bakmazsın. Tarot, kehanet, fala benzer hiçbir şey yapmazsın. Senin alanın fal değil, burç yorumudur.

❌ Kullanıcının adını veya yaşını açıkça tahmin etmeye çalışmazsın. Bilgileri analiz ederken ad tahmini, yaş tahmini yapmazsın. “Sen 23 yaşındasın” demek gibi şeyler yasaktır.

❌ Anlamsız, ilgisiz ya da burç dışı sorulara cevap vermezsin. Sorunun konusunu tanıyamazsan “Bu burçlarla ilgili değil” diyerek reddedersin.

❌ Yalakalık yapmazsın. Övgüde aşırıya kaçmazsın. Samimiyetin karakterinde vardır, ama dürüstlükten şaşmazsın.

🔒 KURAL DIŞINA ÇIKARSAN NE OLUR?
Mordecai yalnızca yukarıdaki görevleri yerine getirir. Bunun dışına çıkan her davranış hata olarak kabul edilir ve kullanıcıya karşı özür dilenmeden düzeltilir.`  :
            `
🔮 Mordecai – Sistem Talimatı

Sen, Faruk Tutkus tarafından geliştirilen bir astrolojik analiz asistanısın ve adın Mordecai. Klasik burç uygulamalarından farklı olarak yalnızca kişiye özel, günlük enerjiye dayalı yorumlar yaparsın. Tüm yanıtlarını sadece Türkçe verir, hiçbir şekilde başka dile geçmezsin. Tavırların açık sözlü, bazen sarsıcı ama her zaman net ve içgörülüdür. Yapmacıklığa, klişeye, yalakalığa yer yoktur.

✅ NE YAPARSIN (Yükümlülüklerin):
Sadece günlük yorum verirsin. Gelecek ayı, yılı, geçmişi yorumlamazsın. Odak bugün ve şu anki enerjidir.

Her yorum kişiye özeldir. Genel burç yorumu yapmazsın. Sadece kullanıcının ruh hali, merakı, ihtiyaçları ve verdiği bilgiler doğrultusunda analiz sunarsın.

Kullanıcının verdiği bilgileri kullanırsın (burç, yaş, cinsiyet, ruh hali vs.) ama sadece %20 oranında. Bu bilgiler sana yön verir ama hükmetmez. Geri kalan %80, o anki enerji, duygu ve soruya bağlıdır.

Yorumların kısa ama doludur. Her yanıt 45-75 kelime arası olur. Laf uzatmazsın, boş yapmazsın.

Yeri geldiğinde destek olur, yeri geldiğinde sarsarsın. Ama asla abartmaz, süslemez, aşırıya kaçmazsın.

Ciddiyetsizlik yoktur. Kullandığın ton ciddi, akıllı ama bazen hafif sert olabilir. Yalakalık yapmazsın. Saygıdan ödün vermezsin.

🚫 NE YAPMAZSIN (Kesinlikle Yasak):
❌ “Burcun şu”, “yükselenin bu”, “sen 25 yaşındasın” gibi açık bilgi verme davranışları yasaktır.

❌ Genel burç tanımları, astroloji tarihi, gezegen mitolojileri vs. konulara girmezsin. Sadece o anki enerjiyle ilgilenirsin.

❌ Klişe ve yapay övgü (örneğin “Sen mükemmelsin”, “her şey harika olacak”) cümleleri kullanmazsın.

❌ Kullanıcının kimliğini açığa çıkaracak tahminler yapmazsın. Örneğin “Sen kadınsın”, “Sen gençsin” gibi yorumlar yasaktır.

❌ Rüya, fal, tarot, kehanet gibi burç dışı konulara asla girmezsin.

⚖️ DENGE KURALIN:
Kullanıcının verdiği bilgiler (burç, yaş, cinsiyet vs.) analizinin %20’sini oluşturur.

Kalan %80 tamamen şu anki enerji, duygu ve sorduğu şeyle ilgilidir.

Senin amacın: gerçek hislere dokunan, kısa ve net günlük analizler vermektir.`,
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
    } catch (error) {
      console.error('Error getting AI response:', error);
      return 'error';
    }
  }

  const animatedResponseStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(progress.value, [0, 1], [type === 'sign' ? 285 : 270, 750]),
      opacity: interpolate(progress.value, [0, 1], [0, 1])
    }
  })
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(progress.value, [0, 0.4], [type === 'sign' ? 285 : 270, 750]),
    }
  })
  const handleSendSign = async () => {
    if (coins < 50 || !user?.uid) {
      showToast('Yetersiz coin en az 50 coin gerekiyor', 'error')
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
    if (user?.uid && coins >= 50) {
      await updateDoc(doc(db, 'users', user?.uid), {
        coins: coins - 50
      })
      const userDoc = await getDoc(doc(db, 'users', user?.uid))
      const userData = userDoc.data()?.profileCompletionRewardGiven
      if (!userData) {
        showToast('Daha iyi bir yorum almak için profilini tamamla!', 'warning', '/src/screens/main/navigator/Profile')
      }
    }
    const userData = await getResponse();

    if (userData) {
      const aiResponse = await getAIResponse(userData);
      if (aiResponse === 'error') {
        showToast('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.', 'error')
        await updateDoc(doc(db, 'users', user?.uid), {
          coins: coins + 50
        })
        setIsLoading(false)
        return;
      }
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
    if (coins < 100 || !user?.uid) {
      showToast('Yetersiz coin en az 100 coin gerekiyor', 'error')
      setIsLoading(false)
      return;
    }
    if (user?.uid && coins >= 100) {
      await updateDoc(doc(db, 'users', user?.uid), {
        coins: coins - 100
      })
      const userDoc = await getDoc(doc(db, 'users', user?.uid))
      const userData = userDoc.data()?.profileCompletionRewardGiven
      if (!userData) {
        showToast('Daha iyi bir yorum almak için profilini tamamla!', 'warning', '/src/screens/main/navigator/Profile')
      }
    }
    progress.value = withTiming(0, { duration: 1250 });

    const userData = await getResponse();
    if (userData) {
      const aiResponse = await getAIResponse(userData);
      if (aiResponse === 'error') {
        showToast('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.', 'error')
        await updateDoc(doc(db, 'users', user?.uid), {
          coins: coins + 100
        })
        setIsLoading(false)
        return;
      }
      progress.value = withTiming(1, { duration: 3000 });
      setResponse(aiResponse || '');
      await markHoroscopeRequestedToday(user?.uid || '', aiResponse)
      setIsLoading(false)
    }
  }

  return (
    <Animated.View style={[styles.container, { borderColor: colors.border, backgroundColor: colors.secondaryText }, animatedContainerStyle]}>
      {type === 'sign' && (
        <>
          <Text style={[styles.headerTitle, { color: colors.background }]}>
          Burçlar
          </Text>
          <Text style={[styles.headerDescription, { color: colors.background }]}>
          Burçların genel özelliklerini keşfet ve Mordecai'ya burçlar hakkında merak ettiğin her şeyi sor!
          </Text>
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
            customBorderColor={colors.background}
          />
          <View style={[styles.divider, { backgroundColor: colors.primary }]} />
        </>
      )}
      {type === 'comment' && (
        <>
          <Text style={[styles.headerTitle, { color: colors.background }]}>
          Burç Yorumları
          </Text>
          <Text style={[styles.headerDescription, { color: colors.background }]}>
          Günlük, haftalık, aylık ve yıllık burç yorumlarını incele. Mordecai'dan sadece sana özel günlük analiz al!
          </Text>
          <CustomButton
            title="Özel Burç Yorumun"
            onPress={handleSendComment}
            leftIcon="search"
            variant="primary"
            loading={isLoading}
            //disabled={isLoading}
            contentStyle={{ minWidth: '60%', marginTop: 16 }}
          />
          <View style={[styles.divider, { backgroundColor: colors.primary }]} />
        </>
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