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
  const [reason, setReason] = useState('');
  const [love, setLove] = useState('');
  const [need, setNeed] = useState('');
  const [mood, setMood] = useState('');
  const [meaning, setMeaning] = useState('');
  const [experience, setExperience] = useState('');
  const [curious, setCurious] = useState('');
  const [error, setError] = useState({
    name: '',
    date: '',
  });

  const data = [
    {
      id: 1,
      title: '✨ Hoş geldin güzel ruh!',
      description: 'Önce enerjine bir dokunalım... İsmini fısıldar mısın bana?',
      FloatingLabelInput: (
        <FloatingLabelInput
          value={name}
          placeholder={'Adını söyle, yıldızlar duysun'}
          onChangeText={setName}
          type={'text'}
          leftIcon={'person'}
          error={error.name}
        />
      ),
      button: {
        title: 'Sıradaki Yıldız ✨',
        onPress: () => {
          if (!name) {
            setError(prev => ({ ...prev, name: 'Adını yazmadan devam edemem tatlım 💫' }));
          }
        }
      }
    },
    {
      id: 2,
      title: 'Doğum Günü Kutlu Olsun...',
      description: 'Burcun, kaderinin kilididir. Ne zaman doğdun canımın içi?',
      FloatingLabelInput: (
        <FloatingDatePicker
          value={date as Date}
          onChange={(date) => setDate(date)}
          placeholder={'Doğum gününü söyle bana'}
          leftIcon={'calendar'}
          error={error.date}
        />
      ),
      button: {
        title: 'Yıldız Haritasına Geç →',
        onPress: () => {
          if (!date) {
            setError(prev => ({ ...prev, date: 'Tarih olmadan gökyüzünü okuyamam tatlım 🌙' }));
            setError(prev => ({ ...prev, name: '' }));
          }
        }
      }
    },
    {
      id: 3,
      title: '⏰ Gecenin kaçıydı o an?',
      description: 'Doğduğun saat, yıldızlar hangi sıradaydı? Bilirsen söyle...',
      FloatingLabelInput: (
        <FloatingTimePicker
          value={time as Date}
          onChange={(date) => setTime(date)}
          placeholder={'Doğum saatini söyle tatlım'}
          leftIcon={'clock'}
        />
      ),
      button: {
        title: 'Devam Edelim 🌠',
        onPress: () => {
          setError(prev => ({ ...prev, date: '' }));
        }
      }
    },
    {
      id: 4,
      title: '🌺 Enerjin hangi renkte?',
      description: 'Eril mi dişil mi yoksa bambaşka bir frekansta mısın?',
      FloatingLabelInput: (
        <FloatingLabelPicker
          value={gender}
          placeholder={'Kendini nasıl tanımlarsın?'}
          onChangeText={setGender}
          leftIcon={gender === 'Erkek' ? 'man' : gender === 'Kadın' ? 'woman' : 'star'}
          data={[
            { id: '1', label: 'Eril enerjideyim (Erkek)', value: 'Erkek' },
            { id: '2', label: 'Dişil enerjideyim (Kadın)', value: 'Kadın' },
            { id: '3', label: 'Tanımlamak istemiyorum ✨', value: 'Diğer' },
          ]}
        />
      ),
      button: {
        title: 'Gönül Frekansına Geç 💞',
        onPress: () => { }
      }
    },
    {
      id: 5,
      title: '💭 Ruhunu en çok ne yoruyor bugünlerde?',
      description: 'Dertlerini içime çekmeden sana fal bakamam canım. En çok hangi konu canını sıkıyor?',
      FloatingLabelInput: (
        <FloatingLabelPicker
          value={reason}
          placeholder={'İçindeki yükü seç...'}
          onChangeText={setReason}
          leftIcon={'heart-broken'}
          data={[
            { id: '1', label: 'Aşk... Kalbim kırık 💔', value: 'aşk' },
            { id: '2', label: 'İş / okul... Yoruldum artık 💼', value: 'iş' },
            { id: '3', label: 'Ailemle aram gergin 🏠', value: 'aile' },
            { id: '4', label: 'Kendime inancım zayıf 🪞', value: 'güven' },
            { id: '5', label: 'Para derdi bitmiyor 💸', value: 'para' },
            { id: '6', label: 'Sağlık sorunlarımdan usandım 🏥', value: 'sağlık' },
            { id: '7', label: 'Gelecek... Korkuyorum 🌫️', value: 'gelecek' },
            { id: '8', label: 'Yalnızım... çok yalnız 🕯️', value: 'yalnızlık' },
            { id: '9', label: 'Arkadaşlarım uzaklaştı 🤝', value: 'arkadaşlık' },
            { id: '10', label: 'Hayatın kendisi yorucu be abla... 🌀', value: 'hiçbiri' },
          ]}
        />
      ),
      button: {
        title: 'Fincanı getiriyorum ☕',
        onPress: () => { }
      }
    },
    {
      id: 6,
      title: '❤️ Kalbin ne diyor?',
      description: 'Aşk hayatın nasıl gidiyor tatlım?',
      FloatingLabelInput: (
        <FloatingLabelPicker
          value={love}
          placeholder={'Aşk durumun nedir?'}
          onChangeText={setLove}
          leftIcon={'heart'}
          data={[
            { id: '1', label: 'Aşık oldum 🥰', value: 'aşık' },
            { id: '2', label: 'Kalbim kırık 💔', value: 'kırık' },
            { id: '3', label: 'Yalnızım ama umutluyum 🌈', value: 'umut' },
            { id: '4', label: 'Aşka inancım kalmadı 🖤', value: 'yok' },
          ]}
        />
      ),
      button: {
        title: 'İç Sesine Kulak Ver 🔮',
        onPress: () => {}
      }
    },
    {
      id: 7,
      title: '🫶 En çok neye ihtiyaç duyuyorsun?',
      description: 'Şu an en çok ne seni iyi hissettirir?',
      FloatingLabelInput: (
        <FloatingLabelPicker
          value={need}
          placeholder={'İhtiyacın nedir?'}
          onChangeText={setNeed}
          leftIcon={'hands-helping'}
          data={[
            { id: '1', label: 'Sevgi 💞', value: 'sevgi' },
            { id: '2', label: 'Huzur 🕊️', value: 'huzur' },
            { id: '3', label: 'Başarı 🏆', value: 'başarı' },
            { id: '4', label: 'Güven 🔐', value: 'güven' },
          ]}
        />
      ),
      button: {
        title: 'Ruh Haline Geçelim ☁️',
        onPress: () => {}
      }
    },
    {
      id: 8,
      title: '🌈 Bugün nasılsın?',
      description: 'Ruh halin bir şarkı olsaydı hangi tonda çalardı?',
      FloatingLabelInput: (
        <FloatingLabelPicker
          value={mood}
          placeholder={'Duygusal frekansını seç'}
          onChangeText={setMood}
          leftIcon={'smile'}
          data={[
            { id: '1', label: 'Mutlu 😊', value: 'mutlu' },
            { id: '2', label: 'Hüzünlü 😢', value: 'hüzünlü' },
            { id: '3', label: 'Kafam karışık 🤯', value: 'karışık' },
            { id: '4', label: 'Sakin 😌', value: 'sakin' },
          ]}
        />
      ),
      button: {
        title: 'Simgeleri Seçiyoruz 🧿',
        onPress: () => {}
      }
    },
    {
      id: 9,
      title: '🪬 Rüyanda hangi semboller vardı?',
      description: 'Sana özel mesajlar hangi imgelerde saklıydı?',
      FloatingLabelInput: (
        <FloatingLabelPicker
          value={meaning}
          placeholder={'Bir sembol seç'}
          onChangeText={setMeaning}
          leftIcon={'eye'}
          data={[
            { id: '1', label: 'Kelebek 🦋', value: 'kelebek' },
            { id: '2', label: 'Yılan 🐍', value: 'yılan' },
            { id: '3', label: 'Ayna 🪞', value: 'ayna' },
            { id: '4', label: 'Karanlık 🌑', value: 'karanlık' },
          ]}
        />
      ),
      button: {
        title: 'Yaşanmışlıklara Bakalım 🕰️',
        onPress: () => {}
      }
    },
    {
      id: 10,
      title: '📖 Hayatında seni en çok etkileyen neydi?',
      description: 'Bir olay, bir kişi, bir an... Seni en çok şekillendiren şey neydi?',
      FloatingLabelInput: (
        <FloatingLabelPicker
          value={experience}
          placeholder={'Birini seç tatlım'}
          onChangeText={setExperience}
          leftIcon={'star'}
          data={[
            { id: '1', label: 'Ailemle yaşadığım bir olay 👪', value: 'aile' },
            { id: '2', label: 'Aşık olduğum biri ❤️', value: 'aşk' },
            { id: '3', label: 'Kariyer yolculuğum 💼', value: 'kariyer' },
            { id: '4', label: 'Bir kayıp... 🕯️', value: 'kayıp' },
          ]}
        />
      ),
      button: {
        title: 'Son Soruya Geçiyoruz 🧠',
        onPress: () => {}
      }
    },
    {
      id: 11,
      title: '🔍 En çok neyi merak ediyorsun?',
      description: 'Geleceğinle ilgili seni en çok heyecanlandıran veya kafanı kurcalayan konu ne?',
      FloatingLabelInput: (
        <FloatingLabelPicker
          value={curious}
          placeholder={'Merak ettiğin bir alan seç'}
          onChangeText={setCurious}
          leftIcon={'question'}
          data={[
            { id: '1', label: 'Aşk hayatım ❤️', value: 'aşk' },
            { id: '2', label: 'Kariyerim 💼', value: 'kariyer' },
            { id: '3', label: 'Sağlık durumum 🏥', value: 'sağlık' },
            { id: '4', label: 'Ailemle ilgili gelişmeler 👪', value: 'aile' },
            { id: '5', label: 'Parasal konular 💸', value: 'para' },
            { id: '6', label: 'Hayatımın genel akışı 🌀', value: 'genel' },
          ]}
        />
      ),
      button: {
        title: 'Falına Geçiyoruz ✨',
        onPress: () => {}
      }
    }
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
    setTime,
    reason,
    setReason,
    love,
    setLove,
    need,
    setNeed,
    mood,
    setMood,
    meaning,
    setMeaning,
    experience,
    setExperience,
    curious,
    setCurious
  };
};



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
        (currentIndex === 2 && time === '') ||
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
        (currentIndex === 3 && time === '') ||
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
              // Step 4: Gender
              else if (item.id === 4 && gender !== '') {
                handleScroll('next');
              }
              // Step 5: Reason
              else if (item.id === 5 && reason !== '') {
                handleScroll('next');
              }
              // Step 6: Love
              else if (item.id === 6 && love !== '') {
                handleScroll('next');
              }
              // Step 7: Need
              else if (item.id === 7 && need !== '') {
                handleScroll('next');
              }
              // Step 8: Mood
              else if (item.id === 8 && mood !== '') {
                handleScroll('next');
              }
              // Step 9: Meaning 
              else if (item.id === 9 && meaning !== '') {
                handleScroll('next');
              }
              // Step 10: Experience
              else if (item.id === 10 && experience !== '') {
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