import { Banner, useInterstitial } from '@ads';
import { AskAI, HoroscopeCard } from '@components';
import { useFetchData } from '@hooks';
import { useAuth, useTheme } from '@providers';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

enum numSign {
  Aries = 0,
  Taurus = 1,
  Gemini = 2,
  Cancer = 3,
  Leo = 4,
  Virgo = 5,
  Libra = 6,
  Scorpio = 7,
  Sagittarius = 8,
  Capricorn = 9,
  Aquarius = 10,
  Pisces = 11,
}

const GuideScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  
  // FetchSeers ile aynı hook yapısı
  const { signs, loading, error, refetch } = useFetchData(user);

  const { showInterstitial } = useInterstitial({})

  // Ultra-fast navigation - only pass index
  const navigateToSignDetail = (signIndex: number) => {
    router.push({
      pathname: '/src/screens/main/navigator/(tabs)/Signs',
      params: {
        signIndex: signIndex.toString()
      }
    });
  };

  const data = loading ? [] : [
    { sign: t('horoscope.aries'), date: signs[numSign.Aries]?.info?.dates, image: require('@assets/image/aries.svg'), index: numSign.Aries },
    { sign: t('horoscope.taurus'), date: signs[numSign.Taurus]?.info?.dates, image: require('@assets/image/taurus.svg'), index: numSign.Taurus },
    { sign: t('horoscope.gemini'), date: signs[numSign.Gemini]?.info?.dates, image: require('@assets/image/gemini.svg'), index: numSign.Gemini },
    { sign: t('horoscope.cancer'), date: signs[numSign.Cancer]?.info?.dates, image: require('@assets/image/cancer.svg'), index: numSign.Cancer },
    { sign: t('horoscope.leo'), date: signs[numSign.Leo]?.info?.dates, image: require('@assets/image/leo.svg'), index: numSign.Leo },
    { sign: t('horoscope.virgo'), date: signs[numSign.Virgo]?.info?.dates, image: require('@assets/image/virgo.svg'), index: numSign.Virgo },
    { sign: t('horoscope.libra'), date: signs[numSign.Libra]?.info?.dates, image: require('@assets/image/libra.svg'), index: numSign.Libra },
    { sign: t('horoscope.scorpio'), date: signs[numSign.Scorpio]?.info?.dates, image: require('@assets/image/scorpio.svg'), index: numSign.Scorpio },
    { sign: t('horoscope.sagittarius'), date: signs[numSign.Sagittarius]?.info?.dates, image: require('@assets/image/sagittarius.svg'), index: numSign.Sagittarius },
    { sign: t('horoscope.capricorn'), date: signs[numSign.Capricorn]?.info?.dates, image: require('@assets/image/capricorn.svg'), index: numSign.Capricorn },
    { sign: t('horoscope.aquarius'), date: signs[numSign.Aquarius]?.info?.dates, image: require('@assets/image/aquarius.svg'), index: numSign.Aquarius },
    { sign: t('horoscope.pisces'), date: signs[numSign.Pisces]?.info?.dates, image: require('@assets/image/pisces.svg'), index: numSign.Pisces },
  ]

  return (
    <View>
      {loading ? <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.text} />
        <Text style={{ color: colors.text, fontSize: 16, fontFamily: 'Domine-Regular', textAlign: 'center', marginTop: 10 }}>Yıldızlardan mesaj bekleniyor...</Text>
      </View> :
        <>
          <FlatList
            ListHeaderComponent={
              <>
                <AskAI type="sign" />
                <Banner adType='banner' />
              </>
            }
            data={data}
            renderItem={({ item }) => <HoroscopeCard sign={item.sign} date={item.date} image={item.image} onPress={() => {
              showInterstitial()
              setTimeout(() => {
                navigateToSignDetail(item.index)
              }, 3000)
            }} />}
            keyExtractor={(item) => item.sign}
            showsVerticalScrollIndicator={false}
            scrollEnabled
            contentContainerStyle={{ paddingBottom: 60 }}
            // Performance optimizations
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
            // Pull-to-refresh functionality
            refreshing={loading}
            onRefresh={refetch}
          />
        </>}
    </View>
  )
}

export default GuideScreen