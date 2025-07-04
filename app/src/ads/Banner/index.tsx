import Animated from 'react-native'
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads'

const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-2363017162977044/9239804966'
interface BannerProps {
  adType?: 'banner' | 'interstitial'
}

export default function BannerExample({ adType = 'banner' }: BannerProps) {
  return (
    <Animated.View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <BannerAd
      unitId={adUnitId}
      size={adType === 'banner' ? BannerAdSize.ANCHORED_ADAPTIVE_BANNER : BannerAdSize.INLINE_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
    </Animated.View>
  )
}
