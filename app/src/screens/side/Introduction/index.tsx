import { db } from '@api/config.firebase';
import { CustomButton, IconButton } from '@components';
import { useFetchData } from '@hooks';
import { useAuth, useTheme } from '@providers';
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
  const { width } = Dimensions.get('window');
  const { data, name, date, gender, time, reason, love, need, mood, meaning, experience, curious } = useIntroductionData();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isAllFieldsFilled = () => {
    return name !== '' && 
           date !== '' && 
           gender !== '' && 
           reason !== '' && 
           love !== '' && 
           need !== '' && 
           mood !== '' && 
           meaning !== '' && 
           experience !== '' &&
           curious !== '';
  };
  // Sadece kontrol için
  const canScroll = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (
        (currentIndex === 0 && name === '') ||
        (currentIndex === 1 && date === '') ||
        (currentIndex === 3 && gender === '') ||
        (currentIndex === 4 && reason === '') ||
        (currentIndex === 5 && love === '') ||
        (currentIndex === 6 && need === '') ||
        (currentIndex === 7 && mood === '') ||
        (currentIndex === 8 && meaning === '') ||
        (currentIndex === 9 && experience === '')
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
        (currentIndex === 4 && gender === '') ||
        (currentIndex === 5 && reason === '') ||
        (currentIndex === 6 && love === '') ||
        (currentIndex === 7 && need === '') ||
        (currentIndex === 8 && mood === '') ||
        (currentIndex === 9 && meaning === '') ||
        (currentIndex === 10 && experience === '')
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
  const [description] = useState(data.map(item => item.description));
  const [fullAstro, setFullAstro] = useState<FullAstroResult>({
    sunSign: '',
    moonSign: '',
    ascendantSign: '',
    age: 0,
    birthWeekday: '',
    daysToNextBirthday: 0
  });
  
  useEffect(() => {
    if (date instanceof Date) {
      const { sunSign, ascendantSign, moonSign, age, birthWeekday, daysToNextBirthday } = getFullAstro(
        date.toISOString(),
        time instanceof Date ? time.toISOString() : date.toISOString(),
        { latitude: 0, longitude: 0 }
      );

      setFullAstro({ sunSign, ascendantSign, moonSign, age, birthWeekday, daysToNextBirthday });
    }
  }, [date, time]);
  
  const [signs, setSigns] = useState<any[]>([]);
  const [dataFetched, setDataFetched] = useState(false);
  
  useEffect(() => {
    if (user && !dataFetched) {
      useFetchData({ user, setLoading: setIsLoading, setSigns })
        .then((success) => {
          if (success) {
            setDataFetched(true);
          }
        });
    }
  }, [user, dataFetched])
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
              q1: "Kullanıcının " + description[0] + " sorusuna cevabı: " + name,
              q2: "Kullanıcının " + description[1] + " sorusuna cevabı: " + date,
              q3: "Kullanıcının " + description[2] + " sorusuna cevabı: " + time,
              q4: "Kullanıcının " + description[3] + " sorusuna cevabı: " + gender,
              q5: "Kullanıcının " + description[4] + " sorusuna cevabı: " + reason,
              q6: "Kullanıcının " + description[5] + " sorusuna cevabı: " + love,
              q7: "Kullanıcının " + description[6] + " sorusuna cevabı: " + need,
              q8: "Kullanıcının " + description[7] + " sorusuna cevabı: " + mood,
              q9: "Kullanıcının " + description[8] + " sorusuna cevabı: " + meaning,
              q10: "Kullanıcının " + description[9] + " sorusuna cevabı: " + experience,
              q11: "Kullanıcının " + description[10] + " sorusuna cevabı: " + curious,
            },
            name,
            date,
            time,
            gender,
            reason,
            love,
            need,
            mood,
            meaning,
            experience,
            curious,
            newUser: false,
          });
        }
        const fetchSuccess = await useFetchData({ user: user, setLoading: setIsLoading, setSigns });
          if (fetchSuccess) {
            setDataFetched(true);
            router.replace('/src/screens/main/navigator/(tabs)/HomeScreen');
          }
      }
    } catch (error) {
      console.log(error);
    } finally {
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