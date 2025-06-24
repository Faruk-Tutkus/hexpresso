import { db } from '@api/config.firebase';
import Icon from '@assets/icons';
import { GetTimeBasedGreeting } from '@hooks';
import { useTheme } from '@providers';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import Reanimated, { FadeIn } from 'react-native-reanimated';
import { breathingAnimation, shakeAnimation, styles } from './styles';


interface HeaderProps {
  user: User
  onPress: () => void
}

const Header = ({ user, onPress }: HeaderProps) => {
  const { colors } = useTheme();
  const [horoscopeInfo, setHoroscopeInfo] = useState<string>('')
  const [updatedAt, setUpdatedAt] = useState<any>(null)
  const [coins, setCoins] = useState<number>(0)
  const { t } = useTranslation()
  useEffect(() => {
    if (!user?.uid) return;

    // Real-time listener for user document changes
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setHoroscopeInfo(data?.sunSign || '');
        setUpdatedAt(data?.updatedAt || null);
        setCoins(data?.coins || 0);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user])

  const shakeAnimationValue = useRef(new Animated.Value(0)).current;
  const breathingAnimationValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let breathingAnim: Animated.CompositeAnimation | null = null;

    if (coins < 25) {
      shakeAnimation(shakeAnimationValue).start();
      breathingAnim = breathingAnimation(breathingAnimationValue);
      breathingAnim.start();
    } else {
      breathingAnimationValue.setValue(0);
    }

    return () => {
      breathingAnim?.stop();
    };
  }, [coins]);

  const containerStyle = {
    transform: [{ translateX: shakeAnimationValue }],
  };

  const textColor = breathingAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.errorBorder, colors.errorBorder + '80'],
  });

  // Mesaj listesi
  const messages = [
    'Selam sana',
    'Hoş geldin',
    'Güzel bir gün',
    'Başarılar dilerim',
    'İyi çalışmalar'
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // İlk animasyonu başlat
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();

    // 5 saniyede bir mesaj değiştir
    intervalRef.current = setInterval(() => {
      // Mevcut mesajı yukarı kaydır ve fade out yap
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Mesaj indeksini güncelle
        setCurrentMessageIndex((prevIndex) =>
          (prevIndex + 1) % messages.length
        );

        // Yeni mesajı aşağıdan başlat ve görünmez yap
        slideAnim.setValue(20);
        fadeAnim.setValue(0);

        // Yeni mesajı orta konuma getir ve fade in yap
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          })
        ]).start();
      });
    }, 5000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [slideAnim, fadeAnim, messages.length]);

  return (
    <Reanimated.View entering={FadeIn.duration(1000)} style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.menuContainer}>
            <Icon name="menu" size={32} color={colors.text} />
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          {horoscopeInfo ? <Reanimated.Text entering={FadeIn.duration(1000)} style={[styles.title, { color: colors.text }]}>{GetTimeBasedGreeting() + ' ' + t('horoscope.' + horoscopeInfo)}</Reanimated.Text> : <Text style={[styles.title, { color: colors.text }]}></Text>}
          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
              overflow: 'hidden',
            }}
          >
            <Text style={[styles.message, { color: colors.text }]}>
              {messages[currentMessageIndex]}
            </Text>
          </Animated.View>
        </View>
      </View>
      <TouchableOpacity onPress={() => router.push('/src/screens/main/navigator/Coins')}>
        <Animated.View style={[styles.rightContainer, containerStyle]}>
          <Animated.Text style={[styles.iconText, { color: coins < 25 ? textColor : colors.text }]}>{coins}</Animated.Text>
          <Image
            source={
              coins >= 0 && coins < 100
                ? require('@assets/image/coin_one.png')
                : coins >= 100 && coins < 200
                  ? require('@assets/image/coin_two.png')
                  : require('@assets/image/coin_three.png')
            }
            contentFit="contain"
            style={styles.logo}
          />
        </Animated.View>
      </TouchableOpacity>
    </Reanimated.View>
  )
}

export default Header