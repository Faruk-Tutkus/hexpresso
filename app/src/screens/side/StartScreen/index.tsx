import { Animation, CustomButton } from '@components';
import { useTheme } from '@providers';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Text, View } from 'react-native';
import { styles } from './styles';

const data = [
  { id: 1, symbol: '🔮' },
  { id: 2, symbol: '🌙' },
  { id: 3, symbol: '✨' },
  { id: 4, symbol: '🌟' },
  { id: 5, symbol: '🪐' },
  { id: 6, symbol: '💫' },
  { id: 7, symbol: '🌌' },
  { id: 8, symbol: '♈' },
  { id: 9, symbol: '♉' },
  { id: 10, symbol: '♊' },
  { id: 11, symbol: '♋' },
  { id: 12, symbol: '♌' },
  { id: 13, symbol: '♍' },
  { id: 14, symbol: '♎' },
  { id: 15, symbol: '♏' },
  { id: 16, symbol: '♐' },
  { id: 17, symbol: '♑' },
  { id: 18, symbol: '♒' },
  { id: 19, symbol: '♓' },
  { id: 20, symbol: '🧿' },
  { id: 21, symbol: '🪄' },
  { id: 22, symbol: '🔭' },
  { id: 23, symbol: '🧘‍♀️' },
  { id: 24, symbol: '🕯️' },
  { id: 25, symbol: '🖐️' },
  { id: 26, symbol: '🪬' },
];


const StartScreen = () => {
  const { colors, theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const width = Dimensions.get('window').width;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (currentIndex + 1) % data.length;
        setCurrentIndex(nextIndex);
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true
        });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }: { item: { id: number; symbol: string } }) => {
    return (
      <View style={[styles.emojiContainer, { width }]}>
        <Text style={styles.emojiText}>{item.symbol}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <Animation
          src = { theme === 'dark' ? 'https://lottie.host/1a9e6fe7-c012-4f16-b085-710037385a28/c6F9SxqUBQ.lottie' : 'https://lottie.host/1a53bb28-6dbd-464c-9b5a-916adba3fd60/mtEnuhqqhw.lottie'}
          contentStyle={styles.animation}
        />
      </View>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={[styles.flatList]}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        pagingEnabled
        initialNumToRender={4}        
        maxToRenderPerBatch={4}
        windowSize={4} 
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: width,            // her item'ın genişliği
          offset: width * index,    // offset = index * genişlik
          index,
        })}
      />
      <View style={styles.buttonContainer}>
        <CustomButton
          title='Benim için bir hesap oluştur'
          variant='secondary'
          onPress={() => {router.push('/src/screens/auth/Register')}}
          contentStyle={styles.button}
        />
        <CustomButton
          title='Zaten buraya aitim'
          variant='primary'
          onPress={() => {router.push('/src/screens/auth/Login')}}
          contentStyle={styles.button}
        />
      </View>
    </View>
  )
}

export default StartScreen