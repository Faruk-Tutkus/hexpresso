import { db } from '@api/config.firebase'
import Icon from '@assets/icons'
import { Modal as AppModal, Container, CustomButton } from '@components'
import { useAuth, useTheme, useToast } from '@providers'
import { router } from 'expo-router'
import { deleteDoc, doc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { MMKV } from 'react-native-mmkv'
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import styles from './styles'

const SettingsScreen = () => {
  const { isDark, toggleTheme, colors } = useTheme()
  const { user } = useAuth()
  const [modalVisible, setModalVisible] = useState(false)
  const { showToast } = useToast()
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

  /* ----------- Modern Switch Component ------------ */
  const ModernSwitch = ({ value, onValueChange }: { value: boolean; onValueChange: (val: boolean) => void }) => {
    const translate = useSharedValue(value ? 1 : 0)

    // Animate when value changes
    React.useEffect(() => {
      translate.value = withTiming(value ? 1 : 0, { duration: 200 })
    }, [value])

    const trackStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(translate.value, [0, 1], [colors.background, colors.background]),
      }
    })

    const thumbStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: withTiming(translate.value * 22) }],
      }
    })

    return (
      <Pressable onPress={() => onValueChange(!value)}>
        <Animated.View style={[styles.switchTrack, trackStyle]}>
          <Animated.View style={[styles.switchThumb, { backgroundColor: colors.primary }, thumbStyle]} />
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

      {/* Account Section */}
      <Container style={styles.deleteContainer}>
        <Text style={[styles.sectionTitle, { color: colors.errorText }]}>Hesap</Text>
        <CustomButton
          title="Hesabımı Sil"
          variant="secondary"
          leftIcon="trash"
          onPress={() => setModalVisible(true)}
        />
      </Container>

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
