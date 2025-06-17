import { useTheme } from '@providers';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { MMKV } from 'react-native-mmkv';


enum numSign {
  Aquarius = 0,
  Aries = 1,
  Cancer = 2,
  Capricorn = 3,
  Gemini = 4,
  Leo = 5,
  Libra = 6,
  Pisces = 7,
  Sagittarius = 8,
  Scorpio = 9,
  Taurus = 10,
  Virgo = 11,
}

const GuideScreen = () => {
  const { colors } = useTheme();
  const [signs, setSigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const storage = new MMKV({ id: 'signs_data' });
  useEffect(() => {
    const loadCache = async (id: string) => {
      try {
        const item = storage.getString(id);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    loadCache('signs_data').then((data: any[]) => {
      console.log(data)
      setSigns(data);
      setLoading(false);
    });
  }, [])
  console.log(signs)
  // const data = loading ? [] : [
  //   { sign: 'Aquarius', date: signs[numSign.Aquarius].info.dates, image: require('@assets/image/aquarius.svg') },
  //   { sign: 'Aries', date: signs[numSign.Aries].info.dates, image: require('@assets/image/aries.svg') },
  //   { sign: 'Cancer', date: signs[numSign.Cancer].info.dates, image: require('@assets/image/cancer.svg') },
  //   { sign: 'Capricorn', date: signs[numSign.Capricorn].info.dates, image: require('@assets/image/capricorn.svg') },
  //   { sign: 'Gemini', date: signs[numSign.Gemini].info.dates, image: require('@assets/image/gemini.svg') },
  //   { sign: 'Leo', date: signs[numSign.Leo].info.dates, image: require('@assets/image/leo.svg') },
  //   { sign: 'Libra', date: signs[numSign.Libra].info.dates, image: require('@assets/image/libra.svg') },
  //   { sign: 'Pisces', date: signs[numSign.Pisces].info.dates, image: require('@assets/image/pisces.svg') },
  //   { sign: 'Sagittarius', date: signs[numSign.Sagittarius].info.dates, image: require('@assets/image/sagittarius.svg') },
  //   { sign: 'Scorpio', date: signs[numSign.Scorpio].info.dates, image: require('@assets/image/scorpio.svg') },
  //   { sign: 'Taurus', date: signs[numSign.Taurus].info.dates, image: require('@assets/image/taurus.svg') },
  //   { sign: 'Virgo', date: signs[numSign.Virgo].info.dates, image: require('@assets/image/virgo.svg') },
  // ]
  return (
    <View>
      {/* {loading ? <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.text} />
      </View> :
        <>
          <AskAI type="sign" />
          <FlatList
            data={data}
            renderItem={({ item }) => <HoroscopeCard sign={item.sign} date={item.date} image={item.image} />}
            keyExtractor={(item) => item.sign}
            showsVerticalScrollIndicator={false}
            scrollEnabled
            contentContainerStyle={{ paddingBottom: 150, paddingTop: 10 }}
            style={{ marginVertical: 10 }}
          />
        </>} */}
    </View>
  )
}

export default GuideScreen