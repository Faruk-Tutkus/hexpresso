import Icon from '@assets/icons';
import { CustomButton } from '@components';
import { useTheme, useToast } from '@providers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import styles from './styles';

const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-2363017162977044/8007997233'; // Yeni reklam ID'si

interface SpeedUpRewardProps {
  onSpeedUpSuccess?: () => void;
  onError?: (error: any) => void;
  remainingMinutes: number;
  disabled?: boolean;
}

export default function SpeedUpReward({
  onSpeedUpSuccess,
  onError,
  remainingMinutes,
  disabled = false,
}: SpeedUpRewardProps) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isShowing, setIsShowing] = useState(false);
  const rewarded = useMemo(() => RewardedAd.createForAdRequest(adUnitId), []);
  const { colors } = useTheme();
  const { showToast } = useToast();

  useEffect(() => {
    const loadListener = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      console.log('SpeedUp reklam yüklendi');
      setLoaded(true);
      setLoading(false);
    });

    const rewardListener = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      console.log('SpeedUp ödül alındı');
      showToast('Falınız 120 saniye hızlandırıldı!⚡', 'success');
      onSpeedUpSuccess && onSpeedUpSuccess();
    });

    const closedListener = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('SpeedUp reklam kapatıldı');
      setIsShowing(false);
      setLoaded(false);
      setLoading(true);
      // Yeni reklam yükle
      rewarded.load();
    });

    const errorListener = rewarded.addAdEventListener(AdEventType.ERROR, error => {
      console.log('SpeedUp reklam hatası:', error);
      //showToast('Reklam yüklenemedi', 'error');
      setLoading(false);
      setLoaded(false);
      setIsShowing(false);
      onError && onError(error);
    });

    // İlk reklam yükleme
    rewarded.load();

    return () => {
      loadListener();
      rewardListener();
      errorListener();
      closedListener();
    };
  }, [onSpeedUpSuccess, onError]);

  const showAd = useCallback(() => {
    if (loaded && !isShowing) {
      setIsShowing(true);
      setLoaded(false);
      rewarded.show();
    }
  }, [loaded, isShowing]);

  // Süre 5 dakikadan azsa reklam gösterme
  if (remainingMinutes < 5) {
    return null;
  }

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.secondary + '15', 
      borderColor: colors.secondary 
    }]}>
      <View style={styles.content}>
        <View style={styles.speedUpInfo}>
          <View style={[styles.iconContainer, { backgroundColor: colors.secondary }]}>
            <Icon name="flash" size={24} color={colors.background} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.speedUpTitle, { color: colors.text }]}>
              Hızlandır ⚡
            </Text>
            <Text style={[styles.speedUpDescription, { color: colors.secondaryText }]}>
              Reklamı izleyerek falınızı 120 saniye hızlandırın
            </Text>
            <Text style={[styles.remainingTime, { color: colors.secondary }]}>
              Kalan süre: {remainingMinutes} dakika
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.secondary} />
              <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
                Hazırlanıyor...
              </Text>
            </View>
          ) : (
            <CustomButton
              title={loaded && !disabled && !isShowing ? "Hızlandır" : "Reklam Yok"}
              onPress={showAd}
              disabled={!loaded || disabled || isShowing}
              leftIcon="flash"
              variant="secondary"
              size="small"
              contentStyle={[styles.button, {
                opacity: (!loaded || disabled || isShowing) ? 0.5 : 1,
                justifyContent: 'center',
                alignSelf: 'center',
              }]}
            />
          )}
        </View>
      </View>
    </View>
  );
} 