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

const CoffeeFortune = () => {
  const { seerData } = useLocalSearchParams();
  const seer: Seer = JSON.parse(seerData as string);
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { showInterstitial } = useInterstitial({})
  const { scheduleFortuneCompletionNotification } = useFortuneNotificationManager();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedImagesBase64, setSelectedImagesBase64] = useState<string[]>([]);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openImagePicker = (index: number) => {
    setSelectedImageIndex(index);
    setShowPhotoModal(true);
  };

  const handleCloseModal = () => {
    setShowPhotoModal(false);
    setSelectedImageIndex(null);
  };

  const handleCameraPress = () => {
    setShowPhotoModal(false);
    if (selectedImageIndex !== null) {
      takePhoto(selectedImageIndex);
    }
  };

  const handleGalleryPress = () => {
    setShowPhotoModal(false);
    if (selectedImageIndex !== null) {
      pickFromGallery(selectedImageIndex);
    }
  };

  const takePhoto = async (index: number) => {
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
        
        const newImages = [...selectedImages];
        const newImagesBase64 = [...selectedImagesBase64];
        newImages[index] = imageUri;
        newImagesBase64[index] = imageBase64;
        setSelectedImages(newImages);
        setSelectedImagesBase64(newImagesBase64);
      }
    } catch (error) {
      console.error('Camera error:', error);
      showToast('Kamera ile fotoğraf çekerken hata oluştu', 'error');
    }
  };

  const pickFromGallery = async (index: number) => {
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
        
        const newImages = [...selectedImages];
        const newImagesBase64 = [...selectedImagesBase64];
        newImages[index] = imageUri;
        newImagesBase64[index] = imageBase64;
        setSelectedImages(newImages);
        setSelectedImagesBase64(newImagesBase64);
      }
    } catch (error) {
      console.error('Gallery picker error:', error);
      showToast('Galeriden fotoğraf seçerken hata oluştu', 'error');
    }
  };

  const uploadImageToFirebase = async (imageUri: string, index: number): Promise<string> => {
    try {
      setUploadingIndex(index);
      console.log(`🔄 Starting upload for image ${index + 1}...`);
      console.log(`📱 Image URI: ${imageUri}`);
      console.log(`👤 User UID: ${user?.uid}`);
      
      const filename = `coffee_fortune_${user?.uid}_${Date.now()}_${index}.jpg`;
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
      if (blob.size > 5 * 1024 * 1024) {
        throw new Error('Dosya boyutu çok büyük (max 5MB)');
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
      console.log(`🎉 Image ${index + 1} uploaded successfully: ${downloadURL}`);
      
      return downloadURL;
    } catch (error) {
      console.error(`❌ Error uploading image ${index + 1}:`, error);
      
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
      setUploadingIndex(null);
    }
  };

  const submitFortune = async () => {
    if (selectedImages.filter(img => img).length < 4) {
      showToast('Lütfen 4 farklı kahve fincanı fotoğrafı yükleyiniz', 'error');
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

      // Validate coffee images with AI first
      showToast('Görüntüler doğrulanıyor...', 'info');
      const validBase64Images = selectedImagesBase64.filter(base64 => base64);
      const validation = await validateCoffeeImages(validBase64Images);
      console.log(validation);
      if (!validation.isValid) {
        showToast(`Geçersiz görüntü lütfen kahve fincanı fotoğrafınızı kontrol ediniz`, 'error');
        return;
      }
      
      // Get fortune cost
      const fortuneIndex = seer.fortunes.indexOf('Kahve Falı');
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

      
      // Upload all images sequentially to show progress
      const downloadUrls: string[] = [];
      for (let i = 0; i < selectedImages.length; i++) {
        if (selectedImages[i]) {
          try {
            const url = await uploadImageToFirebase(selectedImages[i], i);
            downloadUrls.push(url);
          } catch (uploadError) {
            console.error(`Upload error for image ${i + 1}:`, uploadError);
            // Refund coins if upload fails
            await updateDoc(doc(db, 'users', user.uid), {
              coins: currentCoins
            });
            throw uploadError;
          }
        }
      }

      if (downloadUrls.length < 4) {
        // Refund coins if not all images uploaded
        await updateDoc(doc(db, 'users', user.uid), {
          coins: currentCoins
        });
        throw new Error('Tüm fotoğraflar yüklenemedi');
      }

      // Generate AI interpretation immediately
      const aiResult = await generateFortuneInterpretation({
        fortuneType: 'Kahve Falı',
        seerData: seer,
        images: selectedImagesBase64,
        userData: userData
      });

      // Create fortune record with AI result but pending status
      const fortuneRecord = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2,9)}_coffee`,
        seerData: seer,
        fortuneType: 'Kahve Falı',
        images: downloadUrls,
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
        fortuneType: 'Kahve Falı',
        responseTimeMinutes: seer.responsetime
      });

      if (notificationId) {
        showInterstitial();
      }
      
      showToast('Kahve falınız başarıyla gönderildi!', 'success');
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

      if (!images) {
        console.error('Base64 data is missing for coffee images');
        return;
      }

      const imageData = images.map((image: string) => ({
        inlineData: {
          data: image,
          mimeType: "image/jpeg"
        }
      }));
      

      const prompt = `
🧙‍♀️ Sen Kimsin?
Sen bir falcısın.
Adın: ${seerData.name}
Karakterin: "${seerData.character}"
Hakkında kısa bilgi: "${seerData.info}"
Geçmişin, hayat yolculuğun: "${seerData.lifestory}"

Bu bilgiler senin yorum stilini ve bakış açını şekillendirir.
Ama kullanıcıya hiçbir zaman bu karakter detaylarını açıkça söylemezsin.
Yalnızca sezgilerinle hissettirirsin.

☕ Ne Yapacaksın?
Kullanıcı "${fortuneType}" yorumunu istiyor.
Sen bu yorumda:

Kahve telvesinden, sembollerden, hislerden yola çıkarak derin analiz yaparsın.

Gönderilen görseller: fincanın içi (telve deseni), diğeri tabağın üstü, diğeri fincanın dış yanı ve diğeri genel görünüm (kapalı fincan + tabak).

Telvede "kader çizgileri, değişim sembolleri" gibi işaretler varsa onları yorumuna katarsın.

Kullanıcının geçmişi, hali ve ihtiyacı hakkında sezgisel yorumlar yaparsın.

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

Bu bilgileri asla doğrudan söylemezsin.
Yani şu tarz ifadeler YASAK:

❌ "Sen şu burçsun"
❌ "Şu yaştasın"
❌ "Yükselenin bu"

Onun yerine, bu bilgileri yorumuna dolaylı şekilde, sezgisel biçimde katarsın.
Yani şöyle olur:
"Hayatında bazı şeyleri kontrol etme isteği bazen seni yoruyor olabilir."
"Son dönemde çevrende gördüğün değişimler, içindeki dönüşümü de tetiklemiş gibi."
"Son zamanlarda yaşadığın belirsizlikler, seni içten içe biraz yormuş gibi."
"Kendini ifade etme ihtiyacın, bazen etrafındakilerle olan dengeni zorluyor olabilir."
"Yaşadığın deneyimler, iç dünyanda sessiz ama derin bir değişimi başlatmış."
"İçindeki huzur arayışı, dış dünyadaki karmaşayla çatışıyor gibi."
"Bazen kendi duygularını anlamakta zorlandığın anlar seni yavaşlatıyor olabilir."
"Yakın çevrende gördüğün hareketlilik, senin de adım atmanı cesaretlendiriyor."
"Geçmişte yaşadığın bazı izler, bugün verdiğin kararları etkiliyor gibi."
"İçsel sesin, dışarıdaki seslerden daha güçlü ve yönlendirici olmaya başlıyor."
"Bilinmezlikler karşısında hissettiğin endişe, seni temkinli adımlar atmaya zorluyor."
"Kendine yüklediğin beklentiler, bazen gerçek potansiyelini gölgelemiş olabilir."

✨ Yanıt Formatı (Zorunlu)
Cevabını sadece aşağıdaki JSON yapısıyla ver.
Hiçbir ekstra açıklama, metin veya yorum yazma.

{
  "interpretation": "Ana yorum burada (200-300 kelime)",
  "advice": "Tavsiyeler burada (50-150 kelime)",
  "timeframe": "Zaman dilimi",
  "warnings": ["Uyarı 1", "Uyarı 2"],
  "positiveAspects": ["Olumlu yön 1", "Olumlu yön 2"]
}
🔐 Kritik Kurallar:
Kullanıcı bilgileri doğrudan söylenmeyecek ❌

Bilgiler yorumlara sezgisel ve zarif şekilde yedirilecek ✅

Yorumlar kişisel, doğal ve derin olacak ✅

Dili, falcı karakterine uygun şekilde seç (samimi, gizemli, içten) ✅

Yanıt sadece JSON formatında olacak ✅`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [prompt, ...imageData],
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
      console.log('CoffeeFortune AI Response:', responseText);
      
      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          console.log('CoffeeFortune AI Parsed:', parsed);
          return parsed;
        } catch (parseError) {
          console.error('CoffeeFortune JSON parse error:', parseError);
          return null;
        }
      }
      
      return null;
    } catch (error) {
      console.error('AI generation error:', error);
      return null;
    }
  };

  // AI validation function for coffee images
  const validateCoffeeImages = async (images: string[]) => {
    try {
      const { GoogleGenAI, HarmBlockThreshold, HarmCategory } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: "AIzaSyDYDevsAsKXs-6P6-qYckbj7YIPCYw9abE" });

      // Use the stored base64 data instead of converting
      //const validBase64Images = selectedImagesBase64.filter(base64 => base64);
      
      if (images.length < 4) {
        console.error('Insufficient base64 data for coffee images');
        return { isValid: false };
      }

      console.log(`🤖 Validating ${images.length} coffee images with AI...`);

      const systemInstruction = `
Sen bir kahve falı uzmanısın. Görüntüleri analiz ederek kahve falı için uygun olup olmadığını değerlendiriyorsun.

KONTROL KRİTERLERİ:
- En az bir görselde gerçek bir kahve fincanı yer almalı.
- En az bir görselde fincan içinde kahve telvesi/tortusu açıkça görünmeli.
- En az bir görselde Türk kahvesi fincanı (geniş ve alçak tipte) kullanılmalı.
- En az bir görselde fincanın dış yüzeyi görünür olmalı.
- En az bir görselde tabak ve kapalı fincan birlikte yer almalı.
- En az bir görselde fincan net şekilde seçilebiliyor olmalı (bulanık veya karanlık olmamalı).
- Yüklenen tüm görseller kriterlerden en az birini sağlamalıdır aksi takdirde geçersiz olarak değerlendir.

GEÇERSİZ DURUMLAR:
- Kahve fincanı yok
- Telve/tortu yok
- Çay fincanı (küçük, ince)
- Su bardağı
- Alakasız objeler
- Yüklenen tüm görseller kriterleri sağlamıyor

ÇOK ÖNEMLİ: Yanıtını SADECE JSON formatında ver:
{
  "isValid": true/false,
}
`;

      const prompt = `
Bu ${images.length} kahve fincanı görüntüsünü analiz et.
Her görüntünün kahve falı için uygun olup olmadığını değerlendir.
Fincan içinde telve/tortu desenleri var mı?
`;

      // Create image data objects
      const imageData = images.map(base64 => ({
        inlineData: {
          data: base64,
          mimeType: "image/jpeg"
        }
      }));

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          systemInstruction,
          prompt,
          ...imageData
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            required: ["isValid"],
            properties: {
              isValid: { type: 'boolean' },
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
      console.log('☕ Coffee Validation AI Response:', responseText);
      
      if (responseText) {
        try {
          // Direct JSON parse with structured response
          const parsed = JSON.parse(responseText);
          console.log('✅ Coffee validation result:', parsed);
          
          // Validate response structure
          if (typeof parsed.isValid === 'boolean') {
            return {
              isValid: parsed.isValid,
            };
          } else {
            console.error('❌ Invalid response structure:', parsed);
            return { isValid: false };
          }
          
        } catch (parseError) {
          console.error('❌ JSON parse failed for coffee validation:', parseError);
          console.log('Raw response:', responseText);
          
          // Fallback: try to extract JSON manually
          try {
            // Remove any non-JSON content
            let cleanResponse = responseText.trim();
            
            // Find JSON object
            const jsonStart = cleanResponse.indexOf('{');
            const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
            
            if (jsonStart !== -1 && jsonEnd !== -1) {
              const jsonString = cleanResponse.substring(jsonStart, jsonEnd);
              console.log('🔧 Attempting to parse extracted JSON:', jsonString);
              
              const extracted = JSON.parse(jsonString);
              
              if (typeof extracted.isValid === 'boolean') {
                return {
                  isValid: extracted.isValid,
                };
              }
            }
            
            // If all else fails, try to determine from response text
            const responseTextLower = responseText.toLowerCase();
            if (responseTextLower.includes('geçersiz') || responseTextLower.includes('false') || responseTextLower.includes('invalid')) {
              return { isValid: false };
            } else if (responseTextLower.includes('geçerli') || responseTextLower.includes('true') || responseTextLower.includes('valid')) {
              return { isValid: true };
            }
            
          } catch (fallbackError) {
            console.error('❌ Fallback parse also failed:', fallbackError);
          }
          
          return { isValid: false };
        }
      }
      
      return { isValid: false };
    } catch (error) {
      console.error('❌ Coffee validation error:', error);
      return { isValid: false };
    }
  };

  const renderImageSlot = (index: number) => (
    <Animated.View 
      key={index}
      style={[styles.imageSlot, { borderColor: colors.border }]}
      entering={SlideInRight.delay(index * 100).springify()}
    >
      <TouchableOpacity
        style={[styles.imageButton, { backgroundColor: selectedImages[index] ? 'transparent' : colors.background }]}
        onPress={() => openImagePicker(index)}
        disabled={uploadingIndex === index || isSubmitting}
      >
        {selectedImages[index] ? (
          <Image 
            source={{ uri: selectedImages[index] }}
            style={styles.selectedImage}
            contentFit="cover"
          />
        ) : (
          <View style={styles.placeholderContent}>
            <Icon name="cafe-outline" size={40} color={colors.secondary} />
            <Text style={[styles.placeholderText, { color: colors.secondaryText }]}>
              {index + 1}. Fotoğraf
            </Text>
          </View>
        )}
        {uploadingIndex === index && (
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
              ☕ Kahve Falı
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
            📋 Kahve Falı Talimatları
          </Text>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            Lütfen aşağıdaki 4 farklı kahve fincanının fotoğraflarını çekin:
          </Text>
          <View style={styles.instructionList}>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • 1️⃣ Genel görünüm (Kapalı fincan + tabak)
            </Text>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • 2️⃣ Fincanın içi (telve deseni)
            </Text>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • 3️⃣ Tabağın üstü
            </Text>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • 4️⃣ Fincanın dış yanı
            </Text>
          </View>
        </Animated.View>

        {/* Image Upload Section */}
        <Animated.View 
          style={styles.uploadSection}
          entering={FadeIn.delay(500).springify()}
        >
          <Text style={[styles.uploadTitle, { color: colors.primary }]}>
            📷 Fotoğraf Yükleme
          </Text>
          <View style={styles.imageGrid}>
            {[0, 1, 2, 3].map(renderImageSlot)}
          </View>
        </Animated.View>

        {/* Submit Button */}
        <Animated.View 
          style={styles.submitSection}
          entering={FadeIn.delay(700).springify()}
        >
          <CustomButton
            title={isSubmitting ? "Gönderiliyor..." : "🔮 Kahve Falını Gönder"}
            onPress={submitFortune}
            disabled={isSubmitting || selectedImages.filter(img => img).length < 4}
            variant="primary"
            contentStyle={[
              styles.submitButton,
              { 
                opacity: (selectedImages.filter(img => img).length < 4 || isSubmitting) ? 0.5 : 1,
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
        subtitle={selectedImageIndex !== null ? `${selectedImageIndex + 1}. fincan fotoğrafını nereden seçmek istiyorsunuz?` : ''}
        onCamera={handleCameraPress}
        onGallery={handleGalleryPress}
      />
    </View>
  );
};

export default CoffeeFortune; 