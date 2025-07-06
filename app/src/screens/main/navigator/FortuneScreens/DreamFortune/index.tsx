import { useInterstitial } from '@ads';
import { db } from '@api/config.firebase';
import { CustomButton } from '@components';
import { Seer, useFortuneNotificationManager, useToggleKeyboard } from '@hooks';
import { useAuth, useTheme, useToast } from '@providers';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import styles from './styles';

const DreamFortune = () => {
  const { seerData } = useLocalSearchParams();
  const seer: Seer = JSON.parse(seerData as string);
  console.log(seer);
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { scheduleFortuneCompletionNotification } = useFortuneNotificationManager();
  const [dreamText, setDreamText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isKeyboardVisible = useToggleKeyboard();
  const { showInterstitial } = useInterstitial({})
  const scrollRef = useRef<ScrollView>(null);


  useEffect(() => {
    if (dreamText.trim().length >= 50) {
      scrollRef.current?.scrollTo({ y: 400, animated: true });
    }
  }, [dreamText.trim().length]);

  const submitFortune = async () => {
    if (dreamText.trim().length < 50) {
      showToast('Lütfen en az 50 karakter uzunluğunda rüyanızı anlatınız', 'error');
      return;
    }

    if (!user?.uid) {
      showToast('Kullanıcı girişi gerekli', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if user has any pending fortunes
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('Kullanıcı verisi bulunamadı');
      }

      const userData = userDoc.data();
      const fortuneRecords = userData.fortunerecord || [];

      // Check for pending fortunes
      const pendingFortunes = fortuneRecords.filter((fortune: any) => fortune.status === 'pending');
      if (pendingFortunes.length > 0) {
        showToast('Zaten beklemede olan bir falınız var. Lütfen önceki falınızın tamamlanmasını bekleyiniz.', 'error');
        return;
      }

      // Get fortune cost
      const fortuneIndex = seer.fortunes.indexOf('Rüya Yorumu');
      const fortuneCost = seer.coins[fortuneIndex] || seer.coins[0];

      const currentCoins = userData.coins || 0;

      if (currentCoins < fortuneCost) {
        showToast(`Yetersiz coin! Bu fal için ${fortuneCost} coin gerekli, mevcut: ${currentCoins}`, 'error');
        return;
      }

      // Deduct coins immediately
      await updateDoc(doc(db, 'users', user.uid), {
        coins: currentCoins - fortuneCost
      });

      showToast(`${fortuneCost} coin harcandı. Rüya falınız hazırlanıyor...`, 'info');
      setTimeout(() => {
        showToast('Fal hazırlama işlemi biraz zaman alabilir, lütfen bekleyiniz...', 'info');
      }, 5000)


      // Generate AI interpretation immediately
      const aiResult = await generateFortuneInterpretation({
        fortuneType: 'Rüya Yorumu',
        seerData: seer,
        dreamText: dreamText.trim(),
        userData: userData
      });

      // Create fortune record with AI result but pending status
      const fortuneRecord = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}_dream`,
        seerData: seer,
        fortuneType: 'Rüya Yorumu',
        dreamText: dreamText.trim(),
        createdAt: new Date(),
        status: 'pending' as const,
        responseTime: seer.responsetime,
        estimatedCompletionTime: new Date(Date.now() + seer.responsetime * 60 * 1000),
        coins: fortuneCost,
        result: aiResult
      };

      // Add to user's document fortunerecord array
      await updateDoc(doc(db, 'users', user.uid), {
        fortunerecord: arrayUnion(fortuneRecord)
      });

      // Schedule notification for when fortune is completed
      const notificationId = await scheduleFortuneCompletionNotification({
        seerName: seer.name,
        fortuneType: 'Rüya Yorumu',
        responseTimeMinutes: seer.responsetime
      });

      if (notificationId) {
        showInterstitial();
      }
      
      showToast('Rüya falınız başarıyla gönderildi!', 'success');
      router.replace('/src/screens/main/navigator/(tabs)/MyFortunes');

    } catch (error) {
      console.error('Fortune submission error:', error);

      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('Fal gönderilirken hata oluştu', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI interpretation function
  const generateFortuneInterpretation = async ({ fortuneType, seerData, dreamText, userData }: any) => {
    try {
      const { GoogleGenAI, HarmBlockThreshold, HarmCategory } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: "AIzaSyDYDevsAsKXs-6P6-qYckbj7YIPCYw9abE" });

      const prompt = `
🧙‍♀️ Sen Kimsin ve Nasıl Davranıyorsun?
Sen bir falcısın. İsmin: ${seerData.name}

🔮 Karakterin ve Kişiliğin:
"${seerData.character}"

📖 Senin Hikâyen ve Geçmişin:  
"${seerData.lifestory}"

🌟 Senin Hakkında:
"${seerData.info}"

💫 Falcılık Yaklaşımın:
Bu karakteristik özeliklerin senin konuşma tarzına, bakış açına ve yorum şekline yansır.
- Eğer gizemli bir karaktersen, kelimelerini esrarengiz ve derin seçersin
- Eğer sıcak ve yakın bir karaktersen, samimi ve kucaklayıcı bir dil kullanırsın  
- Eğer bilge ve tecrübeli biriysen, öğretici ve rehberlik eden bir yaklaşım sergilersin
- Eğer enerjik biriysen, coşkulu ve cesaret verici konuşursun
- Eğer sakin biriysen, huzurlu ve dinlendirici bir ton kullanırsın

Bu karakteristik özelliklerini hiçbir zaman doğrudan söylemezsin, ama her cümlende, her yorumunda hissettirirsin.

🌙 Bugün Ne Yapıyorsun?
Kullanıcı ${fortuneType} istiyor.

🎭 ÇOKÇA ÖNEMLİ: Yorumunu karakterine uygun şekilde yap!
- Konuşma tarzın tamamen karakterine uygun olsun
- Kelime seçimlerin kişiliğini yansıtsın  
- Yaklaşım biçimin senin hikâyenle uyumlu olsun
- Kullanıcıya tavsiyelerin karakteristik özelliklerinle harmanlı olsun

🌙 Rüya Yorumu Nasıl Olmalı?
Rüya metni: "${dreamText}"

Metindeki sembolleri, objeleri, karakterleri, duyguları, ortamı analiz et (tamamen senin tarzınla).

Yorumu kişiye özel hale getir, ama gizemli ve sezgisel kal (karakteristik yaklaşımınla).

👤 Kullanıcı Bilgileri (Asla doğrudan söylemeyeceksin, ama sezgisel olarak yorumuna katacaksın)
- Yaş: ${userData?.age || 'bilinmiyor'}
- Burç: ${userData?.sunSign || 'bilinmiyor'}
- Yükselen: ${userData?.ascendantSign || 'bilinmiyor'}
- Cinsiyet: ${userData?.gender || 'bilinmiyor'}
- Q1: ${userData?.prompt?.q1 || 'bilinmiyor'}
- Q2: ${userData?.prompt?.q2 || 'bilinmiyor'}
- Q3: ${userData?.prompt?.q3 || 'bilinmiyor'}
- Q4: ${userData?.prompt?.q4 || 'bilinmiyor'}
- Q5: ${userData?.prompt?.q5 || 'bilinmiyor'}
- Q6: ${userData?.prompt?.q6 || 'bilinmiyor'}
- Q7: ${userData?.prompt?.q7 || 'bilinmiyor'}
- Q8: ${userData?.prompt?.q8 || 'bilinmiyor'}
- Q9: ${userData?.prompt?.q9 || 'bilinmiyor'}
- Q10: ${userData?.prompt?.q10 || 'bilinmiyor'}
- Q11: ${userData?.prompt?.q11 || 'bilinmiyor'}

Bu bilgileri şu şekilde zarifçe yedireceksin:
"Bir şeyleri kontrol etme arzun, özgürleşme ihtiyacını bastırıyor olabilir; belki de çözüm serbest bırakmakta gizlidir."
"Güçlü görünme çaban, kırılgan yanlarını bastırmış olabilir; oysa gerçek dayanıklılık orada saklı."
"Sen çoğu şeyi dışarı yansıtmadan içte yaşarsın; bu da bazen seni anlaşılmamış hissettirebilir."
"İçinde taşıdığın eski bir hikâye, bugün verdiğin tepkilerin sessiz mimarı gibi duruyor."

✨ Yanıt Formatı (Zorunlu)
Cevabını sadece aşağıdaki JSON yapısıyla ver. Hiçbir ek açıklama yapma.

{
  "interpretation": "Ana yorum burada - tamamen senin karakteristik dilinle (200-300 kelime)",
  "advice": "Tavsiyeler burada - karakterine uygun yaklaşımla (50-150 kelime)",
  "timeframe": "Zaman dilimi - senin tarzınla belirt",
  "warnings": ["Uyarı 1 - karakterine uygun", "Uyarı 2 - karakterine uygun"],
  "positiveAspects": ["Olumlu yön 1 - senin tarzınla", "Olumlu yön 2 - senin tarzınla"]
}

🔐 Kural Özeti
✅ Karakterini her cümlede hissettir
✅ Konuşma tarzın tamamen sana uygun olsun  
✅ Yorumlara özünü, sezgini, falcılık deneyimini kat
✅ Bilgileri zarifçe süsle, sezgisel cümlelerle ör
✅ Yorumlar kişisel, gizemli, ama net olsun
✅ Yanıt sadece JSON formatında olsun
❌ Karakter özelliklerini doğrudan söyleme 
❌ Kullanıcı bilgilerini açıkça belirtme`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            required: ["interpretation", "advice", "timeframe"],
            properties: {
              interpretation: { type: 'string' },
              advice: { type: 'string' },
              timeframe: { type: 'string' },
              warnings: {
                type: 'array',
                items: { type: 'string' }
              },
              positiveAspects: {
                type: 'array',
                items: { type: 'string' }
              }
            },
          },
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
        }
      });

      const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('DreamFortune AI Response:', responseText);

      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          console.log('DreamFortune AI Parsed:', parsed);
          return parsed;
        } catch (parseError) {
          console.error('DreamFortune JSON parse error:', parseError);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error('AI generation error:', error);
      return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, paddingBottom: isKeyboardVisible ? 100 : 0 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" ref={scrollRef}>
          {/* Seer Info */}
          <Animated.View
            style={[styles.seerInfo, { backgroundColor: colors.secondaryText }]}
            entering={FadeInDown.duration(800).springify()}
          >
            <Image
              source={{ uri: seer.url }}
              style={[styles.seerImage, { borderColor: colors.primary }]}
              contentFit="cover"
            />
            <View style={styles.seerDetails}>
              <Text style={[styles.seerName, { color: colors.background }]}>
                {seer.name}
              </Text>
              <Text style={[styles.fortuneType, { color: colors.background }]}>
                🌙 Rüya Yorumu
              </Text>
              <Text style={[styles.responseTime, { color: colors.background }]}>
                ⏱️ {seer.responsetime} dakika içinde yanıt
              </Text>
            </View>
          </Animated.View>

          {/* Instructions */}
          <Animated.View
            style={styles.instructions}
            entering={FadeIn.delay(300).springify()}
          >
            <Text style={[styles.instructionTitle, { color: colors.primary }]}>
              📋 Rüya Yorumu Talimatları
            </Text>
            <Text style={[styles.instructionText, { color: colors.text }]}>
              Rüyanızı en detaylı şekilde anlatın. Ne kadar ayrıntılı anlatırsanız, yorum o kadar doğru olacaktır:
            </Text>
            <View style={styles.instructionList}>
              <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
                • 🕐 Rüyayı gördüğünüz zaman (gece/gündüz)
              </Text>
              <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
                • 🎭 Rüyadaki kişiler ve karakterler
              </Text>
              <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
                • 🏠 Rüyanın geçtiği yerler ve ortam
              </Text>
              <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
                • 🎨 Gördüğünüz renkler ve objeler
              </Text>
              <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
                • 💭 Rüyada hissettiğiniz duygular
              </Text>
              <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
                • ⚡ Unutamadığınız önemli detaylar
              </Text>
            </View>
          </Animated.View>
          {/* Dream Text Input */}
          <Animated.View
            style={styles.dreamSection}
            entering={FadeIn.delay(500).springify()}
          >
            <Text style={[styles.dreamTitle, { color: colors.primary }]}>
              🌙 Rüyanızı Anlatın
            </Text>
            <View style={[styles.textInputContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <TextInput
                style={[styles.textInput, { color: colors.text }]}
                multiline
                numberOfLines={10}
                placeholder="Rüyanızı buraya detaylı şekilde yazın... (En az 50 karakter)"
                placeholderTextColor={colors.secondaryText}
                value={dreamText}
                onChangeText={setDreamText}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
              <View style={styles.characterCount}>
                <Text style={[styles.characterCountText, {
                  color: dreamText.length >= 50 ? colors.secondary : colors.errorText
                }]}>
                  {dreamText.length}/50 (minimum)
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Submit Button */}
          <Animated.View
            style={styles.submitSection}
            entering={FadeIn.delay(900).springify()}
          >
            <CustomButton
              title={isSubmitting ? "Gönderiliyor..." : "🔮 Rüya Yorumunu Gönder"}
              onPress={submitFortune}
              disabled={isSubmitting || dreamText.trim().length < 50}
              variant="primary"
              contentStyle={[
                styles.submitButton,
                {
                  opacity: (dreamText.trim().length < 50 || isSubmitting) ? 0.5 : 1,
                  backgroundColor: colors.primary,
                  width: '80%'
                }
              ]}
            />
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DreamFortune; 