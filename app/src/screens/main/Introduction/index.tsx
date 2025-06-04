import { CustomButton, FloatingDatePicker, FloatingLabelInput, FloatingLabelPicker } from '@components';
import { useTheme } from '@providers';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import styles from './styles';

const useIntroductionData = () => {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [date, setDate] = useState<Date | ''>('');

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
        />
      ),
      button: {
        title: 'Devam Et',
        onPress: () => {
          // İsim validasyonu veya işlemleri burada yapılabilir
          console.log('İsim:', name);
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
        />
      ),
      button: {
        title: 'Devam Et',
        onPress: () => {
          // Tarih validasyonu veya işlemleri burada yapılabilir
          console.log('Tarih:', date);
        }
      }
    },
    {
      id: 3,
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
          // Cinsiyet validasyonu veya işlemleri burada yapılabilir
          console.log('Cinsiyet:', gender);
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
    setGender
  };
};

const Introduction = () => {
  const { colors } = useTheme();
  const { width } = Dimensions.get('window');
  const { data, name, setName, date, setDate, gender, setGender } = useIntroductionData();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollToNext = () => {
    if (currentIndex < data.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const renderItem = ({ item}: { item: any}) => {
    return (
      <Animated.View
        entering={FadeInUp.delay(currentIndex * 1000)}
      >
        <View style={[styles.item, { width }]}>
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
          {item.FloatingLabelInput}
          <CustomButton
            title={item.button.title}
            onPress={() => {
              item.button.onPress();
              scrollToNext();
            }}
          />
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
        scrollEnabled={true}
        pagingEnabled
        windowSize={3}
        initialNumToRender={3}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      />
    </View>
  )
}

export default Introduction