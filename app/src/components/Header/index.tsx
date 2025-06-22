import { db } from '@api/config.firebase';
import Icon from '@assets/icons';
import { GetTimeBasedGreeting } from '@hooks';
import { useTheme } from '@providers';
import { Image } from 'expo-image';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import Reanimated, { FadeIn } from 'react-native-reanimated';
import styles from './styles';

interface HeaderProps {
  user: User
  onPress: () => void
}

const Header = ({ user, onPress }: HeaderProps) => {
  const { colors } = useTheme();
  const [horoscopeInfo, setHoroscopeInfo] = useState<string>('')
  const [updatedAt, setUpdatedAt] = useState<any>(null)
  const { t } = useTranslation()
  useEffect(() => {
    if (!user?.uid) return;
    
    // Real-time listener for user document changes
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setHoroscopeInfo(data?.sunSign || '');
        setUpdatedAt(data?.updatedAt || null);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user])
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
          {/* <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
              overflow: 'hidden',
            }}
          >
            <Text style={[styles.message, { color: colors.text }]}>
              {messages[currentMessageIndex]}
            </Text>
          </Animated.View> */}
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={[styles.iconText, { color: colors.text }]}>100</Text>
        <Image
          source={require('@assets/image/coin_one.png')}
          contentFit="contain"
          style={styles.logo}
        />
      </View>
    </Reanimated.View>
  )
}

export default Header