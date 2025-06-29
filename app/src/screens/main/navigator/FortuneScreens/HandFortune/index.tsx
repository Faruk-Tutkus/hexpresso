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

const HandFortune = () => {
  const { seerData } = useLocalSearchParams();
  const seer: Seer = JSON.parse(seerData as string);
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [leftHandImage, setLeftHandImage] = useState<string>('');
  const [rightHandImage, setRightHandImage] = useState<string>('');
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
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        if (hand === 'left') {
          setLeftHandImage(imageUri);
        } else {
          setRightHandImage(imageUri);
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
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        if (hand === 'left') {
          setLeftHandImage(imageUri);
        } else {
          setRightHandImage(imageUri);
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
      // Validate hand images with AI first
      showToast('Görüntüler doğrulanıyor...', 'info');
      const validation = await validateHandImages(leftHandImage, rightHandImage);
      
      if (!validation.isValid) {
        showToast(`Geçersiz görüntü: ${validation.reason}`, 'error');
        return;
      }
      
      // Get fortune cost
      const fortuneIndex = seer.fortunes.indexOf('El Falı');
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

      showToast('Falınız hazırlanıyor...', 'info');

      // Generate AI interpretation immediately
      const aiResult = await generateFortuneInterpretation({
        fortuneType: 'El Falı',
        seerData: seer,
        images: { leftHand: leftHandUrl, rightHand: rightHandUrl }
      });

      // Create fortune record with AI result but pending status
      const fortuneRecord = {
        id: Date.now().toString(),
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
        coin: fortuneCost,
        result: aiResult ? JSON.stringify(aiResult) : null
      };

      // Add to user's document fortunerecord array
      await updateDoc(doc(db, 'users', user.uid), {
        fortunerecord: arrayUnion(fortuneRecord)
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
  const generateFortuneInterpretation = async ({ fortuneType, seerData, images }: any) => {
    try {
      const { GoogleGenAI, HarmBlockThreshold, HarmCategory } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: "AIzaSyBeAM7n8yGpXmNJfDL7WkUcC09m0fKEQNo" });

      const prompt = `
Sen ${seerData.name} adında bir falcısın. Karakter: "${seerData.character}"
Hayat hikayen: "${seerData.lifestory}"

${fortuneType} yorumu yapacaksın.

ÇOK ÖNEMLİ: Yanıtını SADECE JSON formatında ver, başka hiçbir metin ekleme:

{
  "interpretation": "Ana yorum burada (300-500 kelime)",
  "advice": "Tavsiyeler burada (100-200 kelime)",
  "timeframe": "Zaman dilimi",
  "warnings": ["Uyarı 1", "Uyarı 2"],
  "positiveAspects": ["Olumlu yön 1", "Olumlu yön 2"]
}

El çizgileri analizi: Yaşam, kalp, kafa ve kader çizgileri incelendi.
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

  // Convert image URI to base64
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

  // AI validation function for hand images
  const validateHandImages = async (leftHandUri: string, rightHandUri: string) => {
    try {
      const { GoogleGenAI, HarmBlockThreshold, HarmCategory } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: "AIzaSyBeAM7n8yGpXmNJfDL7WkUcC09m0fKEQNo" });

      // Convert images to base64
      const leftHandBase64 = await imageToBase64(leftHandUri);
      const rightHandBase64 = await imageToBase64(rightHandUri);

      const systemInstruction = `
Sen bir el falı uzmanısın. Görüntüleri analiz ederek el falı için uygun olup olmadığını değerlendiriyorsun.

KONTROL KRİTERLERİ:
- Gerçek insan eli avuç içi mi?
- İnsan anatomisel yapısına uygun mu?

GEÇERSİZ DURUMLAR:
- El değil farklı vücut parçası
- El değil objekt/hayvan

ÇOK ÖNEMLİ: Yanıtını SADECE JSON formatında ver:
{
  "isValid": true/false,
  "reason": "Açıklama mesajı"
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
                  required: ['isValid', 'reason'],
                  properties: {
                    isValid: { type: 'boolean' },
                    reason: { type: 'string' }
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
                reason: invalidResult.reason
              };
            }
            
            // All results are valid
            return {
              isValid: true,
              reason: 'Tüm görüntüler el falı için uygun'
            };
          }
          
          // If direct structure (backward compatibility)
          if (parsed.hasOwnProperty('isValid')) {
            return parsed;
          }
          
          // Unknown structure
          return { isValid: false, reason: 'AI yanıtı beklenmeyen formatta' };
          
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
                    reason: invalidResult.reason
                  };
                }
                return {
                  isValid: true,
                  reason: 'Tüm görüntüler el falı için uygun'
                };
              }
              
              if (extracted.hasOwnProperty('isValid')) {
                return extracted;
              }
              
              return { isValid: false, reason: 'Görüntü analizi başarısız oldu' };
            } catch (e) {
              console.error('Failed to parse extracted JSON:', e);
            }
          }
          
          return { isValid: false, reason: 'Görüntü analizi başarısız oldu' };
        }
      }
      
      return { isValid: false, reason: 'AI yanıtı alınamadı' };
    } catch (error) {
      console.error('Hand validation error:', error);
      return { isValid: false, reason: 'Görüntü doğrulama hatası' };
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