import { Banner } from '@ads';
import { db } from '@api/config.firebase';
import Icon from '@assets/icons';
import { useAuth, useTheme } from '@providers';
import { Image } from 'expo-image';
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  LayoutAnimationConfig,
  SlideInDown,
  SlideInRight
} from 'react-native-reanimated';
import styles from './styles';

interface FortuneRecord {
  id: string;
  seerData: any;
  fortuneType: string;
  images?: any;
  dreamText?: string;
  createdAt: any;
  status: 'pending' | 'completed' | 'processing';
  responseTime: number;
  estimatedCompletionTime: any;
  coins: number;
  result?: any;
  completedAt?: any;
}

const MyFortunes = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [fortunes, setFortunes] = useState<FortuneRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);


  // Real-time timer check for immediate status updates
  useEffect(() => {
    if (!user?.uid || fortunes.length === 0) return;

    const interval = setInterval(async () => {
      // Double check user still exists before making Firebase calls
      if (!user?.uid) {
        return;
      }

      const now = new Date();
      let updatedFortunes = [...fortunes];
      let hasUpdates = false;

      for (let i = 0; i < updatedFortunes.length; i++) {
        const fortune = updatedFortunes[i];
        if (fortune.status === 'pending' && fortune.result) {
          const completionTime = fortune.estimatedCompletionTime.toDate?.()
            ? fortune.estimatedCompletionTime.toDate()
            : new Date(fortune.estimatedCompletionTime);

          if (completionTime <= now) {
            try {
              // Update locally immediately for instant UI response
              updatedFortunes[i] = {
                ...fortune,
                status: 'completed' as const,
                completedAt: new Date()
              };
              hasUpdates = true;

              // Update in Firestore in background - with additional user check
              if (user?.uid) {
                updateDoc(doc(db, 'users', user.uid), {
                  fortunerecord: arrayRemove(fortune)
                }).then(() => {
                  if (user?.uid) {
                    return updateDoc(doc(db, 'users', user.uid), {
                      fortunerecord: arrayUnion(updatedFortunes[i])
                    });
                  }
                }).catch((error) => {
                  console.error('Error updating fortune status:', error);
                });
              }

              console.log(`🎉 Fortune ${fortune.id} status updated to completed!`);
            } catch (error) {
              console.error('Error updating fortune status:', error);
            }
          }
        }
      }

      // Update local state immediately if there are changes
      if (hasUpdates) {
        setFortunes(updatedFortunes);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [user?.uid, fortunes]);

  useEffect(() => {
    if (!user?.uid) {
      setFortunes([]);
      setLoading(false);
      return;
    }

    // Listen to user document changes for fortunerecord array
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        const fortuneRecords = userData.fortunerecord || [];

        // Remove duplicates based on ID and ensure unique keys
        const uniqueFortunes = fortuneRecords.filter((fortune: FortuneRecord, index: number, self: FortuneRecord[]) =>
          index === self.findIndex((f: FortuneRecord) => f.id === fortune.id)
        );

        // Sort by creation date (newest first)
        const sortedFortunes = uniqueFortunes.sort((a: FortuneRecord, b: FortuneRecord) => {
          const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
          const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
          return bTime - aTime;
        });

        setFortunes(sortedFortunes);
        setLoading(false);
      }
    }, (error) => {
      console.error('Fortune listener error:', error);
      setFortunes([]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Firestore realtime listener will automatically update
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const toggleCardExpansion = useCallback((fortuneId: string) => {
    setExpandedCardId(expandedCardId === fortuneId ? null : fortuneId);
  }, [expandedCardId]);

  // Memoized Scrollable Header Component
  const ScrollableHeader = useCallback(() => (
    <>
      <Animated.View
        style={[styles.headerContainer, { backgroundColor: colors.secondaryText }]}
        entering={FadeInDown.duration(800).springify()}
      >
        <Text style={[styles.title, { color: colors.background }]}>
          Fallarım
        </Text>
        <Text style={[styles.subtitle, { color: colors.background }]}>
          Fal geçmişinizi ve sonuçlarınızı takip edin
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.primary }]} />
      </Animated.View>
      <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Banner adType='banner' />
      </View>
    </>
  ), [colors]);

  const renderFortuneCard = useCallback(({ item, index }: { item: FortuneRecord; index: number }) => (
    <LayoutAnimationConfig skipEntering>
      <Animated.View
        style={[styles.fortuneCard, { backgroundColor: colors.background, borderColor: colors.border }]}
        entering={SlideInRight.delay(index * 100).springify()}
      >
        <FortuneCardContent
          fortune={item}
          colors={colors}
          isExpanded={expandedCardId === item.id}
          onToggle={() => toggleCardExpansion(item.id)}
        />
      </Animated.View>
    </LayoutAnimationConfig>
  ), [colors, expandedCardId, toggleCardExpansion]);

  const renderEmptyState = useCallback(() => (
    <Animated.View
      style={styles.emptyContainer}
      entering={FadeIn.delay(300)}
    >
      <View style={styles.emptyAnimation}>
        <Text style={[styles.emptyIcon, { color: colors.primary }]}>🔮</Text>
      </View>
      <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
        Henüz hiç falınız bulunmuyor
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.secondaryText }]}>
        Falcılarımızdan birine fal baktırın ve sonuçlarınızı burada takip edin
      </Text>
    </Animated.View>
  ), [colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={fortunes}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={renderFortuneCard}
        ListHeaderComponent={ScrollableHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.surface]}
            progressBackgroundColor={colors.text}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

// Fortune Card Content Component with Countdown Timer and Expandable Result
const FortuneCardContent = ({
  fortune,
  colors,
  isExpanded,
  onToggle
}: {
  fortune: FortuneRecord;
  colors: any;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    if (fortune.status !== 'pending') return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const completionTime = fortune.estimatedCompletionTime.toDate?.()
        ? fortune.estimatedCompletionTime.toDate().getTime()
        : new Date(fortune.estimatedCompletionTime).getTime();

      const distance = completionTime - now;

      if (distance > 0) {
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeRemaining('Hazır!');
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fortune.estimatedCompletionTime, fortune.status]);

  const getStatusIcon = () => {
    switch (fortune.status) {
      case 'pending':
        return <Icon name="time-outline" size={18} color={colors.primary} />;
      case 'processing':
        return <Icon name="refresh-outline" size={18} color={colors.errorText} />;
      case 'completed':
        return <Icon name="checkmark-circle-outline" size={18} color={colors.secondary} />;
      default:
        return <Icon name="help-circle-outline" size={18} color={colors.errorText} />;
    }
  };

  const getStatusText = () => {
    switch (fortune.status) {
      case 'pending':
        return timeRemaining === 'Hazır!'
          ? 'Falınız hazır!'
          : `Mistik güçler çalışıyor... ${timeRemaining}`;
      case 'processing':
        return 'Kaderin yorumlanıyor...';
      case 'completed':
        return 'Falınız yorumlandı!';
      default:
        return 'Bilinmeyen durum';
    }
  };

  const getFortuneTypeIcon = () => {
    switch (fortune.fortuneType) {
      case 'Kahve Falı':
        return '☕';
      case 'El Falı':
        return '✋';
      case 'Rüya Yorumu':
        return '🌙';
      case 'Tarot':
        return '🃏';
      default:
        return '🔮';
    }
  };

  const parseFortuneResult = (result: any) => {
    //console.log('Raw result:', result);
    //console.log('Result type:', typeof result);

    // Eğer result zaten bir object ise, direkt döndür
    if (typeof result === 'object' && result !== null) {
      return {
        interpretation: result.interpretation || result.yorum || 'Yorum bulunamadı',
        advice: result.advice || result.tavsiye || '',
        timeframe: result.timeframe || result.zaman || '',
        warnings: Array.isArray(result.warnings) ? result.warnings : (result.uyarilar || []),
        positiveAspects: Array.isArray(result.positiveAspects) ? result.positiveAspects : (result.olumluYonler || [])
      };
    }

    // Legacy: String formatındaki eski veriler için basit JSON parse
    if (typeof result === 'string') {
      try {
        const parsed = JSON.parse(result);
        return {
          interpretation: parsed.interpretation || parsed.yorum || result,
          advice: parsed.advice || parsed.tavsiye || '',
          timeframe: parsed.timeframe || parsed.zaman || '',
          warnings: Array.isArray(parsed.warnings) ? parsed.warnings : (parsed.uyarilar || []),
          positiveAspects: Array.isArray(parsed.positiveAspects) ? parsed.positiveAspects : (parsed.olumluYonler || [])
        };
      } catch (error) {
        console.error('JSON parse error:', error);
        return {
          interpretation: result,
          advice: '',
          timeframe: '',
          warnings: [],
          positiveAspects: []
        };
      }
    }

    // Fallback
    return {
      interpretation: 'Sonuç yüklenemedi',
      advice: '',
      timeframe: '',
      warnings: [],
      positiveAspects: []
    };
  };



  const getCoinIcon = (coin: number): string => {
    if (coin >= 500) return 'diamond-outline';
    if (coin >= 200) return 'trophy-outline';
    if (coin >= 150) return 'medal-outline';
    if (coin >= 100) return 'cash-outline';
    return 'logo-bitcoin';
  };

  const renderInputSection = () => {
    return (
      <Animated.View
        style={[styles.inputContainer, { borderColor: colors.border }]}
        entering={SlideInDown.duration(400).springify()}
      >
        <View style={styles.inputHeader}>
          <Icon name="file-tray-full-outline" size={20} color={colors.secondary} />
          <Text style={[styles.inputTitle, { color: colors.text }]}>
            Gönderilen İçerik
          </Text>
        </View>

        <View style={[styles.inputDivider, { backgroundColor: colors.secondary }]} />

        {/* Render different content based on fortune type */}
        {fortune.fortuneType === 'Kahve Falı' && renderCoffeeImages()}
        {fortune.fortuneType === 'El Falı' && renderHandImages()}
        {fortune.fortuneType === 'Rüya Yorumu' && renderDreamText()}
      </Animated.View>
    );
  };

  const renderCoffeeImages = () => {
    const images = Array.isArray(fortune.images) ? fortune.images : [];
    const imageLabels = ['1. Fincan İçi', '2. Fincan Dışı', '3. Tabak Üstü', '4. Genel Görünüm'];

    return (
      <Animated.View
        style={styles.coffeeInputSection}
        entering={FadeInUp.delay(100).springify()}
      >
        <View style={styles.inputSectionHeader}>
          <Icon name="cafe-outline" size={16} color={colors.primary} />
          <Text style={[styles.inputSectionLabel, { color: colors.primary }]}>Kahve Fincanı Fotoğrafları</Text>
        </View>

        <View style={styles.coffeeImagesGrid}>
          {images.slice(0, 4).map((imageUrl: string, index: number) => (
            <Animated.View
              key={index}
              style={[styles.coffeeImageItem, { borderColor: colors.border }]}
              entering={FadeInUp.delay((index + 1) * 100).springify()}
            >
              <Image
                source={{ uri: imageUrl }}
                style={styles.coffeeImage}
                contentFit="cover"
              />
              <Text style={[styles.coffeeImageLabel, { color: colors.secondaryText }]}>
                {imageLabels[index] || `${index + 1}. Fotoğraf`}
              </Text>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderHandImages = () => {
    const images = fortune.images;

    return (
      <Animated.View
        style={styles.handInputSection}
        entering={FadeInUp.delay(100).springify()}
      >
        <View style={styles.inputSectionHeader}>
          <Icon name="hand-left-outline" size={16} color={colors.primary} />
          <Text style={[styles.inputSectionLabel, { color: colors.primary }]}>El Fotoğrafları</Text>
        </View>
        <View style={styles.handImagesRow}>
          {images?.leftHand && (
            <Animated.View
              style={[styles.handImageItem, { borderColor: colors.border }]}
              entering={FadeInUp.delay(100).springify()}
            >
              <Image
                source={{ uri: images.leftHand }}
                style={styles.handImage}
                contentFit="cover"
              />
              <Text style={[styles.handImageLabel, { color: colors.secondaryText }]}>
                👈 Sol El
              </Text>
            </Animated.View>
          )}

          {images?.rightHand && (
            <Animated.View
              style={[styles.handImageItem, { borderColor: colors.border }]}
              entering={FadeInUp.delay(200).springify()}
            >
              <Image
                source={{ uri: images.rightHand }}
                style={styles.handImage}
                contentFit="cover"
              />
              <Text style={[styles.handImageLabel, { color: colors.secondaryText }]}>
                👉 Sağ El
              </Text>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderDreamText = () => {
    return (
      <Animated.View
        style={styles.dreamInputSection}
        entering={FadeInUp.delay(100).springify()}
      >
        <View style={styles.inputSectionHeader}>
          <Icon name="moon-outline" size={16} color={colors.primary} />
          <Text style={[styles.inputSectionLabel, { color: colors.primary }]}>Anlatılan Rüya</Text>
        </View>

        <View style={[styles.dreamTextContainer, {
          backgroundColor: colors.surface,
          borderColor: colors.border
        }]}>
          <Text style={[styles.dreamText, { color: colors.text }]}>
            {fortune.dreamText}
          </Text>
        </View>

        <View style={styles.dreamStats}>
          <Text style={[styles.dreamStatsText, { color: colors.secondaryText }]}>
            📝 {fortune.dreamText?.length || 0} karakter
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderResultSection = () => {
    if (!fortune.result) return null;
    //console.log(fortune.result);
    const parsedResult = parseFortuneResult(fortune.result);

    //console.log('Parsed for display:', parsedResult);

    return (
      <Animated.View
        style={[styles.resultContainer, { borderColor: colors.border }]}
        entering={SlideInDown.duration(500).springify()}
        exiting={FadeOut.duration(300)}
      >
        <View style={styles.resultHeader}>
          <Icon name="sparkles-outline" size={20} color={colors.primary} />
          <Text style={[styles.resultTitle, { color: colors.text }]}>
            {fortune.seerData.name}
          </Text>
        </View>

        <View style={[styles.resultDivider, { backgroundColor: colors.primary }]} />

        {/* Main Interpretation */}
        <Animated.View
          style={styles.interpretationSection}
          entering={FadeInUp.delay(200).springify()}
        >
          <View style={styles.sectionIcon}>
            <Icon name="eye-outline" size={16} color={colors.primary} />
          </View>
          <Text style={[styles.interpretationText, { color: colors.text }]}>
            {parsedResult.interpretation}
          </Text>
        </Animated.View>

        {/* Advice Section */}
        {parsedResult.advice && (
          <Animated.View
            style={styles.adviceSection}
            entering={FadeInUp.delay(300).springify()}
          >
            <View style={styles.sectionHeader}>
              <Icon name="bulb-outline" size={16} color={colors.secondary} />
              <Text style={[styles.sectionLabel, { color: colors.secondary }]}>Tavsiyeler</Text>
            </View>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              {parsedResult.advice}
            </Text>
          </Animated.View>
        )}

        {/* Timeframe Section */}
        {parsedResult.timeframe && (
          <Animated.View
            style={styles.timeframeSection}
            entering={FadeInUp.delay(400).springify()}
          >
            <View style={styles.sectionHeader}>
              <Icon name="time-outline" size={16} color={colors.secondary} />
              <Text style={[styles.sectionLabel, { color: colors.secondary }]}>Zaman Çerçevesi</Text>
            </View>
            <Text style={[styles.sectionText, { color: colors.text }]}>
              {parsedResult.timeframe}
            </Text>
          </Animated.View>
        )}

        {/* Warnings Section */}
        {parsedResult.warnings && parsedResult.warnings.length > 0 && (
          <Animated.View
            style={[styles.warningSection, { backgroundColor: 'rgba(255, 193, 7, 0.1)', borderColor: '#FFC107' }]}
            entering={FadeInUp.delay(500).springify()}
          >
            <View style={styles.sectionHeader}>
              <Icon name="warning-outline" size={16} color="#FFC107" />
              <Text style={[styles.sectionLabel, { color: '#FFC107' }]}>Dikkat Edilmesi Gerekenler</Text>
            </View>
            {parsedResult.warnings.map((warning: string, index: number) => (
              <Text key={index} style={[styles.sectionText, { color: colors.text, marginBottom: 8 }]}>
                • {warning}
              </Text>
            ))}
          </Animated.View>
        )}

        {/* Positive Aspects Section */}
        {parsedResult.positiveAspects && parsedResult.positiveAspects.length > 0 && (
          <Animated.View
            style={[styles.positiveSection, { backgroundColor: 'rgba(76, 175, 80, 0.1)', borderColor: '#4CAF50' }]}
            entering={FadeInUp.delay(600).springify()}
          >
            <View style={styles.sectionHeader}>
              <Icon name="checkmark-circle-outline" size={16} color="#4CAF50" />
              <Text style={[styles.sectionLabel, { color: '#4CAF50' }]}>Olumlu Yönler</Text>
            </View>
            {parsedResult.positiveAspects.map((aspect: string, index: number) => (
              <Text key={index} style={[styles.sectionText, { color: colors.text, marginBottom: 8 }]}>
                • {aspect}
              </Text>
            ))}
          </Animated.View>
        )}

        <Animated.View
          style={styles.fortuneSignature}
          entering={FadeInUp.delay(700).springify()}
        >
          <Text style={[styles.signatureText, { color: colors.secondaryText }]}>
            💫 {fortune.seerData.name} tarafından yorumlandı
          </Text>
        </Animated.View>
      </Animated.View>
    );
  };
  return (
    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: fortune.seerData.url }}
          style={[styles.seerAvatar, { borderColor: colors.primary }]}
          contentFit="cover"
        />
        <View style={styles.cardHeaderText}>
          <Text style={[styles.seerName, { color: colors.text }]}>
            {fortune.seerData.name}
          </Text>
          <Text style={[styles.fortuneType, { color: colors.secondaryText }]}>
            {getFortuneTypeIcon()} {fortune.fortuneType}
          </Text>
          <Text style={[styles.createdDate, { color: colors.secondaryText }]}>
            {fortune.createdAt.toDate?.()
              ? `${fortune.createdAt.toDate().toLocaleDateString('tr-TR')} - ${fortune.createdAt.toDate().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`
              : `${new Date(fortune.createdAt).toLocaleDateString('tr-TR')} - ${new Date(fortune.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}`}
          </Text>
        </View>
        <View style={styles.coinBadge}>
          <Icon name={getCoinIcon(fortune.coins)} size={16} color={colors.secondary} />
          <Text style={[styles.coinText, { color: colors.secondary }]}>
            {fortune.coins}
          </Text>
        </View>
      </View>

      {/* Enhanced Status Badge */}
      <Animated.View
        style={[
          styles.statusBadge,
          {
            backgroundColor: fortune.status === 'completed'
              ? `${colors.secondary}20`
              : fortune.status === 'pending'
                ? `${colors.primary}15`
                : `${colors.errorText}15`,
            borderColor: fortune.status === 'completed'
              ? colors.secondary
              : fortune.status === 'pending'
                ? colors.primary
                : colors.errorText
          }
        ]}
        entering={FadeIn.delay(200).springify()}
      >
        <View style={styles.statusContent}>
          <View style={styles.statusIcon}>
            {getStatusIcon()}
          </View>
          <Text style={[styles.statusMessage, {
            color: fortune.status === 'completed'
              ? colors.secondary
              : fortune.status === 'pending'
                ? colors.primary
                : colors.errorText
          }]}>
            {getStatusText()}
          </Text>
        </View>
        {fortune.status === 'pending' && timeRemaining && (
          <View style={[styles.countdownBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.countdownText, { color: colors.background }]}>
              {timeRemaining}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Enhanced Result Button */}
      {fortune.status === 'completed' && fortune.result && (
        <Animated.View
          entering={FadeIn.delay(400).springify()}
        >
          <TouchableOpacity
            style={[
              styles.enhancedResultButton,
              {
                backgroundColor: isExpanded ? colors.secondaryText : colors.primary,
                shadowColor: colors.primary,
              }
            ]}
            onPress={onToggle}
            activeOpacity={0.8}
          >
            <View style={styles.resultButtonContent}>
              <View style={styles.resultButtonLeft}>
                <View style={[styles.resultIconContainer, {
                  backgroundColor: isExpanded ? colors.primary : colors.background
                }]}>
                  <Icon
                    name="book-outline"
                    size={18}
                    color={isExpanded ? colors.background : colors.primary}
                  />
                </View>
                <View style={styles.resultButtonTextContainer}>
                  <Text style={[styles.resultButtonTitle, { color: colors.background }]}>
                    {isExpanded ? 'Sonucu Gizle' : 'Sonucu Görüntüle'}
                  </Text>
                  <Text style={[styles.resultButtonSubtitle, {
                    color: colors.background,
                    opacity: 0.8
                  }]}>
                    {fortune.seerData.name}
                  </Text>
                </View>
              </View>
              <View style={[styles.chevronContainer, {
                backgroundColor: isExpanded ? colors.primary : colors.background
              }]}>
                <Icon
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={isExpanded ? colors.background : colors.primary}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}

      {isExpanded && renderInputSection()}
      {isExpanded && renderResultSection()}
    </View>
  );
};

export default MyFortunes;