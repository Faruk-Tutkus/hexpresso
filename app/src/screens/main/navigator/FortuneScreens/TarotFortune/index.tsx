import { useInterstitial } from '@ads';
import { db } from '@api/config.firebase';
import Icon from '@assets/icons';
import { CustomButton } from '@components';
import { Seer, TarotCard, useFetchTarots, useFortuneNotificationManager } from '@hooks';
import { useAuth, useTheme, useToast } from '@providers';
import { Image } from 'expo-image';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, SlideInDown, SlideInUp } from 'react-native-reanimated';
import styles from './styles';

interface SelectedTarotCard extends TarotCard {
  position: number; // 1-7 for the 7 positions
  meaning: string; // The meaning for this position
}

const TarotFortune = () => {
  const { seerData } = useLocalSearchParams();
  const seer: Seer = JSON.parse(seerData as string);
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { showInterstitial } = useInterstitial({});
  const { scheduleFortuneCompletionNotification } = useFortuneNotificationManager();
  const { tarots, loading: tarotsLoading, error: tarotsError } = useFetchTarots(user);
  
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<SelectedTarotCard[]>([]);
  const [currentStep, setCurrentStep] = useState<'shuffle' | 'select' | 'result'>('shuffle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Card position meanings
  const cardMeanings = [
    'Geçmişten gelen etkiler', // 1st card
    'Şu anki durum', // 2nd card
    'Gizli etkiler', // 3rd card
    'Kişilik ve duruş', // 4th card
    'Başkalarının etkisi', // 5th card
    'Yapılması gerekenler', // 6th card
    'Gelecek ve sonuç' // 7th card
  ];

  // Shuffle cards when tarots are loaded
  useEffect(() => {
    if (tarots.length > 0) {
      const shuffled = [...tarots].sort(() => Math.random() - 0.5);
      setShuffledCards(shuffled);
      setCurrentStep('select');
    }
  }, [tarots]);

  // On screen focus, reshuffle and clear selection to start fresh
  useFocusEffect(
    React.useCallback(() => {
      if (tarots.length > 0) {
        const shuffled = [...tarots].sort(() => Math.random() - 0.5);
        setShuffledCards(shuffled);
        setSelectedCards([]);
        setCurrentStep('select');
      }
    }, [tarots])
  );

  const handleCardSelection = (card: TarotCard) => {
    if (selectedCards.length >= 7) {
      showToast('7 kart seçimi tamamlandı', 'info');
      return;
    }

    const position = selectedCards.length + 1;
    const selectedCard: SelectedTarotCard = {
      ...card,
      position,
      meaning: cardMeanings[position - 1]
    };

    setSelectedCards([...selectedCards, selectedCard]);

    if (selectedCards.length + 1 === 7) {
      showToast('Tüm kartlar seçildi! Tarot falınızı gönderebilirsiniz.', 'success');
    }
  };

  const removeCard = (position: number) => {
    const updatedCards = selectedCards
      .filter(card => card.position !== position)
      .map((card, index) => ({
        ...card,
        position: index + 1,
        meaning: cardMeanings[index]
      }));
    
    setSelectedCards(updatedCards);
  };

  const resetSelection = () => {
    setSelectedCards([]);
    // Re-shuffle cards
    const shuffled = [...tarots].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
  };

  const submitFortune = async () => {
    if (selectedCards.length !== 7) {
      showToast('Lütfen 7 kart seçiniz', 'error');
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
      const fortuneIndex = seer.fortunes.findIndex(f => f.toLowerCase().includes('tarot'));
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

      showToast(`${fortuneCost} coin harcandı. Tarot falınız hazırlanıyor...`, 'info');
      setTimeout(() => {
        showToast('Fal hazırlama işlemi biraz zaman alabilir, lütfen bekleyiniz...', 'info');
      }, 5000);

      // Generate AI interpretation immediately
      const aiResult = await generateFortuneInterpretation({
        fortuneType: 'Tarot Falı',
        seerData: seer,
        selectedCards: selectedCards,
        userData: userData
      });

      // Create fortune record with AI result but pending status
      const fortuneRecord = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}_tarot`,
        seerData: seer,
        fortuneType: 'Tarot Falı',
        selectedCards: selectedCards.map(card => {
          // derive image key (filename without extension) either from url or numeric id
          let imageKey: string | number = card.id;
          if (card.url) {
            const fileName = card.url.split('/').pop() || '';
            imageKey = fileName.replace('.png', '').replace('.jpg', '');
          }
          return {
            id: card.id,
            imageKey,
            name: card.name,
            info: card.info,
            position: card.position,
            meaning: card.meaning,
          };
        }),
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
        fortuneType: 'Tarot Falı',
        responseTimeMinutes: seer.responsetime
      });

      if (notificationId) {
        showInterstitial();
      }

      showToast('Tarot falınız başarıyla gönderildi!', 'success');
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
  const generateFortuneInterpretation = async ({ fortuneType, seerData, selectedCards, userData }: any) => {
    try {
      const { GoogleGenAI, HarmBlockThreshold, HarmCategory } = require('@google/genai');
      const ai = new GoogleGenAI({ apiKey: "AIzaSyDYDevsAsKXs-6P6-qYckbj7YIPCYw9abE" });

      // Create card descriptions for AI
      const cardDescriptions = selectedCards.map((card: SelectedTarotCard, index: number) => {
        return `${index + 1}. Pozisyon (${card.meaning}): ${card.name} - ${card.info}`;
      }).join('\n');

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

🃏 Ne Yapacaksın?
Kullanıcı "${fortuneType}" yorumunu istiyor.

ÖNEMLİ: Yorumunu iki bölümde yapacaksın:

1️⃣ ÖNCE: Her kartı sırasıyla aç ve açıkla
2️⃣ SONRA: Genel yorumunu yap

Seçilen Kartlar:
${cardDescriptions}

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

✨ Yanıt Formatı (Zorunlu)
Cevabını sadece aşağıdaki JSON yapısıyla ver.
Hiçbir ekstra açıklama, metin veya yorum yazma.

{
  "cardReveals": [
    {
      "position": 1,
      "meaning": "Geçmişten gelen etkiler",
      "cardName": "Kart adı",
      "interpretation": "Bu kartın anlamı burada (50-80 kelime)"
    },
    {
      "position": 2,
      "meaning": "Şu anki durum", 
      "cardName": "Kart adı",
      "interpretation": "Bu kartın anlamı burada (50-80 kelime)"
    }
    // ... 7 karta kadar devam et
  ],
  "interpretation": "Genel yorum burada - kartları birleştirerek hikayeyi anlat (200-300 kelime)",
  "advice": "Tavsiyeler burada (50-150 kelime)",
  "timeframe": "Zaman dilimi",
  "warnings": ["Uyarı 1", "Uyarı 2"],
  "positiveAspects": ["Olumlu yön 1", "Olumlu yön 2"]
}

🔐 Kritik Kurallar:
Kullanıcı bilgileri doğrudan söylenmeyecek ❌

Önce her kartı sırasıyla aç ve açıkla ✅

Sonra kartları birleştirerek genel hikayeyi anlat ✅

Dili, falcı karakterine uygun şekilde seç ✅

Yanıt sadece JSON formatında olacak ✅`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            required: ["cardReveals", "interpretation", "advice", "timeframe"],
            properties: {
              cardReveals: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ["position", "meaning", "cardName", "interpretation"],
                  properties: {
                    position: { type: 'number' },
                    meaning: { type: 'string' },
                    cardName: { type: 'string' },
                    interpretation: { type: 'string' }
                  }
                }
              },
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
      console.log('TarotFortune AI Response:', responseText);

      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          console.log('TarotFortune AI Parsed:', parsed);
          return parsed;
        } catch (parseError) {
          console.error('TarotFortune JSON parse error:', parseError);
          return null;
        }
      }

      return null;
    } catch (error) {
      console.error('AI generation error:', error);
      return null;
    }
  };

  const renderSelectedCard = (card: SelectedTarotCard, index: number) => (
    <Animated.View
      key={`selected-${card.id}-${card.position}`}
      style={[styles.selectedCardContainer, { borderColor: colors.primary }]}
      entering={SlideInUp.delay(index * 100).springify()}
    >
      <TouchableOpacity
        style={styles.removeCardButton}
        onPress={() => removeCard(card.position)}
      >
        <Icon name="close-circle" size={20} color={colors.errorText} />
      </TouchableOpacity>
      
      {/* Card Back Design */}
      <View style={[styles.cardBack, { backgroundColor: colors.primary }]}>
        <View style={[styles.cardBackPattern, { backgroundColor: colors.background }]}>
          <Text style={[styles.cardBackText, { color: colors.primary }]}>🌟</Text>
          <Text style={[styles.cardBackSubtext, { color: colors.primary }]}>TAROT</Text>
        </View>
      </View>
      
      <View style={styles.selectedCardInfo}>
        <Text style={[styles.cardPosition, { color: colors.primary }]}>
          {card.position}. Kart
        </Text>
        <Text style={[styles.cardMeaning, { color: colors.text }]}>
          {card.meaning}
        </Text>
      </View>
    </Animated.View>
  );

  // Memoized available card component to minimise rerenders
  const AvailableCard = React.memo(({ card, isSelected }: { card: TarotCard; isSelected: boolean }) => (
    <TouchableOpacity
      style={[
        styles.availableCard,
        {
          borderColor: colors.border,
          opacity: isSelected ? 0.3 : 1,
        },
      ]}
      onPress={() => !isSelected && handleCardSelection(card)}
      disabled={isSelected || selectedCards.length >= 7}
    >
      <View style={[styles.availableCardBack, { backgroundColor: colors.primary }]}>
        <View style={[styles.availableCardBackPattern, { backgroundColor: colors.background }]}>
          <Text style={[styles.availableCardBackText, { color: colors.primary }]}>✨</Text>
        </View>
      </View>
    </TouchableOpacity>
  ), (prev, next) => prev.isSelected === next.isSelected);

  const renderAvailableCard = ({ item, index }: { item: TarotCard; index: number }) => {
    const isSelected = selectedCards.some(selected => selected.id === item.id);
    return (
      <AvailableCard card={item} isSelected={isSelected} />
    );
  };

  if (tarotsLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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
              🃏 Tarot Falı
            </Text>
            <Text style={[styles.responseTime, { color: colors.background }]}>
              ⏱️ {seer.responsetime} dakika içinde yanıt
            </Text>
          </View>
        </Animated.View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Tarot kartları yükleniyor...
          </Text>
        </View>
      </View>
    );
  }

  if (tarotsError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.errorText }]}>
            {tarotsError}
          </Text>
        </View>
      </View>
    );
  }

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
              🃏 Tarot Falı
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
            📋 Tarot Falı Talimatları
          </Text>
          <Text style={[styles.instructionText, { color: colors.text }]}>
            Aşağıdaki kartlardan 7 adet seçin. Her kart farklı bir anlam taşımaktadır:
          </Text>
          <View style={styles.instructionList}>
            {cardMeanings.map((meaning, index) => (
              <Text key={index} style={[styles.instructionItem, { color: colors.secondaryText }]}>
                • {index + 1}. {meaning}
              </Text>
            ))}
          </View>
        </Animated.View>

        {/* Available Cards Section */}
        <Animated.View 
          style={styles.cardsSection}
          entering={FadeIn.delay(500).springify()}
        >
          <Text style={[styles.cardsTitle, { color: colors.primary }]}>
            🔮 Kartları Seçin
          </Text>
          <Text style={[styles.cardsSubtitle, { color: colors.secondaryText }]}>
            Sezgilerinizi takip edin ve size seslenen kartları seçin
          </Text>
          
          <FlatList
            data={shuffledCards}
            keyExtractor={(item) => item.id}
            renderItem={renderAvailableCard}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsList}
            initialNumToRender={20}
            maxToRenderPerBatch={20}
          />
        </Animated.View>

        {/* Selected Cards Section (now below cards list) */}
        {selectedCards.length > 0 && (
          <Animated.View
            style={styles.selectedSection}
            entering={SlideInDown.duration(500).springify()}
          >
            <View style={styles.selectedHeader}>
              <Text style={[styles.selectedTitle, { color: colors.primary }]}>🃏 Seçilen Kartlar ({selectedCards.length}/7)</Text>
              <TouchableOpacity
                style={[styles.resetButton, { borderColor: colors.secondary }]}
                onPress={resetSelection}
              >
                <Icon name="refresh-outline" size={16} color={colors.secondary} />
                <Text style={[styles.resetText, { color: colors.secondary }]}>Yeniden Karıştır</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.selectedCardsScroll}
            >
              {selectedCards.map((card, index) => renderSelectedCard(card, index))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Submit Button */}
        {selectedCards.length === 7 && (
          <Animated.View
            style={styles.submitSection}
            entering={SlideInDown.duration(500).springify()}
          >
            <CustomButton
              title={isSubmitting ? 'Gönderiliyor...' : '🔮 Tarot Falını Gönder'}
              onPress={submitFortune}
              disabled={isSubmitting}
              variant="primary"
              contentStyle={styles.submitButton}
            />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
};

export default TarotFortune; 