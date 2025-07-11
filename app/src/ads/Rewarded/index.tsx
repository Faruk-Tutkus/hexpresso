import { db } from '@api/config.firebase'
import { CustomButton } from '@components'
import { useAuth, useTheme, useToast } from '@providers'
import { doc, increment, updateDoc } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Image, Text, View } from 'react-native'
import { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads'
import styles from './styles'
const adUnitId_high = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2363017162977044/6422069939'
const adUnitId_medium = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2363017162977044/5975347378'
const adUnitId_low = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2363017162977044/1241330791'

interface RewardedProps {
  onReward?: (reward: any) => void
  onError?: (error: any) => void
  onAdLoaded?: () => void
  rewardedType?: 'high' | 'medium' | 'low'
}

export default function Rewarded({
  onReward,
  onError,
  onAdLoaded,
  rewardedType = 'high',
}: RewardedProps) {
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const rewarded_high = useMemo(() => RewardedAd.createForAdRequest(adUnitId_high), [])
  const rewarded_medium = useMemo(() => RewardedAd.createForAdRequest(adUnitId_medium), [])
  const rewarded_low = useMemo(() => RewardedAd.createForAdRequest(adUnitId_low), [])
  const [rewardAmount, setRewardAmount] = useState(rewardedType === 'high' ? 40 : rewardedType === 'medium' ? 20 : 10)
  const [rewardText, setRewardText] = useState('coin')
  const { colors } = useTheme()
  const { showToast } = useToast();

  const user = useAuth();
  const userRef = doc(db, 'users', user.user?.uid || '');
  const rewarded = rewardedType === 'high' ? rewarded_high : rewardedType === 'medium' ? rewarded_medium : rewarded_low
  useEffect(() => {
    const loadListener = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('Reklam yüklendi')
      setLoaded(true)
      setLoading(false)
      onAdLoaded && onAdLoaded()
    })

    const rewardListener = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
      console.log('Ödül alındı:', reward)
      showToast('Ödül alındı', 'success')
      setRewardAmount(reward.amount)
      setRewardText(reward.type)
      console.log(reward.amount, reward.type)
      updateDoc(userRef, {
        coins: increment(reward.amount)
      });
      onReward && onReward(reward)
    })

    const closedListener = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Reklam kapatıldı, yeni reklam yükleniyor...')
      setLoaded(false)
      setLoading(true)
      rewarded.load() // Sonraki reklam için tekrar yükle
    })

    const errorListener = rewarded.addAdEventListener(AdEventType.ERROR, error => {
      //showToast('Reklam yüklenemedi', 'error')
      console.log('Reklam yüklenirken bir hata oluştu', error)
      setLoading(false)
      setLoaded(false)
      onError && onError(error)
    })

    rewarded.load()

    return () => {
      loadListener()
      rewardListener()
      errorListener()
      closedListener()
    }
  }, [onReward, onError, onAdLoaded])

  const showAd = useCallback(() => {
    if (loaded) {
      setLoaded(false) // Reklamı göstermeden önce butonunu deaktif et
      rewarded.show()
    }
  }, [loaded])
  return (
    <View style={[styles.container, { backgroundColor: colors.surface + '15', borderColor: colors.border }]}>
      <View style={styles.content}>
        <View style={styles.rewardInfo}>
          <Image
            source={rewardedType === 'high' ? require('@assets/image/coin_three.png') : rewardedType === 'medium' ? require('@assets/image/coin_two.png') : require('@assets/image/coin_one.png')}
            style={styles.coinImage}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={[styles.rewardTitle, { color: colors.text }]}>
              Reklam Ödülü
            </Text>
            <Text style={[styles.rewardAmount, { color: colors.primary }]}>
              +{rewardAmount} {rewardText}
            </Text>
            <Text style={[styles.rewardDescription, { color: colors.secondaryText }]}>
              Reklamı izleyerek ödül kazan
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
                Reklam yükleniyor...
              </Text>
            </View>
          ) : (
            <CustomButton
              title={loaded ? "Reklamı İzle" : "Reklam Yok"}
              onPress={showAd}
              disabled={!loaded}
              leftIcon="play-circle"
              variant="primary"
              size="medium"
              contentStyle={styles.button}
            />
          )}
        </View>
      </View>
    </View>
  )
}
