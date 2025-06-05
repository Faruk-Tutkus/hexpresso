import { FloatingDatePicker, FloatingLabelInput, FloatingLabelPicker, FloatingTimePicker, IconButton } from '@components';
import { useTheme } from '@providers';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import styles from './styles';

const useIntroductionData = () => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [date, setDate] = useState<Date | ''>('');
  const [time, setTime] = useState<Date | ''>('');
  const [error, setError] = useState({
    name: '',
    date: '',
  });

  const data = [
    {
      id: 1,
      title: 'Hoşgeldiniz',
      description: 'Seni tanımakla başlayalım, adın ne?',
      FloatingLabelInput: (
        <FloatingLabelInput
          value={name}
          placeholder={'Adınızı giriniz'}
          onChangeText={setName}
          type={'text'}
          leftIcon={'person'}
          error={error.name}
        />
      ),
      button: {
        title: 'Devam Et',
        onPress: () => {
          if (!name) {
            setError(prev => ({ ...prev, name: 'Adınızı giriniz' }));
          }
        }
      }
    },
    {
      id: 2,
      title: 'Doğum tarihin nedir?',
      description: 'Bu, uygulamanın ilk ekranıdır',
      FloatingLabelInput: (
        <FloatingDatePicker
          value={date as Date}
          onChange={(date) => setDate(date)}
          placeholder={'Doğum tarihinizi giriniz'}
          leftIcon={'calendar'}
          error={error.date}
        />
      ),
      button: {
        title: 'Devam Et',
        onPress: () => {
          if (!date) {
            setError(prev => ({ ...prev, date: 'Doğum tarihinizi giriniz' }));
          }
        }
      }
    },
    {
      id: 3,
      title: 'Doğum saatiniz nedir?',
      description: 'Bu, uygulamanın ilk ekranıdır',
      FloatingLabelInput: (
        <FloatingTimePicker
          value={time as Date}
          onChange={(date) => setTime(date)}
          placeholder={'Doğum saatinizi giriniz'}
          leftIcon={'calendar'}
        />
      ),
      button: {
        title: 'Devam Et',
        onPress: () => {

        }
      }
    },
    {
      id: 4,
      title: 'Cinsiyetin nedir?',
      description: 'Bu, uygulamanın ilk ekranıdır',
      FloatingLabelInput: (
        <FloatingLabelPicker
          value={gender}
          placeholder={'Cinsiyetinizi giriniz'}
          onChangeText={setGender}
          leftIcon={gender === 'Erkek' ? 'man' : 'woman'}
          data={[{ id: '1', label: 'Erkek', value: 'Erkek' }, { id: '2', label: 'Kadın', value: 'Kadın' }]}
        />
      ),
      button: {
        title: 'Devam Et',
        onPress: () => {
          
        }
      }
    },
  ];

  return {
    data,
    name,
    setName,
    date,
    setDate,
    gender,
    setGender,
    error,
    time,
    setTime
  };
};

const Introduction = () => {
  const { colors } = useTheme();
  const { width } = Dimensions.get('window');
  const { data, name, setName, date, setDate, gender, setGender, error, time, setTime } = useIntroductionData();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sadece kontrol için
  const canScroll = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (
        (currentIndex === 0 && name === '') ||
        (currentIndex === 1 && date === '') ||
        (currentIndex === 2 && time === '') ||
        (currentIndex === 3 && gender === '')
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
        (currentIndex === 3 && time === '')
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

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    return (
      <Animated.View
        entering={FadeIn}
      >
        <View style={[styles.item, { width }]}> 
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
          {item.FloatingLabelInput}
          <View style={styles.buttonContainer}>
            <IconButton
              icon='arrow-back-outline'
              variant='secondary'
              onPress={() => {
                item.button.onPress();
                handleScroll('prev');
              }}
            />
            <IconButton
            icon='arrow-forward-outline'
            onPress={() => {
              item.button.onPress();
              // Step 1: Name
              if (item.id === 1 && name !== '') {
                handleScroll('next');
              }
              // Step 2: Date
              else if (item.id === 2 && date !== '') {
                handleScroll('next');
              }
              // Step 3: Time
              else if (item.id === 3) {
                handleScroll('next');
              }
            }}
          />  
          </View>
        </View>
      </Animated.View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      />
    </View>
  )
}

export default Introduction