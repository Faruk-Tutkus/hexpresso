import { useEffect } from 'react'
import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads'

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-2363017162977044/9643129643'
const interstitial = InterstitialAd.createForAdRequest(adUnitId)

export default function Interstitial() {
  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      interstitial.show()
    })

    interstitial.load()

    return () => unsubscribe()
  }, [])
}
