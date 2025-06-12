import { ContainerButton, CustomButton, FloatingLabelInput } from '@components'
import { useSignInWithGoogle, useSignUpWithEmail } from '@hooks'
import { useTheme, useToast } from '@providers'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import '../../../utils/i18n'
import styles from './styles'
const Register = () => {
  const { theme, colors, toggleTheme } = useTheme()
  const { name } = useLocalSearchParams()
  const [displayName, setDisplayName] = useState(name)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const { t } = useTranslation()
  const { showToast } = useToast()
  const { signInGoogle } = useSignInWithGoogle()
  const { signUp, loading } = useSignUpWithEmail()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
    general: '',
    displayName: '',
  })

  const validation = () => {
    if (password !== rePassword) {
      setErrorMessage(prev => ({ ...prev, password: t('auth.auth/password-not-match') }))
      return false
    }
    return true
  }
  
  const handleSignUp = async () => {
    try {
      setIsLoading(true)
      // Reset error messages first
      setErrorMessage(prev => ({ ...prev, email: '', password: '', general: '', displayName: '' }))

      // Validate after resetting errors
      if (!validation()) {
        return
      }
      
      const userCredential = await signUp(email, password, displayName as string)
      if (userCredential) {
        showToast("Dogrulama linki gonderildi", 'success')
        router.replace({pathname: '/src/screens/auth/Login', params: {
          email: email,
          password: password,
          displayName: displayName,
        }})
      } else {
        showToast("Bir hata oluştu", 'error')
      }
    } catch (error: any) {
      if (error) {
        const errorKey = `auth.${JSON.stringify(error.code).replace(/["]/g, '')}`
        const errorMsg = t(errorKey)
        if (error.code.includes('email')) {
          setErrorMessage(prev => ({ ...prev, email: errorMsg }))
        } else if (error.code.includes('password')) {
          setErrorMessage(prev => ({ ...prev, password: errorMsg }))
        } else {
          setErrorMessage(prev => ({ ...prev, general: errorMsg }))
        }
      }
    } finally {
      setIsLoading(false)
    }
  }
  const handleSignInGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signInGoogle();
      console.log(result.newUser);
      if (result.user) {
        if (result.newUser) {
          router.replace('/src/screens/side/Introduction');
        } else {
          router.replace('/src/screens/main/HomeScreen');
        }
      }
    } catch (error: any) {
      console.log(error);
      showToast(t('auth.google-sign-in-error'), 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <FloatingLabelInput
          placeholder="Name"
          value={displayName as string}
          onChangeText={setDisplayName}
          leftIcon="person"
          type="text"
          error={errorMessage.displayName}
        />
        <FloatingLabelInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail"
          type="email"
          error={errorMessage.email}
        />
        <FloatingLabelInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          leftIcon="lock-closed"
          isPassword={true}
          type="password"
          error={errorMessage.password}
        />
        <FloatingLabelInput
          placeholder="rePassword"
          value={rePassword}
          onChangeText={setRePassword}
          leftIcon="lock-closed"
          isPassword={true}
          type="password"
          error={errorMessage.password}
        />
        <CustomButton
          title="Kayıt Ol"
          onPress={handleSignUp}
          variant="primary"
          size="medium"
          leftIcon="enter"
          loading={isLoading}
        />
        <View style={styles.socialMediaContainer}>
          <ContainerButton
            title="Google ile Giriş Yap"
            onPress={handleSignInGoogle}
            variant="primary"
            size="medium"
            leftImage={require('@assets/image/google.png')}
            loading={isGoogleLoading}
          />
          <ContainerButton
            title="Facebook ile Giriş Yap"
            onPress={() => {}}
            variant="primary"
            size="medium"
            leftImage={require('@assets/image/facebook.png')}
          />
          <ContainerButton
            title="Apple ile Giriş Yap"
            onPress={() => {}}
            variant="primary"
            size="medium"
            leftImage={require('@assets/image/apple.png')}
          />
        </View>
      </View>
    </View>
  )
}

export default Register