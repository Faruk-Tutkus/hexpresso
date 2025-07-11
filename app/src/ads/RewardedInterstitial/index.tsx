import { db } from '@api/config.firebase'
import { CustomButton } from '@components'
import { useAuth, useTheme, useToast } from '@providers'
import { doc, increment, updateDoc } from 'firebase/firestore'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Image, Text, View } from 'react-native'
import { AdEventType, RewardedAdEventType, RewardedInterstitialAd, TestIds } from 'react-native-google-mobile-ads'
import styles from './styles'

const adUnitId_high = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : 'ca-app-pub-2363017162977044/9004001245'
const adUnitId_medium = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : 'ca-app-pub-2363017162977044/6482049185'
const adUnitId_low = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : 'ca-app-pub-2363017162977044/1229722507'

interface RewardedInterstitialProps {
  onReward?: (reward: any) => void
  onError?: (error: any) => void
  onAdLoaded?: () => void
  rewardedType?: 'high' | 'medium' | 'low'
}

export default function RewardedInterstitial({
  onReward,
  onError,
  onAdLoaded,
  rewardedType = 'high',
}: RewardedInterstitialProps) {
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const rewarded_high = useMemo(() => RewardedInterstitialAd.createForAdRequest(adUnitId_high), [])
  const rewarded_medium = useMemo(() => RewardedInterstitialAd.createForAdRequest(adUnitId_medium), [])
  const rewarded_low = useMemo(() => RewardedInterstitialAd.createForAdRequest(adUnitId_low), [])
  const [rewardAmount, setRewardAmount] = useState(rewardedType === 'high' ? 40 : rewardedType === 'medium' ? 20 : 10)
  const [rewardText, setRewardText] = useState('coin')
  const { colors } = useTheme()
  const { showToast } = useToast()

  const user = useAuth()
  const userRef = doc(db, 'users', user.user?.uid || '')
  const rewarded = rewardedType === 'high' ? rewarded_high : rewardedType === 'medium' ? rewarded_medium : rewarded_low

  useEffect(() => {
    const loadListener = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('RewardedInterstitial reklam yüklendi')
      setLoaded(true)
      setLoading(false)
      onAdLoaded && onAdLoaded()
    })

    const rewardListener = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
      console.log('RewardedInterstitial ödül alındı:', reward)
      showToast('Bonus ödül alındı!', 'success')
      setRewardAmount(reward.amount)
      setRewardText(reward.type)
      updateDoc(userRef, {
        coins: increment(reward.amount)
      })
      onReward && onReward(reward)
    })

    const closedListener = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('RewardedInterstitial reklam kapatıldı, yeni reklam yükleniyor...')
      //showToast('Reklam kapatıldı, ödül kazanamadınız', 'error')
      setLoaded(false)
      setLoading(true)
      rewarded.load() // Sonraki reklam için tekrar yükle
    })

    const errorListener = rewarded.addAdEventListener(AdEventType.ERROR, error => {
      //showToast('Reklam yüklenemedi', 'error')
      console.log('RewardedInterstitial reklam yüklenirken bir hata oluştu', error)
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
  }, [onReward, onError, onAdLoaded, rewardedType])

  const showAd = useCallback(() => {
    if (loaded) {
      setLoaded(false) // Reklamı göstermeden önce butonunu deaktif et
      rewarded.show()
    }
  }, [loaded])


  const displayRewardAmount = rewardAmount


  return (
    <View style={[styles.container, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
      <View style={styles.content}>
        <View style={styles.rewardInfo}>
          <Image
            source={rewardedType === 'high' ? require('@assets/image/coin_three.png') : rewardedType === 'medium' ? require('@assets/image/coin_two.png') : require('@assets/image/coin_one.png')}
            style={styles.coinImage}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={[styles.rewardTitle, { color: colors.text }]}>
              Bonus Reklam Ödülü
            </Text>
            <Text style={[styles.rewardAmount, { color: colors.primary }]}>
              +{displayRewardAmount} {rewardText}
            </Text>
            <Text style={[styles.rewardDescription, { color: colors.secondaryText }]}>
              Tam ekran reklamı izleyerek bonus ödül kazan
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
                Bonus reklam yükleniyor...
              </Text>
            </View>
          ) : (
            <CustomButton
              title={loaded ? "Bonus Reklamı İzle" : "Reklam Yok"}
              onPress={showAd}
              disabled={!loaded}
              leftIcon="tv"
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
