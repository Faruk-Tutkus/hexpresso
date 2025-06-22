import { db } from '@api/config.firebase';
import {
  CustomButton,
  FloatingDatePicker,
  FloatingLabelInput,
  FloatingLabelPicker,
  FloatingTimePicker,
  MapView,
  Modal
} from '@components';
import { useAuth, useTheme, useToast } from '@providers';
import { useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { FullAstroResult, getFullAstro } from 'src/hooks/GetHoroscopeInfo';
import styles from './styles';

interface UserProfileData {
  name: string;
  date: Date | '';
  time: Date | '';
  gender: string;
  reason: string;
  love: string;
  need: string;
  mood: string;
  meaning: string;
  experience: string;
  curious: string;
  location: { latitude: number; longitude: number } | null;
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
  age: number;
  birthWeekday: string;
  daysToNextBirthday: number;
}

const Profile = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Modal states
  const [showGoBackModal, setShowGoBackModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    date: '',
    time: '',
    gender: '',
    reason: '',
    love: '',
    need: '',
    mood: '',
    meaning: '',
    experience: '',
    curious: '',
    location: null,
    sunSign: '',
    moonSign: '',
    ascendantSign: '',
    age: 0,
    birthWeekday: '',
    daysToNextBirthday: 0
  });

  const [errors, setErrors] = useState({
    name: '',
    date: '',
    gender: '',
    reason: '',
    love: '',
    need: '',
    mood: '',
    meaning: '',
    experience: '',
    curious: '',
  });

  // Kullanıcı verilerini yükle
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          const dateFromDB = data.date ? new Date(data.date) : null;
          const timeFromDB = data.time ? new Date(data.time) : null;
          
          // Time değeri gelecekte veya mantıksızsa ignore et
          const isValidTime = timeFromDB && 
            !isNaN(timeFromDB.getTime()) && 
            timeFromDB.getFullYear() <= new Date().getFullYear() &&
            timeFromDB.getFullYear() >= 1900;
          
          setProfileData({
            name: data.name || '',
            date: (dateFromDB && !isNaN(dateFromDB.getTime())) ? dateFromDB : '',
            time: isValidTime ? timeFromDB : '',
            gender: data.gender || '',
            reason: data.reason || '',
            love: data.love || '',
            need: data.need || '',
            mood: data.mood || '',
            meaning: data.meaning || '',
            experience: data.experience || '',
            curious: data.curious || '',
            location: data.location || null,
            sunSign: data.sunSign || '',
            moonSign: data.moonSign || '',
            ascendantSign: data.ascendantSign || '',
            age: data.age || 0,
            birthWeekday: data.birthWeekday || '',
            daysToNextBirthday: data.daysToNextBirthday || 0
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        showToast('Profil verileriniz yüklenirken bir hata oluştu.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  // Astroloji bilgilerini güncelle
  const updateAstrologyInfo = (date: Date | '', time: Date | '', location: { latitude: number; longitude: number }) => {
    if (!(date instanceof Date) || isNaN(date.getTime()) || !location) {
      console.warn('Invalid date or location for astrology calculation');
      return;
    }
    
    try {
      const dateString = date.toISOString();
      const timeString = time instanceof Date && !isNaN(time.getTime()) 
        ? time.toISOString() 
        : dateString;
      
      const astroResult: FullAstroResult = getFullAstro(
        dateString,
        timeString,
        { latitude: location.latitude, longitude: location.longitude }
      );

      // Astroloji sonuçlarını validate et
      const safeAstroResult = {
        sunSign: astroResult.sunSign || 'unknown',
        moonSign: astroResult.moonSign || 'unknown',
        ascendantSign: astroResult.ascendantSign || 'unknown',
        age: typeof astroResult.age === 'number' && !isNaN(astroResult.age) ? astroResult.age : 0,
        birthWeekday: astroResult.birthWeekday || '',
        daysToNextBirthday: typeof astroResult.daysToNextBirthday === 'number' && !isNaN(astroResult.daysToNextBirthday) ? astroResult.daysToNextBirthday : 0
      };

      setProfileData(prev => ({
        ...prev,
        sunSign: safeAstroResult.sunSign,
        moonSign: safeAstroResult.moonSign,
        ascendantSign: safeAstroResult.ascendantSign,
        age: safeAstroResult.age,
        birthWeekday: safeAstroResult.birthWeekday,
        daysToNextBirthday: safeAstroResult.daysToNextBirthday
      }));
    } catch (error) {
      console.error('Error calculating astrology info:', error);
      // Hata durumunda güvenli değerler set et
      setProfileData(prev => ({
        ...prev,
        sunSign: 'unknown',
        moonSign: 'unknown',
        ascendantSign: 'unknown',
        age: 0,
        birthWeekday: '',
        daysToNextBirthday: 0
      }));
    }
  };

  // Profil güncelleme
  const handleUpdateProfile = async () => {
    if (!user) return;

    // Validasyon
    const newErrors = {
      name: profileData.name ? '' : 'İsim gereklidir',
      date: (profileData.date instanceof Date && !isNaN(profileData.date.getTime())) ? '' : 'Doğum tarihi gereklidir',
      gender: profileData.gender ? '' : 'Cinsiyet seçimi gereklidir',
      reason: profileData.reason ? '' : 'Bu alan gereklidir',
      love: profileData.love ? '' : 'Bu alan gereklidir',
      need: profileData.need ? '' : 'Bu alan gereklidir',
      mood: profileData.mood ? '' : 'Bu alan gereklidir',
      meaning: profileData.meaning ? '' : 'Bu alan gereklidir',
      experience: profileData.experience ? '' : 'Bu alan gereklidir',
      curious: profileData.curious ? '' : 'Bu alan gereklidir',
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error !== '')) {
      showToast('Lütfen tüm gerekli alanları doldurun.', 'error');
      return;
    }

    try {
      setIsLoading(true);

      // Astroloji bilgilerini güncelle
      if (profileData.date instanceof Date && !isNaN(profileData.date.getTime()) && profileData.location) {
        updateAstrologyInfo(
          profileData.date, 
          profileData.time instanceof Date && !isNaN(profileData.time.getTime()) ? profileData.time : profileData.date, 
          profileData.location
        );
      }

      const updateData = {
        name: profileData.name,
        date: profileData.date instanceof Date && !isNaN(profileData.date.getTime()) ? profileData.date.toISOString() : null,
        time: profileData.time instanceof Date && !isNaN(profileData.time.getTime()) ? profileData.time.toISOString() : null,
        gender: profileData.gender,
        reason: profileData.reason,
        love: profileData.love,
        need: profileData.need,
        mood: profileData.mood,
        meaning: profileData.meaning,
        experience: profileData.experience,
        curious: profileData.curious,
        location: profileData.location,
        sunSign: profileData.sunSign,
        moonSign: profileData.moonSign,
        ascendantSign: profileData.ascendantSign,
        age: profileData.age,
        birthWeekday: profileData.birthWeekday,
        daysToNextBirthday: profileData.daysToNextBirthday,
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'users', user.uid), updateData);
      
      setIsEditing(false);
      showToast('Profiliniz başarıyla güncellendi! ✨', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Profil güncellenirken bir hata oluştu.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (isEditing) {
      setShowGoBackModal(true);
    } else {
      router.back();
    }
  };

  // Değer çevirme fonksiyonları
  const getDisplayValue = (fieldType: string, value: string | Date): string => {
    if (typeof value === 'string' && value) {
      // Tarih değilse value mapping'i uygula
      return getReadableValue(fieldType, value);
    }
    if (value instanceof Date && !isNaN(value.getTime())) {
      // Time field'ı için saat formatında göster
      if (fieldType === 'time') {
        return value.toLocaleTimeString('tr-TR', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        });
      }
      return value.toLocaleDateString('tr-TR');
    }
    return 'Belirtilmemiş';
  };

  const getReadableValue = (fieldType: string, value: string): string => {
    const mappings: Record<string, Record<string, string>> = {
      gender: {
        'masculine_energy': 'Eril enerji (Erkek)',
        'feminine_energy': 'Dişil enerji (Kadın)',
        'undefined_energy': 'Tanımlamak istemiyorum ✨'
      },
      reason: {
        'broken_heart_love': 'Aşk... Kalbim kırık 💔',
        'work_school_exhaustion': 'İş / okul... Yoruldum artık 💼',
        'family_tension': 'Ailemle aram gergin 🏠',
        'low_self_confidence': 'Kendime inancım zayıf 🪞',
        'financial_struggles': 'Para derdi bitmiyor 💸',
        'health_issues': 'Sağlık sorunlarımdan usandım 🏥',
        'future_anxiety': 'Gelecek... Korkuyorum 🌫️',
        'loneliness': 'Yalnızım... çok yalnız 🕯️',
        'distant_friendships': 'Arkadaşlarım uzaklaştı 🤝',
        'spiritual_search': 'Ruhsal bir arayıştayım 🌟',
        'career_confusion': 'Kariyer yolculuğumda kayboldum 🗺️',
        'lost_inner_peace': 'İç huzurumu kaybettim 🧘‍♀️',
        'general_life_exhaustion': 'Hayatın kendisi yorucu be abla... 🌀'
      },
      love: {
        'new_love_excitement': 'Aşık oldum, kalbim çarpıyor 🥰',
        'heartbreak_pain': 'Kalbim kırık, acı çekiyorum 💔',
        'hopeful_solitude': 'Yalnızım ama umutluyum 🕯️',
        'lost_faith_in_love': 'Aşka inancım kalmadı 🖤',
        'complex_emotions': 'Karmaşık duygular içindeyim 🎭',
        'on_the_brink_of_love': 'Yeni bir aşkın eşiğindeyim 🌹',
        'relationship_problems': 'İlişkimde sorunlar var ⚖️',
        'searching_for_love': 'Aşkı arıyorum ama bulamıyorum 🔍'
      },
      need: {
        'love_and_affection': 'Sevgi ve şefkat 💞',
        'inner_peace_and_tranquility': 'İç huzur ve sükunet 🕊️',
        'success_and_recognition': 'Başarı ve tanınma 🏆',
        'security_and_stability': 'Güven ve istikrar 🔐',
        'material_prosperity': 'Maddi refah ve bolluk 💰',
        'spiritual_growth': 'Ruhsal gelişim ve aydınlanma 🌟',
        'health_and_energy': 'Sağlık ve enerji 💪',
        'creativity_and_inspiration': 'Yaratıcılık ve ilham 🎨',
        'freedom_and_independence': 'Özgürlük ve bağımsızlık 🦅'
      },
      mood: {
        'happy_and_cheerful': 'Mutlu ve neşeli 😊',
        'sad_and_melancholic': 'Hüzünlü ve melankolik 😢',
        'confused_and_anxious': 'Kafam karışık ve endişeliyim 🤯',
        'calm_and_balanced': 'Sakin ve dengeli 😌',
        'excited_and_passionate': 'Heyecanlı ve tutkulu 🔥',
        'tired_and_exhausted': 'Yorgun ve bitkin 😫',
        'angry_and_tense': 'Öfkeli ve gergin 😠',
        'hopeless_and_pessimistic': 'Umutsuz ve karamsar 🌑',
        'introspective_and_thoughtful': 'İçe dönük ve düşünceli 🤔'
      },
      meaning: {
        'transformation_and_renewal': 'Kelebek - Dönüşüm ve yenilenme 🦋',
        'wisdom_and_healing': 'Yılan - Bilgelik ve şifa 🐍',
        'self_discovery': 'Ayna - Kendini keşfetme 🪞',
        'mystery_and_transformation': 'Karanlık - Gizem ve dönüşüm 🌑',
        'intuition_and_emotion': 'Ay - Sezgi ve duygusallık 🌙',
        'power_and_vitality': 'Güneş - Güç ve canlılık ☀️',
        'guidance_and_hope': 'Yıldız - Rehberlik ve umut ⭐',
        'emotions_and_flow': 'Su - Duygular ve akış 🌊',
        'passion_and_transformation': 'Ateş - Tutku ve dönüşüm 🔥',
        'stability_and_growth': 'Toprak - İstikrar ve büyüme 🌱'
      },
      experience: {
        'family_experience': 'Ailemle yaşadığım bir olay 👪',
        'falling_in_love': 'Aşık olduğum biri ❤️',
        'career_journey': 'Kariyer yolculuğum 💼',
        'significant_loss': 'Bir kayıp... 🕯️',
        'spiritual_experience': 'Ruhsal bir deneyim 🌟',
        'health_challenges': 'Sağlık sorunları 🏥',
        'educational_journey': 'Eğitim hayatım 📚',
        'travel_and_discovery': 'Yolculuk ve keşif 🌍',
        'creative_achievement': 'Yaratıcı bir başarı 🎨',
        'financial_change': 'Maddi bir değişim 💰'
      },
      curious: {
        'love_life_and_relationships': 'Aşk hayatım ve ilişkilerim ❤️',
        'career_and_work_life': 'Kariyerim ve iş hayatım 💼',
        'health_and_energy_status': 'Sağlık durumum ve enerjim 🏥',
        'family_developments': 'Ailemle ilgili gelişmeler 👪',
        'financial_matters': 'Parasal konular ve maddi durum 💸',
        'spiritual_development': 'Ruhsal gelişim ve aydınlanma 🌟',
        'creative_projects_and_talents': 'Yaratıcı projelerim ve yeteneklerim 🎨',
        'social_relationships': 'Sosyal ilişkilerim ve arkadaşlıklarım 🤝',
        'education_and_learning': 'Eğitim ve öğrenme sürecim 📚',
        'travels_and_new_experiences': 'Yolculuklar ve yeni deneyimler 🌍',
        'life_path_and_destiny': 'Hayatımın genel akışı ve kaderim 🌀'
      }
    };

    return mappings[fieldType]?.[value] || value;
  };

  const getZodiacSignName = (sign: string): string => {
    // Undefined veya null check
    if (!sign || typeof sign !== 'string') {
      return 'Bilinmiyor';
    }
    
    const zodiacNames: Record<string, string> = {
      'aries': 'Koç ♈',
      'taurus': 'Boğa ♉',
      'gemini': 'İkizler ♊',
      'cancer': 'Yengeç ♋',
      'leo': 'Aslan ♌',
      'virgo': 'Başak ♍',
      'libra': 'Terazi ♎',
      'scorpio': 'Akrep ♏',
      'sagittarius': 'Yay ♐',
      'capricorn': 'Oğlak ♑',
      'aquarius': 'Kova ♒',
      'pisces': 'Balık ♓',
      'invalid': 'Geçersiz',
      'unknown': 'Bilinmiyor'
    };
    
    return zodiacNames[sign] || (sign.charAt(0).toUpperCase() + sign.slice(1));
  };

  const renderProfileField = (
    label: string,
    value: string | Date,
    component?: React.ReactNode,
    isRequired: boolean = true,
    fieldType: string = ''
  ) => (
    <Animated.View entering={FadeIn.delay(200)} style={styles.fieldContainer}>
      <Text style={[styles.fieldLabel, { color: colors.text }]}>
        {label} {isRequired && <Text style={{ color: colors.errorText }}>*</Text>}
      </Text>
      {isEditing ? (
        component || (
          <Text style={[styles.fieldValue, { color: colors.secondaryText, borderColor: colors.border }]}>
            {getDisplayValue(fieldType, value)}
          </Text>
        )
      ) : (
        <Text style={[styles.fieldValue, { color: colors.secondaryText }]}>
          {getDisplayValue(fieldType, value)}
        </Text>
      )}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Başlık */}
          <Animated.View entering={FadeIn} style={[styles.headerSection]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {isEditing ? '📝 Profili Düzenle' : '👤 Profil Bilgilerin'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              {isEditing 
                ? 'Bilgilerini güncelleyerek yıldızlar seninle daha uyumlu olsun ✨' 
                : 'Yıldızların seninle nasıl dans ettiğini gör'
              }
            </Text>
          </Animated.View>
          {/* Aksiyonlar */}
          <Animated.View entering={FadeIn.delay(500)} style={styles.actionSection}>
            {!isEditing ? (
              <CustomButton
                title="Profili Düzenle"
                leftIcon='pencil'
                onPress={() => setIsEditing(true)}
                loading={false}
              />
            ) : (
              <View style={styles.actionButtons}>
                <CustomButton
                  title="İptal"
                  variant="secondary"
                  leftIcon='close'
                  onPress={() => setShowCancelModal(true)}
                  loading={false}
                />
                <CustomButton
                  title="Kaydet"
                  leftIcon='save'
                  onPress={handleUpdateProfile}
                  loading={isLoading}
                />
              </View>
            )}
          </Animated.View>
          {/* Kişisel Bilgiler */}
          <Animated.View entering={FadeIn.delay(100)} style={[styles.section, { borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>🌟 Kişisel Bilgiler</Text>
            
            {renderProfileField(
              '✨ İsmin',
              profileData.name,
              <FloatingLabelInput
                value={profileData.name}
                placeholder="Adını söyle, yıldızlar duysun"
                onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
                type="text"
                leftIcon="person"
                error={errors.name}
              />,
              true,
              'name'
            )}

            {renderProfileField(
              '🎂 Doğum Tarihin',
              profileData.date,
              <FloatingDatePicker
                value={profileData.date as Date}
                onChange={(date) => {
                  setProfileData(prev => ({ ...prev, date }));
                  if (date instanceof Date && !isNaN(date.getTime()) && profileData.location) {
                    updateAstrologyInfo(
                      date, 
                      profileData.time instanceof Date && !isNaN(profileData.time.getTime()) ? profileData.time : date, 
                      profileData.location
                    );
                  }
                }}
                placeholder="Doğum gününü söyle bana"
                leftIcon="calendar"
                error={errors.date}
              />,
              true,
              'date'
            )}

            {renderProfileField(
              '⏰ Doğum Saatin',
              profileData.time,
              <FloatingTimePicker
                value={profileData.time as Date}
                onChange={(time) => {
                  setProfileData(prev => ({ ...prev, time }));
                  if (profileData.date instanceof Date && !isNaN(profileData.date.getTime()) && profileData.location) {
                    updateAstrologyInfo(profileData.date, time, profileData.location);
                  }
                }}
                placeholder="Doğum saatini söyle tatlım"
                leftIcon="time"
              />,
              false,
              'time'
            )}

            {renderProfileField(
              '🌺 Enerji Türün',
              profileData.gender,
              <FloatingLabelPicker
                value={profileData.gender}
                placeholder="Kendini nasıl tanımlarsın?"
                onChangeText={(value) => setProfileData(prev => ({ ...prev, gender: value }))}
                leftIcon="star"
                data={[
                  { id: '1', label: 'Eril enerjideyim (Erkek)', value: 'masculine_energy' },
                  { id: '2', label: 'Dişil enerjideyim (Kadın)', value: 'feminine_energy' },
                  { id: '3', label: 'Tanımlamak istemiyorum ✨', value: 'undefined_energy' },
                ]}
                error={errors.gender}
              />,
              true,
              'gender'
            )}

            {renderProfileField(
              '📍 Doğum Yerin',
              profileData.location ? 
                `Lat: ${profileData.location.latitude.toFixed(4)}, Lon: ${profileData.location.longitude.toFixed(4)}` : 
                'Belirtilmemiş',
              isEditing ? (
                <MapView 
                  onLocationSelect={(latitude, longitude) => {
                    const location = { latitude, longitude };
                    setProfileData(prev => ({ ...prev, location }));
                    if (profileData.date instanceof Date && !isNaN(profileData.date.getTime())) {
                      updateAstrologyInfo(
                        profileData.date, 
                        profileData.time instanceof Date && !isNaN(profileData.time.getTime()) ? profileData.time : profileData.date, 
                        location
                      );
                    }
                  }}
                  initialLatitude={profileData.location?.latitude || 41.0082}
                  initialLongitude={profileData.location?.longitude || 28.9784}
                />
              ) : undefined,
              false,
              'location'
            )}
          </Animated.View>

          {/* Astroloji Bilgileri */}
          {profileData.sunSign && (
            <Animated.View entering={FadeIn.delay(200)} style={[styles.section, { borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>🔮 Astroloji Haritam</Text>
              
              <View style={styles.astroGrid}>
                <View style={[styles.astroCard, { backgroundColor: colors.surface + '20'}]}>
                  <Text style={[styles.astroLabel, { color: colors.secondaryText }]}>☀️ Güneş Burcum</Text>
                  <Text style={[styles.astroValue, { color: colors.text }]}>
                    {getZodiacSignName(profileData.sunSign)}
                  </Text>
                </View>
                <View style={[styles.astroCard, { backgroundColor: colors.surface + '20'}]}>
                  <Text style={[styles.astroLabel, { color: colors.secondaryText }]}>🌙 Ay Burcum</Text>
                  <Text style={[styles.astroValue, { color: colors.text }]}>
                    {getZodiacSignName(profileData.moonSign)}
                  </Text>
                </View>
                <View style={[styles.astroCard, { backgroundColor: colors.surface + '20'}]}>
                  <Text style={[styles.astroLabel, { color: colors.secondaryText }]}>⬆️ Yükselenim</Text>
                  <Text style={[styles.astroValue, { color: colors.text }]}>
                    {getZodiacSignName(profileData.ascendantSign)}
                  </Text>
                </View>
                <View style={[styles.astroCard, { backgroundColor: colors.surface + '20'}]}>
                  <Text style={[styles.astroLabel, { color: colors.secondaryText }]}>🎂 Yaşım</Text>
                  <Text style={[styles.astroValue, { color: colors.text }]}>
                    {profileData.age} yaşında
                  </Text>
                </View>
              </View>
            </Animated.View>
          )}

          {/* Ruhsal Durum */}
          <Animated.View entering={FadeIn.delay(300)} style={[styles.section, { borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>💫 Ruhsal Durumum</Text>
            
            {renderProfileField(
              '💭 Seni En Çok Yoranı',
              profileData.reason,
              <FloatingLabelPicker
                value={profileData.reason}
                placeholder="İçindeki yükü seç..."
                onChangeText={(value) => setProfileData(prev => ({ ...prev, reason: value }))}
                leftIcon="heart-dislike-outline"
                data={[
                  { id: '1', label: 'Aşk... Kalbim kırık 💔', value: 'broken_heart_love' },
                  { id: '2', label: 'İş / okul... Yoruldum artık 💼', value: 'work_school_exhaustion' },
                  { id: '3', label: 'Ailemle aram gergin 🏠', value: 'family_tension' },
                  { id: '4', label: 'Kendime inancım zayıf 🪞', value: 'low_self_confidence' },
                  { id: '5', label: 'Para derdi bitmiyor 💸', value: 'financial_struggles' },
                  { id: '6', label: 'Sağlık sorunlarımdan usandım 🏥', value: 'health_issues' },
                  { id: '7', label: 'Gelecek... Korkuyorum 🌫️', value: 'future_anxiety' },
                  { id: '8', label: 'Yalnızım... çok yalnız 🕯️', value: 'loneliness' },
                  { id: '9', label: 'Arkadaşlarım uzaklaştı 🤝', value: 'distant_friendships' },
                  { id: '10', label: 'Ruhsal bir arayıştayım 🌟', value: 'spiritual_search' },
                  { id: '11', label: 'Kariyer yolculuğumda kayboldum 🗺️', value: 'career_confusion' },
                  { id: '12', label: 'İç huzurumu kaybettim 🧘‍♀️', value: 'lost_inner_peace' },
                  { id: '13', label: 'Hayatın kendisi yorucu be abla... 🌀', value: 'general_life_exhaustion' },
                ]}
                error={errors.reason}
              />,
              true,
              'reason'
            )}

            {renderProfileField(
              '❤️ Aşk Durumun',
              profileData.love,
              <FloatingLabelPicker
                value={profileData.love}
                placeholder="Aşk durumun nedir?"
                onChangeText={(value) => setProfileData(prev => ({ ...prev, love: value }))}
                leftIcon="heart"
                data={[
                  { id: '1', label: 'Aşık oldum, kalbim çarpıyor 🥰', value: 'new_love_excitement' },
                  { id: '2', label: 'Kalbim kırık, acı çekiyorum 💔', value: 'heartbreak_pain' },
                  { id: '3', label: 'Yalnızım ama umutluyum 🕯️', value: 'hopeful_solitude' },
                  { id: '4', label: 'Aşka inancım kalmadı 🖤', value: 'lost_faith_in_love' },
                  { id: '5', label: 'Karmaşık duygular içindeyim 🎭', value: 'complex_emotions' },
                  { id: '6', label: 'Yeni bir aşkın eşiğindeyim 🌹', value: 'on_the_brink_of_love' },
                  { id: '7', label: 'İlişkimde sorunlar var ⚖️', value: 'relationship_problems' },
                  { id: '8', label: 'Aşkı arıyorum ama bulamıyorum 🔍', value: 'searching_for_love' },
                ]}
                error={errors.love}
              />,
              true,
              'love'
            )}

            {renderProfileField(
              '🫶 İhtiyacın',
              profileData.need,
              <FloatingLabelPicker
                value={profileData.need}
                placeholder="İhtiyacın nedir?"
                onChangeText={(value) => setProfileData(prev => ({ ...prev, need: value }))}
                leftIcon="balloon"
                data={[
                  { id: '1', label: 'Sevgi ve şefkat 💞', value: 'love_and_affection' },
                  { id: '2', label: 'İç huzur ve sükunet 🕊️', value: 'inner_peace_and_tranquility' },
                  { id: '3', label: 'Başarı ve tanınma 🏆', value: 'success_and_recognition' },
                  { id: '4', label: 'Güven ve istikrar 🔐', value: 'security_and_stability' },
                  { id: '5', label: 'Maddi refah ve bolluk 💰', value: 'material_prosperity' },
                  { id: '6', label: 'Ruhsal gelişim ve aydınlanma 🌟', value: 'spiritual_growth' },
                  { id: '7', label: 'Sağlık ve enerji 💪', value: 'health_and_energy' },
                  { id: '8', label: 'Yaratıcılık ve ilham 🎨', value: 'creativity_and_inspiration' },
                  { id: '9', label: 'Özgürlük ve bağımsızlık 🦅', value: 'freedom_and_independence' },
                ]}
                error={errors.need}
              />,
              true,
              'need'
            )}

            {renderProfileField(
              '🌈 Ruh Halin',
              profileData.mood,
              <FloatingLabelPicker
                value={profileData.mood}
                placeholder="Duygusal frekansını seç"
                onChangeText={(value) => setProfileData(prev => ({ ...prev, mood: value }))}
                leftIcon="sunny"
                data={[
                  { id: '1', label: 'Mutlu ve neşeli 😊', value: 'happy_and_cheerful' },
                  { id: '2', label: 'Hüzünlü ve melankolik 😢', value: 'sad_and_melancholic' },
                  { id: '3', label: 'Kafam karışık ve endişeliyim 🤯', value: 'confused_and_anxious' },
                  { id: '4', label: 'Sakin ve dengeli 😌', value: 'calm_and_balanced' },
                  { id: '5', label: 'Heyecanlı ve tutkulu 🔥', value: 'excited_and_passionate' },
                  { id: '6', label: 'Yorgun ve bitkin 😫', value: 'tired_and_exhausted' },
                  { id: '7', label: 'Öfkeli ve gergin 😠', value: 'angry_and_tense' },
                  { id: '8', label: 'Umutsuz ve karamsar 🌑', value: 'hopeless_and_pessimistic' },
                  { id: '9', label: 'İçe dönük ve düşünceli 🤔', value: 'introspective_and_thoughtful' },
                ]}
                error={errors.mood}
              />,
              true,
              'mood'
            )}
          </Animated.View>

          {/* Ruhsal Semboller & Deneyimler */}
          <Animated.View entering={FadeIn.delay(400)} style={[styles.section, { borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>🔮 Ruhsal Dünyam</Text>
            
            {renderProfileField(
              '🪬 Ruhsal Sembolün',
              profileData.meaning,
              <FloatingLabelPicker
                value={profileData.meaning}
                placeholder="Bir sembol seç"
                onChangeText={(value) => setProfileData(prev => ({ ...prev, meaning: value }))}
                leftIcon="eye-outline"
                data={[
                  { id: '1', label: 'Kelebek - Dönüşüm ve yenilenme 🦋', value: 'transformation_and_renewal' },
                  { id: '2', label: 'Yılan - Bilgelik ve şifa 🐍', value: 'wisdom_and_healing' },
                  { id: '3', label: 'Ayna - Kendini keşfetme 🪞', value: 'self_discovery' },
                  { id: '4', label: 'Karanlık - Gizem ve dönüşüm 🌑', value: 'mystery_and_transformation' },
                  { id: '5', label: 'Ay - Sezgi ve duygusallık 🌙', value: 'intuition_and_emotion' },
                  { id: '6', label: 'Güneş - Güç ve canlılık ☀️', value: 'power_and_vitality' },
                  { id: '7', label: 'Yıldız - Rehberlik ve umut ⭐', value: 'guidance_and_hope' },
                  { id: '8', label: 'Su - Duygular ve akış 🌊', value: 'emotions_and_flow' },
                  { id: '9', label: 'Ateş - Tutku ve dönüşüm 🔥', value: 'passion_and_transformation' },
                  { id: '10', label: 'Toprak - İstikrar ve büyüme 🌱', value: 'stability_and_growth' },
                ]}
                error={errors.meaning}
              />,
              true,
              'meaning'
            )}

            {renderProfileField(
              '📖 Seni Şekillendiren',
              profileData.experience,
              <FloatingLabelPicker
                value={profileData.experience}
                placeholder="Birini seç tatlım"
                onChangeText={(value) => setProfileData(prev => ({ ...prev, experience: value }))}
                leftIcon="star-half"
                data={[
                  { id: '1', label: 'Ailemle yaşadığım bir olay 👪', value: 'family_experience' },
                  { id: '2', label: 'Aşık olduğum biri ❤️', value: 'falling_in_love' },
                  { id: '3', label: 'Kariyer yolculuğum 💼', value: 'career_journey' },
                  { id: '4', label: 'Bir kayıp... 🕯️', value: 'significant_loss' },
                  { id: '5', label: 'Ruhsal bir deneyim 🌟', value: 'spiritual_experience' },
                  { id: '6', label: 'Sağlık sorunları 🏥', value: 'health_challenges' },
                  { id: '7', label: 'Eğitim hayatım 📚', value: 'educational_journey' },
                  { id: '8', label: 'Yolculuk ve keşif 🌍', value: 'travel_and_discovery' },
                  { id: '9', label: 'Yaratıcı bir başarı 🎨', value: 'creative_achievement' },
                  { id: '10', label: 'Maddi bir değişim 💰', value: 'financial_change' },
                ]}
                error={errors.experience}
              />,
              true,
              'experience'
            )}

            {renderProfileField(
              '🔍 En Çok Merak Ettiğin',
              profileData.curious,
              <FloatingLabelPicker
                value={profileData.curious}
                placeholder="Merak ettiğin bir alan seç"
                onChangeText={(value) => setProfileData(prev => ({ ...prev, curious: value }))}
                leftIcon="bookmark"
                data={[
                  { id: '1', label: 'Aşk hayatım ve ilişkilerim ❤️', value: 'love_life_and_relationships' },
                  { id: '2', label: 'Kariyerim ve iş hayatım 💼', value: 'career_and_work_life' },
                  { id: '3', label: 'Sağlık durumum ve enerjim 🏥', value: 'health_and_energy_status' },
                  { id: '4', label: 'Ailemle ilgili gelişmeler 👪', value: 'family_developments' },
                  { id: '5', label: 'Parasal konular ve maddi durum 💸', value: 'financial_matters' },
                  { id: '6', label: 'Ruhsal gelişim ve aydınlanma 🌟', value: 'spiritual_development' },
                  { id: '7', label: 'Yaratıcı projelerim ve yeteneklerim 🎨', value: 'creative_projects_and_talents' },
                  { id: '8', label: 'Sosyal ilişkilerim ve arkadaşlıklarım 🤝', value: 'social_relationships' },
                  { id: '9', label: 'Eğitim ve öğrenme sürecim 📚', value: 'education_and_learning' },
                  { id: '10', label: 'Yolculuklar ve yeni deneyimler 🌍', value: 'travels_and_new_experiences' },
                  { id: '11', label: 'Hayatımın genel akışı ve kaderim 🌀', value: 'life_path_and_destiny' },
                ]}
                error={errors.curious}
              />,
              true,
              'curious'
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Go Back Modal */}
      <Modal
        visible={showGoBackModal}
        onClose={() => setShowGoBackModal(false)}
        onConfirm={() => {
          setShowGoBackModal(false);
          setIsEditing(false);
        }}
        title="Değişiklikleri kaydetmedin"
        message="Yapmış olduğunuz değişiklikler kaybolacak. Devam etmek istiyor musunuz?"
        confirmText="Devam Et"
        cancelText="İptal"
        iconName="warning"
      />
      
      {/* Cancel Modal */}
      <Modal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          setShowCancelModal(false);
          setIsEditing(false);
        }}
        title="Değişiklikleri iptal et"
        message="Yapmış olduğunuz değişiklikler kaybolacak. Emin misiniz?"
        confirmText="Evet"
        cancelText="Hayır"
        iconName="close-circle"
      />
    </View>
  );
};

export default Profile;