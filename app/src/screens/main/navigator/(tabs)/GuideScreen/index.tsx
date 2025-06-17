import { AskAI, HoroscopeCard } from '@components';
import { useTheme } from '@providers';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, View } from 'react-native';
import loadCache from 'src/hooks/LoadCache';

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
  const { t } = useTranslation();
  const [signs, setSigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadCache({ id: 'signs_data', setSigns, setLoading });
  }, [])
  const data = loading ? [] : [
    { sign: t('horoscope.aquarius'), date: signs[numSign.Aquarius].info.dates, image: require('@assets/image/aquarius.svg') },
    { sign: t('horoscope.aries'), date: signs[numSign.Aries].info.dates, image: require('@assets/image/aries.svg') },
    { sign: t('horoscope.cancer'), date: signs[numSign.Cancer].info.dates, image: require('@assets/image/cancer.svg') },
    { sign: t('horoscope.capricorn'), date: signs[numSign.Capricorn].info.dates, image: require('@assets/image/capricorn.svg') },
    { sign: t('horoscope.gemini'), date: signs[numSign.Gemini].info.dates, image: require('@assets/image/gemini.svg') },
    { sign: t('horoscope.leo'), date: signs[numSign.Leo].info.dates, image: require('@assets/image/leo.svg') },
    { sign: t('horoscope.libra'), date: signs[numSign.Libra].info.dates, image: require('@assets/image/libra.svg') },
    { sign: t('horoscope.pisces'), date: signs[numSign.Pisces].info.dates, image: require('@assets/image/pisces.svg') },
    { sign: t('horoscope.sagittarius'), date: signs[numSign.Sagittarius].info.dates, image: require('@assets/image/sagittarius.svg') },
    { sign: t('horoscope.scorpio'), date: signs[numSign.Scorpio].info.dates, image: require('@assets/image/scorpio.svg') },
    { sign: t('horoscope.taurus'), date: signs[numSign.Taurus].info.dates, image: require('@assets/image/taurus.svg') },
    { sign: t('horoscope.virgo'), date: signs[numSign.Virgo].info.dates, image: require('@assets/image/virgo.svg') },
  ]
  return (
    <View>
      {loading ? <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
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
            contentContainerStyle={{ paddingBottom: 200, paddingTop: 10 }}
            style={{ marginVertical: 10 }}
          />
        </>}
    </View>
  )
}

export default GuideScreen