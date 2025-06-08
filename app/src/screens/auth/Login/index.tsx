import { ContainerButton, CustomButton, FloatingLabelInput, ForgotPassword } from '@components'
import { useSignInWithEmail } from '@hooks'
import { useTheme, useToast } from '@providers'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import '../../../utils/i18n'
import styles from './styles'
const Login = () => {
  const { theme, colors, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { showToast } = useToast()
  const { signIn } = useSignInWithEmail()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
    general: '',
  })
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(prev => ({ ...prev, email: '', password: '', general: '' }));
      
      const userCredential = await signIn(email, password);
      
      if (userCredential?.user?.emailVerified) {
        router.replace('/src/screens/main/home');
      }
    } catch (error: any) {
      if (error === 'auth/email-not-verified') {
        showToast(t('auth.auth/email-not-verified'), 'error');
        return;
      }

      const errorKey = `auth.${JSON.stringify(error.code).replace(/["]/g, '')}`;
      const errorMsg = t(errorKey);

      if (error.code?.includes('email')) {
        setErrorMessage(prev => ({ ...prev, email: errorMsg }));
      } else if (error.code?.includes('password')) {
        setErrorMessage(prev => ({ ...prev, password: errorMsg }));
      } else {
        setErrorMessage(prev => ({ ...prev, general: errorMsg }));
        showToast(errorMsg, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
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
        <CustomButton
          title="Login"
          onPress={handleSignIn}
          variant="primary"
          size="medium"
          leftIcon="enter"
          loading={isLoading}
        />
        <ForgotPassword title="Şifremi unuttum" />
        <View style={styles.socialMediaContainer}>
          <ContainerButton
            title="Google ile Giriş Yap"
            onPress={() => {}}
            variant="primary"
            size="medium"
            leftImage={require('@assets/image/google.png')}
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
    </Animated.View>
  )
}

export default Login