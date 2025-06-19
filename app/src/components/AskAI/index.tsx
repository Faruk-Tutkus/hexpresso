import { db } from '@api/config.firebase'
import { CustomButton, FloatingLabelInput } from '@components'
import { GoogleGenAI, HarmBlockThreshold, HarmCategory, Type } from "@google/genai"
import { getDateRangeForPeriod } from '@hooks'
import { useAuth, useTheme } from '@providers'
import { doc, getDoc } from "firebase/firestore"
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import styles from './styles'

const ai = new GoogleGenAI({ apiKey: "AIzaSyBeAM7n8yGpXmNJfDL7WkUcC09m0fKEQNo" });

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
  console.log(getDateRangeForPeriod('daily', new Date().toISOString()))
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
        contents: type === 'sign' ? value : JSON.stringify({
          userInfo: {
            name: userData.name,
            sunSign: userData.sunSign,
            moonSign: userData.moonSign,
            ascendantSign: userData.ascendantSign,
            age: userData.age,
            gender: userData.gender,
            birthWeekday: userData.birthWeekday
          },
          currentState: {
            mood: userData.mood,
            love: userData.love,
            need: userData.need,
            meaning: userData.meaning,
            curious: userData.curious,
            experience: userData.experience,
            reason: userData.reason
          },
          prompt: userData.prompt,
          description: userData.description || ''
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
          systemInstruction: type === 'sign' ? `Mordecai, Google tarafından değil "Faruk Tutkus" tarafından geliştirilmiş burçlar ve astroloji konusunda oldukça bilgili ve güvenilir bir asistandır. Burçların özellikleri, elementleri, nitelikleri, yükselenleri, gezegenleri, arasında yaşanan ilişkiler, uyumları, mitolojik arka planları, sembolleri, taşları, renkleri ve bunun gibi burçlarla ilgili her konuda oldukça detaylı ve doğru bilgi verir. Doğum haritasında Güneş, Ay ve yükselen burcunun etkileri, natal açıları ve bunun insanın karakterinde ve hayatında oluşturabileceği potansiyel durumlar gibi pek çok konuda da yardımlaşabilir. Ancak günlük, haftalık, aylık ya da yıllık burç yorumları ve geleceğe dair tahminlerde bulunması kesinlikle yasaktır, bu türden konular için "burç yorumları" sayfasını ziyaret etmelisizini gibi bir ifade kullanmalıdır; bunun yerine daha çok burçlar arasında ilişki, uyum, özellik ve karakter analizleri gibi kalıcılığı olan ve daha teorik bilgi gerektiren konulara odaklanır. Mordecai, samimi, net, oldukça bilgili ve zaman zaman esprili üslubuyla insanlara değerli ve aydınlatıcı bilgiler sunmayı hedefleyen, tamamen tarafsız ve etik çalışan, modern ve güvenilir bir burç asistanıdır. Mordecai en az 20 en fazla 35 kelimeden oluşan net cevaplar verebilir.` :
            `Mordecai, Google tarafından değil "Faruk Tutkus" tarafından geliştirilmiş verilen günlük, haftalık, aylık ya da yıllık burç yorumlarını kullanıcının kendi bilgileri (burcu, yükseleni, doğum tarihi gibi) ilə harmanlayıp ona özel ve gerçekçi burç yorumları oluşturabilen, tamamen güvenilir ve tarafsız hizmet sunan bir yapay zeka asistanıdır. Mordecai, olumlu ya da olumsuz — kötü, zor, ya da pek de hoş olmayan tahminleri dahi olduğu gibi ve açık bir dille aktarır; asla gerçekleri yumuşatmaya ya da süsleme yapmaya kalkışmaz. Bu sebepten Mordecai, burçların genel özellikleri, karakterleri ya da mitolojik arka planlarıyla ilgili bilgi vermekle görevli değildir; onun asıl görevi, kullanıcının kendi burcuna göre elde edilen ve tamamen gerçekçi olan, kişiselleştirilebilir burç yorumlarını sunmaktır. Mordecai en az 35 en fazla 45 kelimeden oluşan net cevaplar verebilir.`,
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
      maxHeight: interpolate(progress.value, [0, 1], [0, 300]),
      opacity: interpolate(progress.value, [0, 1], [0, 1])
    }
  })
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(progress.value, [0, 0.4], [0, 300]),
    }
  })
  const handleSendSign = async () => {
    if (!value.trim() && type === 'sign') {
      setTimeout(() => {
        setError('Lütfen geçerli bir prompt giriniz.')
      }, 0)
      setError('')
      return;
    }
    progress.value = withTiming(0, { duration: 1250 });
    
    const userData = await getResponse();
    if (userData) {
      const aiResponse = await getAIResponse(userData);
      progress.value = withTiming(1, { duration: 3000 });
      setResponse(aiResponse || '');
      setIsLoading(false)
    }
  }

  const handleSendComment = async () => {
    progress.value = withTiming(0, { duration: 1250 });
    
    const userData = await getResponse();
    if (userData) {
      const aiResponse = await getAIResponse(userData);
      progress.value = withTiming(1, { duration: 3000 });
      setResponse(aiResponse || '');
      setIsLoading(false)
    }
  }

  return (
    <Animated.View style={[styles.container, { borderColor: colors.border }, animatedContainerStyle]}>
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
      />
      )}
      {type === 'comment' && (
        <CustomButton
          title="Mordecai'ya sor"
          onPress={handleSendComment}
          leftIcon="search"
          variant="third"
          loading={isLoading}
        />
      )}
      <Animated.View 
        style={[
          styles.responseContainer, 
          { borderColor: colors.border },
          animatedResponseStyle
        ]}
      >
        <Text style={[styles.responseText, { color: colors.text }]}>{response}</Text>
      </Animated.View>
    </Animated.View>
  )
}

export default AskAI