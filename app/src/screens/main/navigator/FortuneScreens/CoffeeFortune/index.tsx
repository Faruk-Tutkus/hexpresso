import { db, storage } from '@api/config.firebase';
import Icon from '@assets/icons';
import { CustomButton, PhotoPickerModal } from '@components';
import { Seer } from '@hooks';
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
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
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
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const newImages = [...selectedImages];
        newImages[index] = imageUri;
        setSelectedImages(newImages);
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
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const newImages = [...selectedImages];
        newImages[index] = imageUri;
        setSelectedImages(newImages);
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
      // Validate coffee images with AI first
      showToast('Görüntüler doğrulanıyor...', 'info');
      const validImages = selectedImages.filter(img => img);
      const validation = await validateCoffeeImages(validImages);
      console.log(validation);
      if (!validation.isValid) {
        setTimeout(() => {
          showToast(`Geçersiz görüntü: ${validation.reason}`, 'error');
        }, 1000);
        return;
      }
      
      // Get fortune cost
      const fortuneIndex = seer.fortunes.indexOf('Kahve Falı');
      const fortuneCost = seer.coins[fortuneIndex] || seer.coins[0];
      
      // Check user's coin balance
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('Kullanıcı verisi bulunamadı');
      }
      
      const userData = userDoc.data();
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

      showToast('Falınız hazırlanıyor bu işlem biraz zaman alabilir...', 'info');

      // Get user data for personalization

      // Generate AI interpretation immediately
      const aiResult = await generateFortuneInterpretation({
        fortuneType: 'Kahve Falı',
        seerData: seer,
        images: downloadUrls,
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
      const ai = new GoogleGenAI({ apiKey: "AIzaSyBeAM7n8yGpXmNJfDL7WkUcC09m0fKEQNo" });

      const prompt = `
Sen ${seerData.name} adında bir falcısın. Karakter: "${seerData.character}"
Hayat hikayen: "${seerData.lifestory}"

${fortuneType} yorumu yapacaksın.

Yorum yaparken kendi özünü ve bilgilerini kullan ancak bunları kullanıcıya hissettirme.

KULLANICI BİLGİLERİ:
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

Bu bilgileri de kullanarak yorumunu daha kişisel ve anlamlı yap.
Kişinin bilgilerini direkt kullanıcıya söyleme.
Kullanıcı bilgileri harmanlayarak yorumunu daha kişisel ve anlamlı yap.

Bu bilgileri de kullanarak yorumunu daha kişisel ve anlamlı yap.

ÇOK ÖNEMLİ: Yanıtını SADECE JSON formatında ver, başka hiçbir metin ekleme:

{
  "interpretation": "Ana yorum burada (300-500 kelime)",
  "advice": "Tavsiyeler burada (100-200 kelime)", 
  "timeframe": "Zaman dilimi",
  "warnings": ["Uyarı 1", "Uyarı 2"],
  "positiveAspects": ["Olumlu yön 1", "Olumlu yön 2"]
}

Kahve fincanı analizi: Telve desenlerinde kader çizgileri, değişim sembolleri görüldü.
Falcı karakterin uygun dil kullan, Türkçe yaz, "sen" diye hitap et.
`;

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

  // Convert image URI to base64 - same as HandFortune
  const imageToBase64 = async (uri: string): Promise<string> => {
    try {
      // For Expo managed workflow
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Görüntü işlenirken hata oluştu');
    }
  };

  // AI validation function for coffee images - same approach as HandFortune
  const validateCoffeeImages = async (images: string[]) => {
    try {
      const { GoogleGenAI, HarmBlockThreshold, HarmCategory } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: "AIzaSyBeAM7n8yGpXmNJfDL7WkUcC09m0fKEQNo" });

      // Convert all images to base64
      console.log(`🔄 Converting ${images.length} coffee images to base64...`);
      const base64Images: string[] = [];
      
      for (let i = 0; i < images.length; i++) {
        console.log(`🖼️ Converting image ${i + 1}/${images.length}...`);
        const base64 = await imageToBase64(images[i]);
        base64Images.push(base64);
      }

      console.log('🤖 Validating all coffee images with AI...');

      const systemInstruction = `
Sen bir kahve falı uzmanısın. Görüntüleri analiz ederek kahve falı için uygun olup olmadığını değerlendiriyorsun.

KONTROL KRİTERLERİ:
- Her bir görseli kontrol et
- Her bir görselde gerçek kahve fincanı var mı?
- Her bir görselde telve/kahve tortusu görünüyor mu?
- Her bir görselde türk kahvesi fincanı mı (geniş, alçak)?
- Her bir görselde kahve fincanı var mı?
- Yüklenen tüm görseller kriterleri sağlıyor mu?

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
  "reason": "Açıklama mesajı"
}
`;

      const prompt = `
Bu ${images.length} kahve fincanı görüntüsünü analiz et.
Her görüntünün kahve falı için uygun olup olmadığını değerlendir.
Fincan içinde telve/tortu desenleri var mı?
`;

      // Create image data objects
      const imageData = base64Images.map(base64 => ({
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
            required: ["isValid", "reason"],
            properties: {
              isValid: { type: 'boolean' },
              reason: { type: 'string' },
              details: { type: 'string' },
              validImages: { 
                type: 'array',
                items: { type: 'number' }
              },
              invalidImages: {
                type: 'array',
                items: { type: 'number' }
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
      console.log('☕ Coffee Validation AI Response:', responseText);
      
      if (responseText) {
        try {
          // Direct JSON parse with structured response
          const parsed = JSON.parse(responseText);
          console.log('✅ Coffee validation result:', parsed);
          
          // Validate response structure
          if (typeof parsed.isValid === 'boolean' && typeof parsed.reason === 'string') {
            return {
              isValid: parsed.isValid,
              reason: parsed.reason
            };
          } else {
            console.error('❌ Invalid response structure:', parsed);
            return { isValid: false, reason: 'AI yanıtı geçersiz yapıda' };
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
                  reason: extracted.reason || 'AI doğrulama tamamlandı'
                };
              }
            }
            
            // If all else fails, try to determine from response text
            const responseTextLower = responseText.toLowerCase();
            if (responseTextLower.includes('geçersiz') || responseTextLower.includes('false') || responseTextLower.includes('invalid')) {
              return { isValid: false, reason: 'Görüntü analizi: Geçersiz resim tespit edildi' };
            } else if (responseTextLower.includes('geçerli') || responseTextLower.includes('true') || responseTextLower.includes('valid')) {
              return { isValid: true, reason: 'Görüntü analizi: Tüm resimler uygun' };
            }
            
          } catch (fallbackError) {
            console.error('❌ Fallback parse also failed:', fallbackError);
          }
          
          return { isValid: false, reason: 'Görüntü analizi başarısız oldu' };
        }
      }
      
      return { isValid: false, reason: 'AI yanıtı alınamadı' };
    } catch (error) {
      console.error('❌ Coffee validation error:', error);
      return { isValid: false, reason: 'Görüntü doğrulama hatası' };
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
              • 1️⃣ Fincanın içi (telve deseni)
            </Text>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • 2️⃣ Fincanın dış yanı
            </Text>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • 3️⃣ Tabağın üstü
            </Text>
            <Text style={[styles.instructionItem, { color: colors.secondaryText }]}>
              • 4️⃣ Genel görünüm (fincan + tabak)
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