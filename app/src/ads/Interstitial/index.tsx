import { useToast } from '@providers'
import { useCallback, useEffect, useRef } from 'react'
import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads'

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-2363017162977044/9643129643'

interface InterstitialOptions {
  onAdClosed?: () => void
  onAdError?: (error: any) => void
  onAdLoaded?: () => void
}

export const useInterstitial = (options?: InterstitialOptions) => {
  const interstitialRef = useRef<InterstitialAd | null>(null)
  const { showToast } = useToast()
  const isLoadingRef = useRef(false)

  const {
    onAdClosed,
    onAdError,
    onAdLoaded
  } = options || {}

  // Reklam instance'ını oluştur
  useEffect(() => {
    if (!interstitialRef.current) {
      interstitialRef.current = InterstitialAd.createForAdRequest(adUnitId)
    }
  }, [])

  const showInterstitial = useCallback(() => {
    const interstitial = interstitialRef.current
    if (!interstitial || isLoadingRef.current) return

    isLoadingRef.current = true
    showToast('Reklam yükleniyor...', 'success')

    const loadListener = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial reklam yüklendi ve gösteriliyor')
      isLoadingRef.current = false
      onAdLoaded && onAdLoaded()
      interstitial.show()
    })

    const closedListener = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial reklam kapatıldı')
      onAdClosed && onAdClosed()
      // Cleanup listeners
      loadListener()
      closedListener()
      errorListener()
      
      // Yeni reklam için hazırla
      interstitialRef.current = InterstitialAd.createForAdRequest(adUnitId)
    })

    const errorListener = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('Interstitial reklam hatası:', error)
      isLoadingRef.current = false
      showToast('Reklam yüklenemedi', 'error')
      onAdError && onAdError(error)

      // Cleanup listeners
      loadListener()
      closedListener()
      errorListener()
      
      
      // Yeni reklam için hazırla
      interstitialRef.current = InterstitialAd.createForAdRequest(adUnitId)
    })

    // Reklamı yükle
    interstitial.load()
  }, [onAdClosed, onAdError, onAdLoaded, showToast])

  return {
    showInterstitial,
    isLoading: isLoadingRef.current
  }
}
