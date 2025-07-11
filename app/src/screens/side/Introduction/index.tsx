import { db } from '@api/config.firebase';
import { CustomButton, IconButton } from '@components';
import { PROMPT_DESCRIPTIONS } from '@constants';
import { useFetchData, useFetchSeers } from '@hooks';
import { useAuth, useTheme, useToast } from '@providers';
import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { FullAstroResult, getFullAstro } from 'src/hooks/GetHoroscopeInfo';
import useIntroductionData from './Data';
import styles from './styles';


const Introduction = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { width } = Dimensions.get('window');
  const { data, name, date, gender, time, location } = useIntroductionData();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { loading: dataLoading} = useFetchData(user);
  const { loading: seersLoading, error: seersError } = useFetchSeers(user);
  const isAllFieldsFilled = () => {
    return name !== '' && 
           date !== '' && 
           location !== null &&
           gender !== '';
  };
  // Sadece kontrol için
  const canScroll = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (
        (currentIndex === 0 && name === '') ||
        (currentIndex === 1 && date === '') ||
        (currentIndex === 3 && location === null) ||
        (currentIndex === 4 && gender === '')
      ) {
        return false;
      }
      if (currentIndex < data.length - 1) {
        return true;
      }
      return false;
    }
    if (direction === 'prev') {
      if (
        (currentIndex === 1 && name === '') ||
        (currentIndex === 2 && date === '') ||
        (currentIndex === 4 && location === null) ||
        (currentIndex === 5 && gender === '')
      ) {
        return false;
      }
      if (currentIndex > 0) {
        return true;
      }
      return false;
    }
    return false;
  };

  // Scroll işlemi için
  const handleScroll = (direction: 'next' | 'prev') => {
    if (canScroll(direction)) {
      if (direction === 'next') {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true
        });
        setCurrentIndex(currentIndex + 1);
      } else if (direction === 'prev') {
        flatListRef.current?.scrollToIndex({
          index: currentIndex - 1,
          animated: true
        });
        setCurrentIndex(currentIndex - 1);
      }
      return true;
    }
    return false;
  };

  const [fullAstro, setFullAstro] = useState<FullAstroResult>({
    sunSign: '',
    moonSign: '',
    ascendantSign: '',
    age: 0,
    birthWeekday: '',
    daysToNextBirthday: 0
  });
  console.log(location);
  useEffect(() => {
    if (date instanceof Date && !isNaN(date.getTime()) && location) {
      try {
        const dateString = date.toISOString();
        const timeString = time instanceof Date && !isNaN(time.getTime()) 
          ? time.toISOString() 
          : dateString;
        
        const { sunSign, ascendantSign, moonSign, age, birthWeekday, daysToNextBirthday } = getFullAstro(
          dateString,
          timeString,
          { latitude: location.latitude, longitude: location.longitude }
        );

        setFullAstro({ sunSign, ascendantSign, moonSign, age, birthWeekday, daysToNextBirthday });
      } catch (error) {
        console.error('Error calculating astro in introduction:', error);
        showToast('Hata oluştu', 'error')
      }
    }
  }, [date, time, location]);
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.data()?.newUser) {
          await setDoc(doc(db, 'users', user.uid), {
            ...userDoc.data(),
            sunSign: fullAstro.sunSign,
            moonSign: fullAstro.moonSign,
            ascendantSign: fullAstro.ascendantSign,
            age: fullAstro.age,
            birthWeekday: fullAstro.birthWeekday,
            daysToNextBirthday: fullAstro.daysToNextBirthday,
            prompt: {
              q1: "Kullanıcının " + PROMPT_DESCRIPTIONS[0] + " sorusuna cevabı: " + name,
              q2: "Kullanıcının " + PROMPT_DESCRIPTIONS[1] + " sorusuna cevabı: " + date,
              q3: "Kullanıcının " + PROMPT_DESCRIPTIONS[2] + " sorusuna cevabı: " + time,
              q4: "Kullanıcının " + PROMPT_DESCRIPTIONS[3] + " sorusuna cevabı: " + gender,
              q5: "Kullanıcının " + PROMPT_DESCRIPTIONS[4] + " sorusuna cevabı: " + '',
              q6: "Kullanıcının " + PROMPT_DESCRIPTIONS[5] + " sorusuna cevabı: " + '',
              q7: "Kullanıcının " + PROMPT_DESCRIPTIONS[6] + " sorusuna cevabı: " + '',
              q8: "Kullanıcının " + PROMPT_DESCRIPTIONS[7] + " sorusuna cevabı: " + '',
              q9: "Kullanıcının " + PROMPT_DESCRIPTIONS[8] + " sorusuna cevabı: " + '',
              q10: "Kullanıcının " + PROMPT_DESCRIPTIONS[9] + " sorusuna cevabı: " + '',
              q11: "Kullanıcının " + PROMPT_DESCRIPTIONS[10] + " sorusuna cevabı: " + '',
            },
            name,
            date: date instanceof Date && !isNaN(date.getTime()) ? date.toISOString() : null,
            time: time instanceof Date && !isNaN(time.getTime()) ? time.toISOString() : null,
            gender,
            reason: '',
            love: '',
            need: '',
            mood: '',
            meaning: '',
            experience: '',
            curious: '',
            newUser: false,
            location: {
              latitude: location?.latitude || 0,
              longitude: location?.longitude || 0,
            },
            updatedAt: new Date(),
            coins: 500,
          });
          
          console.log('🚀 Introduction: Kullanıcı kaydedildi, cache için veri yükleniyor...');
          
          // Kullanıcı kaydedildikten sonra cache'e veri yükle
          
          if (!dataLoading && !seersLoading && !seersError) {
            console.log('✅ Introduction: Cache\'e veri başarıyla eklendi');
            router.replace('/src/screens/main/navigator/FortuneTellingScreen');
          } else {
            console.log('⚠️ Introduction: Cache yüklemesi başarısız, yine de devam ediliyor');
            router.replace('/src/screens/main/navigator/FortuneTellingScreen');
          }
        }
      }
    } catch (error) {
      console.log(error);
      showToast('Hata oluştu', 'error')
      setIsLoading(false);
    }
  }
  const renderItem = ({ item }: { item: any }) => {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
      >
        <View style={[styles.item, { width }]}> 
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
          {item.FloatingLabelInput}
          <View style={[styles.buttonContainer, { justifyContent: currentIndex === 0 ? 'flex-end' : 'space-between' }]}>
            {currentIndex > 0 && (
              <IconButton
                icon='arrow-back-outline'
                variant='secondary'
                onPress={() => {
                  item.button.onPress();
                  handleScroll('prev');
                }}
              />
            )}
            {currentIndex < data.length - 1 && (
              <IconButton
                icon='arrow-forward-outline'
                variant='primary'
                onPress={() => {
                  item.button.onPress();
                  handleScroll('next');
                }}
              />
            )}
            {currentIndex === data.length - 1 && isAllFieldsFilled() && (
              <CustomButton
                title='Hadi Başlayalım'
                onPress={() => {
                  // router.push({
                  //   pathname: '/src/screens/auth/Register',
                  //   params: {
                  //     name,
                  //     date: date ? date.toISOString() : '',
                  //     time: time ? time.toISOString() : '',
                  //     gender,
                  //     reason,
                  //     love,
                  //     need,
                  //     mood,
                  //     meaning,
                  //     experience,
                  //     curious,
                  //   }
                    
                  // });
                  showToast('Profilini profilim sayfasında görebilirsin!', 'success');
                  handleSave();
                }}
                loading={isLoading}
              />
            )}
          </View>
        </View>
      </Animated.View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior='padding' style={{  }}>
      <Animated.FlatList
        ref={flatListRef}
        contentContainerStyle={[styles.flatList]}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        pagingEnabled
        initialNumToRender={1}        
        maxToRenderPerBatch={1}
        windowSize={1} 
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: width,            // her item'ın genişliği
          offset: width * index,    // offset = index * genişlik
          index,
        })}
        // onMomentumScrollEnd={(event) => {
        //   const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
        //   setCurrentIndex(newIndex);
        // }}
      />
      </KeyboardAvoidingView>
    </View>
  )
}

export default Introduction 