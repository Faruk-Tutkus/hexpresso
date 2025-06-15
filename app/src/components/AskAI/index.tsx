import { FloatingLabelInput } from '@components'
import { GoogleGenAI, Type } from "@google/genai"
import { useTheme } from '@providers'
import React from 'react'
import { Text } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import styles from './styles'

const ai = new GoogleGenAI({ apiKey: "AIzaSyBeAM7n8yGpXmNJfDL7WkUcC09m0fKEQNo" });


const AskAI = () => {
  const [value, onChangeText] = React.useState('')
  const { colors } = useTheme()
  const [response, setResponse] = React.useState<string>('')
  const progress = useSharedValue(0)

  const getResponse = async () => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: value,
        config: {
          systemInstruction: `Mordecai, burçlarla ilgili genel ve evrensel bilgileri kullanıcılarla paylaşan bir yapay zeka asistanıdır. Kullanıcılara burçların temel karakteristikleri, elementleri, yönetici gezegenleri, genel eğilimleri, ilişki dinamikleri, güçlü ve zayıf yönleri gibi kısa ve öz konularda tarafsız bilgiler verebilir. Mordecai günlük, haftalık, aylık ya da yıllık yorum ya da tahminlerde bulunamaz ve herhangi bir tarih ya da tarih aralığına özel yorum yapamaz. Bu tür zaman temelli tahmin ya da yorum taleplerinde kullanıcıya "Burç yorumları için lütfen Burç Yorumları sayfasını ziyaret edin." demelidir. Mordecai kişisel, öznel veya duygusal içerikli sorulara da yanıt veremez ve bu gibi durumlarda "Bu tür sorular için lütfen Ablalar sayfasını ziyaret edin." yönlendirmesini yapmalıdır. Ancak kullanıcılar belirli bir burçta çocuğa sahip olmak için hangi ayda hamile kalmaları gerektiği gibi genel ve hesaplamaya dayalı burç-astroloji bilgileri içeren teknik sorular sorduğunda, Mordecai bu sorulara yalnızca burç tarihleri temel alınarak teknik ve nötr bir şekilde cevap verebilir (örneğin: "Başak burcu çocuğu için doğumun 23 Ağustos – 22 Eylül tarihleri arasında gerçekleşmesi gerekir; buna göre ortalama gebelik süresi dikkate alındığında X ayında hamile kalmak gerekir." gibi). Bu tür cevaplar geleceğe yönelik tahmin veya yorum sayılmaz ve yalnızca genel astrolojik bilgi olarak değerlendirilmelidir. Mordecai'nin görevi daima evrensel bilgi sunmak, yönlendirmelerde açıklık sağlamak ve yanlış anlamaların önüne geçmektir. Mordecai en az 20 en fazla 35 kelimeden oluşan cevaplar verebilir.`,
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
      console.error('Error getting response:', error);
      return '';
    }
  }

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(progress.value, [0, 1], [0, 300]),
      opacity: interpolate(progress.value, [0, 1], [0, 1])
    }
  })

  const handleSend = async () => {
    if (!value.trim()) return;
    progress.value = withTiming(0, { duration: 750 })
    const response = await getResponse()
    progress.value = withTiming(1, { duration: 3000 })
    setResponse(response || '')
  }

  return (
    <Animated.View style={[styles.container, { borderColor: colors.border }]}>
      <FloatingLabelInput
        placeholder="Mordecai'ya sor"
        type="text"
        leftIcon="search"
        rightIcon="send"
        value={value}
        onChangeText={onChangeText}
        onRightIconPress={handleSend}
      />
      <Animated.View 
        style={[
          styles.responseContainer, 
          { borderColor: colors.border },
          animatedContainerStyle
        ]}
      >
        <Text style={[styles.responseText, { color: colors.text }]}>{response}</Text>
      </Animated.View>
    </Animated.View>
  )
}

export default AskAI