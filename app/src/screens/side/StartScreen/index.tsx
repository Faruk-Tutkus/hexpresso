import { CustomButton } from '@components';
import { useTheme } from '@providers';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  Text,
  View
} from 'react-native';
import styles from './styles';

const emojiList = [
  { symbol: '🔮' },
  { symbol: '🌙' },
  { symbol: '✨' },
  { symbol: '🌟' },
  { symbol: '🪐' },
  { symbol: '💫' },
  { symbol: '🌞' },
  { symbol: '🧿' },
  { symbol: '🔭' },
  { symbol: '🧘‍♀️' },
  { symbol: '🕯️' },
  { symbol: '🌑' },
];

const StartScreen = () => {
  const { colors, isDark } = useTheme();
  
  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const emojiOpacity = useRef(new Animated.Value(0)).current;

  // Rastgele emoji state
  const [currentEmoji, setCurrentEmoji] = useState('');

  // Rastgele emoji seçme fonksiyonu
  const getRandomEmoji = () => {
    const randomIndex = Math.floor(Math.random() * emojiList.length);
    return emojiList[randomIndex].symbol;
  };

  useEffect(() => {
    // İlk emoji'yi seç
    setCurrentEmoji(getRandomEmoji());

    // Başlangıç animasyonları
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.7)),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.7)),
      }),
      Animated.timing(emojiOpacity, {
        toValue: 1,
        duration: 800,
        delay: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Dönen animasyon ve emoji değiştirme
    const startEmojiRotation = () => {
      const rotationLoop = () => {
        // Emoji fade out
        Animated.timing(emojiOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Yeni emoji seç
          setCurrentEmoji(getRandomEmoji());
          
          // Emoji fade in ile birlikte döndürme başlat
          Animated.parallel([
            Animated.timing(emojiOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 8000,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
          ]).start(() => {
            // Döndürme tamamlandığında rotateAnim'i sıfırla ve tekrar başlat
            rotateAnim.setValue(0);
            rotationLoop();
          });
        });
      };

      // İlk döngüyü başlat
      const timer = setTimeout(rotationLoop, 800);
      return timer;
    };

    const timer = startEmojiRotation();
    return () => clearTimeout(timer);
  }, []);

  const gradientColors = isDark 
    ? ['#1A1A1A', '#2D1B69', '#1A1A1A'] as const
    : ['#F8F9FA', '#E3F2FD', '#F8F9FA'] as const;

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent 
      />
      <LinearGradient
        colors={gradientColors}
        locations={[0, 0.5, 1]}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Üst Boşluk */}
          <View style={styles.topSpacer} />
          
          {/* Ana İçerik */}
          <View style={styles.mainContent}>
            {/* Başlık Bölümü */}
            <Animated.View 
              style={[
                styles.headerSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Text style={[styles.mainTitle, { color: colors.text }]}>
                Hoş Geldin!
              </Text>
              <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
                Yıldızların sana ne söylediğini keşfet
              </Text>
            </Animated.View>

            {/* Hex Animasyon Bölümü */}
            <Animated.View 
              style={[
                styles.animationSection,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={styles.hexBackground}>
                <Animated.View 
                  style={[
                    styles.hexShape,
                    {
                      transform: [{ rotate: spin }]
                    }
                  ]}
                >
                  <View style={[styles.hexInner, { borderColor: colors.primary }]}>
                    <Animated.Text 
                      style={[
                        styles.hexSymbol, 
                        { 
                          color: colors.primary,
                          opacity: emojiOpacity
                        }
                      ]}
                    >
                      {currentEmoji}
                    </Animated.Text>
                  </View>
                </Animated.View>
              </View>
            </Animated.View>

            {/* Açıklama */}
            <Animated.View 
              style={[
                styles.descriptionSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Text style={[styles.description, { color: colors.secondaryText }]}>
                Kişiselleştirilmiş fal ve burç rehberin{'\n'}
                seni bekliyor
              </Text>
            </Animated.View>
          </View>

          {/* Buton Bölümü */}
          <Animated.View 
            style={[
              styles.buttonSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <CustomButton
              title='Yeni Hesap Oluştur'
              variant='primary'
              onPress={() => {router.push('/src/screens/auth/Register')}}
              contentStyle={styles.primaryButton}
            />
            <CustomButton
              title='Giriş Yap'
              variant='secondary'
              onPress={() => {router.push('/src/screens/auth/Login')}}
              contentStyle={styles.secondaryButton}
            />
            
            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { color: colors.secondaryText }]}>
                Devam ederek{' '}
                <Text 
                  style={[styles.termsLink, { color: colors.primary }]}
                  onPress={() => router.push('/src/screens/side/StartScreen/Terms' as any)}
                >
                  Kullanım Şartları
                </Text>
                {' '}ve{' '}
                <Text 
                  style={[styles.termsLink, { color: colors.primary }]}
                  onPress={() => router.push('/src/screens/side/StartScreen/Privacy' as any)}
                >
                  Gizlilik Politikası
                </Text>
                {'\'nı kabul etmiş olursunuz'}
              </Text>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </>
  )
}

export default StartScreen