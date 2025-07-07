import { CustomButton, FloatingLabelInput, UnderLineText } from '@components'
import { useSendPasswordReset } from '@hooks'
import { useTheme, useToast } from '@providers'
import { router } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import styles from './styles'

const ForgotPassword = () => {
  const { colors } = useTheme()
  const { showToast } = useToast()
  const { sendPasswordReset, loading, success } = useSendPasswordReset()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handlePasswordReset = async () => {
    try {
      // Reset error message
      setErrorMessage('')

      // Validate email
      if (!email.trim()) {
        setErrorMessage(t('auth.auth/missing-email'))
        return
      }

      if (!validateEmail(email)) {
        setErrorMessage(t('auth.auth/invalid-email'))
        return
      }

      const result = await sendPasswordReset(email)
      
      if (result) {
        setEmailSent(true)
        showToast('Şifre sıfırlama e-postası gönderildi. E-posta kutunuzu kontrol ediniz.', 'success')
      }
    } catch (error: any) {
      const errorKey = `auth.${JSON.stringify(error.code).replace(/["]/g, '')}`
      const errorMsg = t(errorKey)
      
      if (error.code === 'auth/user-not-found') {
        setErrorMessage(t('auth.auth/user-not-found'))
      } else if (error.code?.includes('email')) {
        setErrorMessage(errorMsg)
      } else {
        setErrorMessage(errorMsg)
        showToast(errorMsg, 'error')
      }
    }
  }

  const handleBackToLogin = () => {
    router.back()
  }

  if (emailSent) {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={styles.successContainer}>
            <Text style={[styles.successTitle, { color: colors.primary }]}>
              E-posta Gönderildi
            </Text>
            <Text style={[styles.successMessage, { color: colors.text }]}>
              {email} adresine şifre sıfırlama bağlantısı gönderildi. E-posta kutunuzu kontrol ediniz.
            </Text>
            <Text style={[styles.successNote, { color: colors.secondaryText }]}>
              E-postayı görmüyorsanız spam klasörünü kontrol etmeyi unutmayın.
            </Text>
          </View>
          <CustomButton
            title="Giriş Sayfasına Dön"
            onPress={handleBackToLogin}
            variant="primary"
            size="medium"
            leftIcon="arrow-back"
          />
        </View>
      </Animated.View>
    )
  }

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Şifremi Unuttum
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            E-posta adresinizi girin, şifre sıfırlama bağlantısını size gönderelim.
          </Text>
        </View>

        <FloatingLabelInput
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail"
          type="email"
          error={errorMessage}
        />

        <CustomButton
          title="Şifre Sıfırlama E-postası Gönder"
          onPress={handlePasswordReset}
          variant="primary"
          size="medium"
          leftIcon="mail"
          loading={loading}
          contentStyle={{ width: '80%' }}
        />

        <UnderLineText 
          title="Giriş sayfasına dön" 
          route="/src/screens/auth/Login" 
          contentStyle={{ marginTop: 20 }}
        />
      </View>
    </Animated.View>
  )
}

export default ForgotPassword