import { IconButton } from '@components';
import { useTheme } from '@providers';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, KeyboardAvoidingView, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import useIntroductionData from './Data';
import styles from './styles';


const Introduction = () => {
  const { colors } = useTheme();
  const { width } = Dimensions.get('window');
  const { data, name, setName, date, setDate, gender, setGender, error, time, setTime, reason, setReason, love, setLove, need, setNeed, mood, setMood, meaning, setMeaning, experience, setExperience, curious, setCurious } = useIntroductionData();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Animated.View
        entering={FadeIn}
      >
        <View style={[styles.item, { width }]}> 
          <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.description, { color: colors.text }]}>{item.description}</Text>
          {item.FloatingLabelInput}
          <View style={[styles.buttonContainer, { justifyContent: currentIndex === 0 ? 'flex-end' : currentIndex === data.length - 1 ? 'flex-start' : 'space-between' }]}>
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