import { Banner } from '@ads'
import { db } from '@api/config.firebase'
import Icon from '@assets/icons'
import { Modal as AppModal, Container, CustomButton } from '@components'
import { useDailyNotificationManager } from '@hooks'
import { useAuth, useTheme, useToast } from '@providers'
import { router } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { MMKV } from 'react-native-mmkv'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import styles from './styles'

const SettingsScreen = () => {
  const { isDark, toggleTheme, colors } = useTheme()
  const { user } = useAuth()
  const [modalVisible, setModalVisible] = useState(false)
  const { showToast } = useToast()
  const { 
    enableDailyNotifications, 
    disableDailyNotifications, 
    getScheduledDailyNotifications,
    hasUserDisabledNotifications,
    requestPermissions 
  } = useDailyNotificationManager()
  
  // Daily notification state
  const [dailyNotificationsEnabled, setDailyNotificationsEnabled] = useState(false)
  const [scheduledNotificationsCount, setScheduledNotificationsCount] = useState(0)
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  // Load daily notification status on mount
  useEffect(() => {
    const loadNotificationStatus = async () => {
      try {
        // Check if user has explicitly disabled notifications
        const userDisabled = hasUserDisabledNotifications();
        
        if (userDisabled) {
          setDailyNotificationsEnabled(false);
          setScheduledNotificationsCount(0);
          console.log('🔕 User has disabled daily notifications');
          return;
        }

        // Check for scheduled notifications
        const notifications = await getScheduledDailyNotifications();
        setScheduledNotificationsCount(notifications.length);
        setDailyNotificationsEnabled(notifications.length > 0);
        
        console.log(`📱 Notification status: ${notifications.length > 0 ? 'enabled' : 'disabled'} (${notifications.length} scheduled)`);
      } catch (error) {
        console.error('Error loading notification status:', error);
      }
    }
    
    loadNotificationStatus()
  }, [hasUserDisabledNotifications, getScheduledDailyNotifications])

  const handleDeleteAccount = async () => {
    if (!user) return
    try {
      await deleteDoc(doc(db, 'users', user.uid))
      const storage = new MMKV({ id: 'signs_data' })
      storage.clearAll()
      showToast('Hesabınız başarıyla silindi.', 'success')
      router.push('/src/screens/side/StartScreen')
      setModalVisible(false)
    } catch (error) {
      console.error('Error deleting account:', error)
      showToast('Hesap silinirken bir hata oluştu.', 'error')
    }
  }

  const handleDailyNotificationToggle = async (enabled: boolean) => {
    setLoadingNotifications(true)
    try {
      if (enabled) {
        console.log('🔛 Enabling daily notifications...')
        showToast('Günlük bildirimler etkinleştiriliyor...', 'info')
        
        const success = await enableDailyNotifications()
        if (success) {
          const notifications = await getScheduledDailyNotifications()
          setScheduledNotificationsCount(notifications.length)
          setDailyNotificationsEnabled(true)
          showToast(`Günlük bildirimler etkinleştirildi! ${notifications.length} bildirim zamanlandı.`, 'success')
          console.log('✅ Daily notifications enabled successfully')
        } else {
          showToast('Günlük bildirimler etkinleştirilemedi. Lütfen bildirim izinlerini kontrol edin.', 'error')
        }
      } else {
        console.log('🔕 Disabling daily notifications...')
        showToast('Günlük bildirimler devre dışı bırakılıyor...', 'info')
        
        const success = await disableDailyNotifications()
        if (success) {
          setScheduledNotificationsCount(0)
          setDailyNotificationsEnabled(false)
          showToast('Günlük bildirimler devre dışı bırakıldı. Ayarlardan tekrar etkinleştirebilirsiniz.', 'success')
          console.log('✅ Daily notifications disabled successfully')
        } else {
          showToast('Günlük bildirimler devre dışı bırakılamadı.', 'error')
        }
      }
    } catch (error) {
      console.error('Error toggling daily notifications:', error)
      showToast('Bildirim ayarları değiştirilemedi.', 'error')
    } finally {
      setLoadingNotifications(false)
    }
  }

  /* ----------- Modern Switch Component ------------ */
  const ModernSwitch = ({ value, onValueChange, disabled }: { value: boolean; onValueChange: (val: boolean) => void; disabled?: boolean }) => {
    const translate = useSharedValue(value ? 1 : 0)
    const scale = useSharedValue(1)

    // Animate when value changes
    React.useEffect(() => {
      translate.value = withTiming(value ? 1 : 0, { duration: 250 })
    }, [value])

    const trackStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          translate.value, 
          [0, 1], 
          [colors.secondaryText + '40', colors.primary]
        ),
        opacity: disabled ? 0.6 : 1,
      }
    })

    const thumbStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: withTiming(translate.value * 24, { duration: 250 }) },
          { scale: scale.value }
        ],
      }
    })

    const handlePress = () => {
      if (disabled) return
      scale.value = withTiming(0.9, { duration: 100 }, () => {
        scale.value = withTiming(1, { duration: 100 })
      })
      onValueChange(!value)
    }

    return (
      <Pressable onPress={handlePress} style={styles.switchContainer}>
        <Animated.View style={[styles.switchTrack, trackStyle]}>
          <Animated.View style={[
            styles.switchThumb, 
            { backgroundColor: colors.background },
            thumbStyle
          ]} />
        </Animated.View>
      </Pressable>
    )
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Theme Section */}
      <Container>
        <View style={styles.row}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon
              name={isDark ? 'moon' : 'sunny'}
              size={24}
              color={colors.text}
            />
            <Text style={[styles.label, { color: colors.text }]}>Tema</Text>
          </View>
          <ModernSwitch value={isDark} onValueChange={toggleTheme} />
        </View>
      </Container>

      {/* Daily Notifications Section */}
      <Container>
        <View style={styles.row}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Bildirimler</Text>
          <ModernSwitch 
            value={dailyNotificationsEnabled} 
            onValueChange={handleDailyNotificationToggle}
            disabled={loadingNotifications}
          />
        </View>
        
        <View style={[styles.notificationInfo, { backgroundColor: colors.surface }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12}}>
            <View style={[styles.iconContainer]}>
              <Icon
                name="notifications"
                size={22}
                color={colors.text}
              />
            </View>
            <View style={{ width: '80%' }}>
              <Text style={[styles.label, { color: colors.text }]}>Günlük Hatırlatmalar</Text>
              <Text style={[styles.sublabel, { color: colors.secondaryText }]}>
                Her gün saat 18:00'da motivasyon mesajları alın
              </Text>
            </View>
          </View>

          {/* Notification Status */}
          {dailyNotificationsEnabled && (
            <View style={[styles.notificationStatus]}>
              <Icon name="calendar" size={16} color={colors.text} />
              <Text style={[styles.statusText, { color: colors.text }]}>
                {scheduledNotificationsCount > 0 
                  ? `${scheduledNotificationsCount} bildirim zamanlandı` 
                  : 'Bildirimler zamanlanıyor...'}
              </Text>
            </View>
          )}

          {/* Loading indicator */}
          {loadingNotifications && (
            <View style={[styles.loadingIndicator, { backgroundColor: colors.primary + '10' }]}>
              <Text style={[styles.loadingText, { color: colors.primary }]}>
                📱 Bildirim ayarları güncelleniyor...
              </Text>
            </View>
          )}
        </View>
      </Container>

      {/* Account Section */}
      <Container style={styles.deleteContainer}>
        <CustomButton
          title="Hesabımı Sil"
          variant="secondary"
          leftIcon="trash"
          onPress={() => setModalVisible(true)}
        />
      </Container>
      <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Banner adType='interstitial' />
      </View>
      {/* Confirm Deletion Modal */}
      <AppModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleDeleteAccount}
        title="Hesabınızı Silin"
        message="Bu işlem geri alınamaz. Devam etmek istediğinize emin misiniz?"
        confirmText="Sil"
        cancelText="Vazgeç"
        iconName="trash"
      />
    </ScrollView>
  )
}

export default SettingsScreen
