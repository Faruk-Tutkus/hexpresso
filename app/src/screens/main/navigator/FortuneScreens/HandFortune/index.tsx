import { useInterstitial } from '@ads';
import { db, storage } from '@api/config.firebase';
import Icon from '@assets/icons';
import { CustomButton, PhotoPickerModal } from '@components';
import { Seer, useFortuneNotificationManager } from '@hooks';
import { useAuth, useTheme, useToast } from '@providers';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInRight } from 'react-native-reanimated';
import styles from './styles';

const HandFortune = () => {
  const { seerData } = useLocalSearchParams();
  const seer: Seer = JSON.parse(seerData as string);
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { showInterstitial } = useInterstitial({})
  const { scheduleFortuneCompletionNotification } = useFortuneNotificationManager();
  const [leftHandImage, setLeftHandImage] = useState<string>('');
  const [rightHandImage, setRightHandImage] = useState<string>('');
  const [leftHandBase64, setLeftHandBase64] = useState<string>('');
  const [rightHandBase64, setRightHandBase64] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingHand, setUploadingHand] = useState<'left' | 'right' | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedHand, setSelectedHand] = useState<'left' | 'right' | null>(null);

  const openImagePicker = (hand: 'left' | 'right') => {
    setSelectedHand(hand);
    setShowPhotoModal(true);
  };

  const handleCloseModal = () => {
    setShowPhotoModal(false);
    setSelectedHand(null);
  };

  const handleCameraPress = () => {
    setShowPhotoModal(false);
    if (selectedHand) {
      takePhoto(selectedHand);
    }
  };

  const handleGalleryPress = () => {
    setShowPhotoModal(false);
    if (selectedHand) {
      pickFromGallery(selectedHand);
    }
  };

  const takePhoto = async (hand: 'left' | 'right') => {
    try {
      // Request camera permission
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        showToast('Kamera erişim izni gerekli', 'error');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        aspect: [4, 3],
        allowsEditing: false,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const imageBase64 = result.assets[0].base64 || '';
        
        if (hand === 'left') {
          setLeftHandImage(imageUri);
          setLeftHandBase64(imageBase64);
        } else {
          setRightHandImage(imageUri);
          setRightHandBase64(imageBase64);
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      showToast('Kamera ile fotoğraf çekerken hata oluştu', 'error');
    }
  };

  const pickFromGallery = async (hand: 'left' | 'right') => {
    try {
      // Request gallery permission
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showToast('Fotoğraf galerisine erişim izni gerekli', 'error');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        aspect: [4, 3],
        allowsEditing: false,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const imageBase64 = result.assets[0].base64 || '';
        
        if (hand === 'left') {
          setLeftHandImage(imageUri);
          setLeftHandBase64(imageBase64);
        } else {
          setRightHandImage(imageUri);
          setRightHandBase64(imageBase64);
        }
      }
    } catch (error) {
      console.error('Gallery picker error:', error);
      showToast('Galeriden fotoğraf seçerken hata oluştu', 'error');
    }
  };

  const uploadImageToFirebase = async (imageUri: string, hand: string): Promise<string> => {
    try {
      setUploadingHand(hand as 'left' | 'right');
      console.log(`🔄 Starting upload for ${hand} hand image...`);
      console.log(`📱 Image URI: ${imageUri}`);
      console.log(`👤 User UID: ${user?.uid}`);
      
      const filename = `hand_fortune_${user?.uid}_${Date.now()}_${hand}.jpg`;
      const storageRef = ref(storage, `fortunes/${user?.uid}/${filename}`);
      
      console.log(`📂 Storage path: fortunes/${user?.uid}/${filename}`);
      console.log(`🏠 Storage bucket: ${storage.app.options.storageBucket}`);

      // Fetch image and convert to blob
      console.log(`📥 Fetching image from URI...`);
      const response = await fetch(imageUri);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log(`📊 Blob created - Size: ${blob.size} bytes, Type: ${blob.type}`);
      
      // Check blob size (max 5MB)
      if (blob.size > 10 * 1024 * 1024) {
        showToast('Dosya boyutu çok büyük (max 10MB)', 'error');
        throw new Error('Dosya boyutu çok büyük (max 10MB)');
      }
      
      // Check if user is authenticated
      if (!user?.uid) {
        throw new Error('Kullanıcı kimlik doğrulaması gerekli');
      }
      
      // Upload to Firebase Storage
      console.log(`☁️ Uploading to Firebase Storage...`);
      const uploadTask = await uploadBytes(storageRef, blob);
      console.log(`✅ Upload completed. Metadata:`, uploadTask.metadata);
      
      // Get download URL
      console.log(`🔗 Getting download URL...`);
      const downloadURL = await getDownloadURL(storageRef);
      console.log(`🎉 ${hand} hand image uploaded successfully: ${downloadURL}`);
      
      return downloadURL;
    } catch (error) {
      console.error(`❌ Error uploading ${hand} hand image:`, error);
      
      if (error instanceof Error) {
        console.log(`🔍 Error name: ${error.name}`);
        console.log(`🔍 Error message: ${error.message}`);
        console.log(`🔍 Error stack: ${error.stack}`);
        
        // Check for specific Firebase Storage errors
        if (error.message.includes('storage/unknown')) {
          console.log('🚨 Firebase Storage unknown error detected');
          console.log('🔧 This usually indicates:');
          console.log('   - Storage rules are too restrictive');
          console.log('   - Storage bucket is not properly configured');
          console.log('   - User authentication issue');
          throw new Error('Firebase Storage yapılandırma hatası. Lütfen yöneticiye başvurun.');
        } else if (error.message.includes('storage/unauthorized')) {
          throw new Error('Fotoğraf yükleme izni yok. Lütfen giriş yapın.');
        } else if (error.message.includes('storage/quota-exceeded')) {
          throw new Error('Depolama alanı dolu. Lütfen daha sonra tekrar deneyin.');
        } else if (error.message.includes('storage/unauthenticated')) {
          throw new Error('Kimlik doğrulaması gerekli. Lütfen tekrar giriş yapın.');
        } else if (error.message.includes('storage/retry-limit-exceeded')) {
          throw new Error('Çok fazla deneme. Lütfen daha sonra tekrar deneyin.');
        } else if (error.message.includes('storage/invalid-format')) {
          throw new Error('Geçersiz dosya formatı. Lütfen JPEG veya PNG dosyası seçin.');
        } else if (error.message.includes('storage/object-not-found')) {
          throw new Error('Dosya bulunamadı. Lütfen tekrar deneyin.');
        } else if (error.message.includes('storage/project-not-found')) {
          throw new Error('Firebase projesi bulunamadı. Lütfen yöneticiye başvurun.');
        } else if (error.message.includes('storage/canceled')) {
          throw new Error('Yükleme iptal edildi.');
        } else if (error.message.includes('HTTP error')) {
          throw new Error('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
        } else {
          throw new Error(`Fotoğraf yükleme hatası: ${error.message}`);
        }
      }
      
      throw new Error('Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUploadingHand(null);
    }
  };

  const submitFortune = async () => {
    if (!leftHandImage || !rightHandImage) {
      showToast('Lütfen sol ve sağ el fotoğraflarını yükleyiniz', 'error');
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

      // Validate hand images with AI first
      showToast('Görüntüler doğrulanıyor...', 'info');
      const validation = await validateHandImages(leftHandImage, rightHandImage);
      
      if (!validation.isValid) {
        showToast(`Geçersiz görüntü lütfen el fotoğrafınızı kontrol ediniz`, 'error');
        return;
      }
      
      // Get fortune cost
      const fortuneIndex = seer.fortunes.indexOf('El Falı');
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
      
      showToast(`${fortuneCost} coin harcandı. Fotoğraflar yükleniyor...`, 'info');
      setTimeout(()=> {
        showToast('Fal hazırlama işlemi biraz zaman alabilir, lütfen bekleyiniz...', 'info');
      }, 5000)

      setTimeout(()=> {
        showInterstitial();
      }, 7500)

      // Upload images sequentially
      let leftHandUrl, rightHandUrl;
      try {
        leftHandUrl = await uploadImageToFirebase(leftHandImage, 'left');
        rightHandUrl = await uploadImageToFirebase(rightHandImage, 'right');
      } catch (uploadError) {
        // Refund coins if upload fails
        await updateDoc(doc(db, 'users', user.uid), {
          coins: currentCoins
        });
        throw uploadError;
      }

      // Generate AI interpretation immediately
      const aiResult = await generateFortuneInterpretation({
        fortuneType: 'El Falı',
        seerData: seer,
        images: { leftHand: leftHandUrl, rightHand: rightHandUrl },
        userData: userData
      });


      // Create fortune record with AI result but pending status
      const fortuneRecord = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2,9)}_hand`,
        seerData: seer,
        fortuneType: 'El Falı',
        images: {
          leftHand: leftHandUrl,
          rightHand: rightHandUrl
        },
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
      await scheduleFortuneCompletionNotification({
        seerName: seer.name,
        fortuneType: 'El Falı',
        responseTimeMinutes: seer.responsetime
      });
      
      showToast('El falınız başarıyla gönderildi!', 'success');
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
  const generateFortuneInterpretation = async ({ fortuneType, seerData, images, userData }: any) => {
    try {
      const { GoogleGenAI, HarmBlockThreshold, HarmCategory } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: "AIzaSyDYDevsAsKXs-6P6-qYckbj7YIPCYw9abE" });

      if (!leftHandBase64 || !rightHandBase64) {
        console.error('Base64 data is missing for hand images');
        return;
      }

      const prompt = `
🧙‍♀️ Sen Kimsin?
Sen bir falcısın.
Adın: ${seerData.name}
Karakterin: "${seerData.character}"
Hakkında kısa bilgi: "${seerData.info}"
Geçmişin: "${seerData.lifestory}"

Bunlar senin sezgilerini, tarzını ve dilini belirler.
Ama bu bilgileri kullanıcıya asla söylemezsin, sadece enerjine yansır.

✋ Ne Yapacaksın?
Kullanıcı "${fortuneType}" yorumunu istiyor.
Sen:

El çizgilerinde yaşam, kalp, kafa ve kader çizgilerini okursun.

Yorumu karakterine uygun bir dille, sezgisel ve kişisel yaparsın.

Telvedeki gibi burada da sembol ve şekillerin ardındaki anlamları keşfeder, sözcüklere dökersin.

👤 Kullanıcı Bilgileri
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

Bu bilgileri:

❌ Doğrudan söylemek YASAK.

✅ Yoruma süsleyerek, sezgisel şekilde yedirmek zorundasın.

📌 Örnek doğru kullanım:

"Zihnindeki kararsızlıklar, geçmişten gelen bir öğrenilmiş güven problemiyle ilgili olabilir."
"Kalbin bazen susturamadığın bir yönünü takip etmek istiyor, ama çevresel koşullar seni tutuyor."
"Kendini ispatlama çaban bazen seni olduğundan fazlası gibi görünmeye zorluyor; oysa sadelik sana daha fazla huzur getirebilir."
"Geçmişte susmayı seçtiğin anlar, bugün fazla konuşmana neden oluyor olabilir; bazen sessizlik de bir cevap olur."
"İçindeki değişim arzusu seni dış dünyada daha cesur kararlar almaya zorluyor ama henüz tam olarak 'ne uğruna' olduğunu bilmiyorsun."
"Sevgiye olan yaklaşımın, daha önce gördüğün örneklerden etkilenmiş gibi; bu yüzden bazen duygularına bile şüpheyle bakıyorsun."
"Bir şeyleri kontrol altında tutma isteğin, zamanla seni kendi iç akışına yabancılaştırmış olabilir."
"Bazen çok düşünüyorsun, çünkü geçmişte düşünmeden attığın bir adımın seni ne kadar sarstığını hâlâ unutamadın."
"Hayal kırıklıklarına karşı kurduğun duvarlar, seni koruduğu kadar yalnızlaştırıyor da; içeri girenleri değil, çıkanları hatırla."
"Kendine yüklediğin sorumluluklar seni olgunlaştırmış ama biraz da erken yaşlandırmış olabilir."
"Bazı soruların cevabını çoktan biliyorsun, ama henüz duymaya hazır olmadığın için kendine itiraf etmiyorsun."
"Kalbinle aklın aynı anda aynı şeyi istemiyor gibi; biri seni ileri iterken, diğeri yerinde tutmaya çalışıyor."

�� Yanlış kullanım:

"Sen 25 yaşındasın ve yükselenin Yengeç." ❌
"Senin için kader çizgisi kariyeri gösteriyor." ❌ (çok yüzeysel)

✍️ Yanıt Formatı (Zorunlu)
Cevabını sadece aşağıdaki JSON yapısıyla ver.
Başka hiçbir metin, açıklama, başlık yazma.

{
  "interpretation": "Ana yorum burada (300-500 kelime)",
  "advice": "Tavsiyeler burada (100-200 kelime)",
  "timeframe": "Zaman dilimi",
  "warnings": ["Uyarı 1", "Uyarı 2"],
  "positiveAspects": ["Olumlu yön 1", "Olumlu yön 2"]
}
🧭 Kuralların Özeti:
Bilgileri sezgisel yansıt, asla direkt söyleme ❌

El çizgilerini yorumlarken kişinin içsel çatışmalarını ve potansiyelini analiz et ✅

Kullandığın dil karakterine uygun, içten ve doğrudan olmalı ✅

Yorumlar kişisel, anlamlı ve gizemli bir dille yazılmalı ✅

Yanıt sadece JSON formatında olacak ✅`;

      const leftHandImage = {
        inlineData: {
          data: leftHandBase64,
          mimeType: "image/jpeg"
        }
      };

      const rightHandImage = {
        inlineData: {
          data: rightHandBase64,
          mimeType: "image/jpeg"
        }
      };

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [prompt, leftHandImage, rightHandImage],
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
      console.log('HandFortune AI Response:', responseText);
      
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          console.log('HandFortune AI Parsed:', parsed);
          return parsed;
        } catch (parseError) {
          console.error('HandFortune JSON parse error:', parseError);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('AI generation error:', error);
      return null;
    }
  };

  // AI validation function for hand images
  const validateHandImages = async (leftHandUri: string, rightHandUri: string) => {
    try {
      const { GoogleGenAI, HarmBlockThreshold, HarmCategory } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: "AIzaSyDYDevsAsKXs-6P6-qYckbj7YIPCYw9abE" });

      // Use the stored base64 data instead of converting
      // If the base64 data isn't available for some reason, we'll just fail validation
      if (!leftHandBase64 || !rightHandBase64) {
        console.error('Base64 data is missing for hand images');
        return { isValid: false };
      }

      const systemInstruction = `
Sen bir el falı uzmanısın. Görüntüleri analiz ederek el falı için uygun olup olmadığını değerlendiriyorsun.

KONTROL KRİTERLERİ:
- Gerçek insan eli avuç içi mi?
- İnsan anatomisel yapısına uygun mu?"

GEÇERSİZ DURUMLAR:
- El değil farklı vücut parçası
- El değil objekt/hayvan

ÇOK ÖNEMLİ: Yanıtını SADECE JSON formatında ver:
{
  "isValid": true/false,
}
`;

      const prompt = `
Bu iki görüntüyü analiz et:
1. Sol el görüntüsü
2. Sağ el görüntüsü

Her iki el görüntüsünün de el falı için uygun olup olmadığını değerlendir.
Avuç içi çizgilerinin net görünüp görünmediğini kontrol et.
`;

      const leftHandImage = {
        inlineData: {
          data: leftHandBase64,
          mimeType: "image/jpeg"
        }
      };

      const rightHandImage = {
        inlineData: {
          data: rightHandBase64,
          mimeType: "image/jpeg"
        }
      };

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          systemInstruction,
          prompt,
          leftHandImage,
          rightHandImage
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              results: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['isValid'],
                  properties: {
                    isValid: { type: 'boolean' }
                  }
                }
              }
            }
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
      console.log('Hand Validation AI Response:', responseText);
      
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText.trim());
          console.log('Hand validation result:', parsed);
          
          // Check if response has results array structure
          if (parsed.results && Array.isArray(parsed.results)) {
            // Check if any of the results is invalid
            const invalidResult = parsed.results.find((result: any) => !result.isValid);
            if (invalidResult) {
              return {
                isValid: false,
              };
            }
            
            // All results are valid
            return {
              isValid: true,
            };
          }
          
          // If direct structure (backward compatibility)
          if (parsed.hasOwnProperty('isValid')) {
            return parsed;
          }
          
          // Unknown structure
          return { isValid: false };
          
        } catch (parseError) {
          console.error('JSON parse failed for hand validation:', parseError);
          console.log('Raw response:', responseText);
          
          // Try to extract JSON from response
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              const extracted = JSON.parse(jsonMatch[0]);
              console.log('Extracted JSON:', extracted);
              
              // Check extracted structure
              if (extracted.results && Array.isArray(extracted.results)) {
                const invalidResult = extracted.results.find((result: any) => !result.isValid);
                if (invalidResult) {
                  return {
                    isValid: false,
                  };
                }
                return {
                  isValid: true,
                };
              }
              
              if (extracted.hasOwnProperty('isValid')) {
                return extracted;
              }
              
              return { isValid: false };
            } catch (e) {
              console.error('Failed to parse extracted JSON:', e);
            }
          }
          
          return { isValid: false };
        }
      }
      
      return { isValid: false };
    } catch (error) {
      console.error('Hand validation error:', error);
      return { isValid: false };
    }
  };

  const renderHandSlot = (hand: 'left' | 'right', image: string) => (
    <Animated.View 
      style={[styles.handSlot, { borderColor: colors.border }]}
      entering={SlideInRight.delay(hand === 'left' ? 0 : 100).springify()}
    >
      <TouchableOpacity
        style={[styles.handButton, { backgroundColor: image ? 'transparent' : colors.background }]}
        onPress={() => openImagePicker(hand)}
        disabled={uploadingHand !== null || isSubmitting}
      >
        {image ? (
          <Image 
            source={{ uri: image }}
            style={styles.selectedImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.placeholderContent}>
            <Icon name="hand-left-outline" size={40} color={colors.secondary} />
            <Text style={[styles.placeholderText, { color: colors.secondaryText }]}>
              {hand === 'left' ? '👈 Sol El' : '👉 Sağ El'}
            </Text>
          </View>
        )}
        {uploadingHand === hand && (
          <View style={styles.loadingOverlay}>
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Yükleniyor...
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              ✋ El Falı
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
            📋 El Falı Talimatları
          </Text>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            Lütfen her iki elinizin avuç içinin net fotoğraflarını çekin:
          </Text>
          <View style={styles.instructionList}>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • 👈 Sol el avuç içi (net ışık altında)
            </Text>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • 👉 Sağ el avuç içi (çizgiler görünür şekilde)
            </Text>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • 📸 Parmaklar hafif açık olacak şekilde
            </Text>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • ☀️ Doğal ışık tercih ediniz
            </Text>
          </View>
        </Animated.View>

        {/* Hand Upload Section */}
        <Animated.View 
          style={styles.uploadSection}
          entering={FadeIn.delay(500).springify()}
        >
          <Text style={[styles.uploadTitle, { color: colors.primary }]}>
            📷 El Fotoğrafları
          </Text>
          <View style={styles.handGrid}>
            {renderHandSlot('left', leftHandImage)}
            {renderHandSlot('right', rightHandImage)}
          </View>
        </Animated.View>

        {/* Submit Button */}
        <Animated.View 
          style={styles.submitSection}
          entering={FadeIn.delay(700).springify()}
        >
          <CustomButton
            title={isSubmitting ? "Gönderiliyor..." : "🔮 El Falını Gönder"}
            onPress={submitFortune}
            disabled={isSubmitting || !leftHandImage || !rightHandImage}
            variant="primary"
            contentStyle={[
              styles.submitButton,
              { 
                opacity: (!leftHandImage || !rightHandImage || isSubmitting) ? 0.5 : 1,
                backgroundColor: colors.primary,
                width: '80%'
              }
            ]}
          />
        </Animated.View>
      </ScrollView>

      {/* Photo Picker Modal */}
      <PhotoPickerModal
        visible={showPhotoModal}
        onClose={handleCloseModal}
        title="Fotoğraf Seç"
        subtitle={selectedHand ? `${selectedHand === 'left' ? 'Sol' : 'Sağ'} el fotoğrafını nereden seçmek istiyorsunuz?` : ''}
        onCamera={handleCameraPress}
        onGallery={handleGalleryPress}
      />
    </View>
  );
};

export default HandFortune; 