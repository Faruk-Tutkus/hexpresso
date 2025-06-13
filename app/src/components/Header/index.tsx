import { db } from '@api/config.firebase';
import Icon from '@assets/icons';
import { useTheme } from '@providers';
import { Image } from 'expo-image';
import { UserCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import getTimeBasedGreeting from 'src/hooks/GetTime';
import styles from './styles';

interface HeaderProps {
  user: UserCredential
}

const Header = ({ user }: HeaderProps) => {
  const { colors } = useTheme();
  const [horoscopeInfo, setHoroscopeInfo] = useState<string>('')
  useEffect(() => {
    const fetchHoroscopeInfo = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.user?.uid as string))
      const horoscopeInfo = userDoc.data()?.sunSign
      setHoroscopeInfo(horoscopeInfo)
    }
    fetchHoroscopeInfo()
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
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.leftContainer}>
        <View style={styles.menuContainer}>
          <Icon name="menu" size={32} color={colors.text} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{ getTimeBasedGreeting() } {horoscopeInfo}</Text>
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
      <View style={styles.rightContainer}>
        <Text style={[styles.iconText, { color: colors.text }]}>100</Text>
        <Image
          source={require('@assets/image/coin_one.png')}
          contentFit="contain"
          style={styles.logo}
        />
      </View>
    </View>
  )
}

export default Header