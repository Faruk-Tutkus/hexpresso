import { ContainerButton, CustomButton, FloatingLabelInput, UnderLineText } from '@components'
import { useFetchData, useFetchSeers, useSignInWithApple, useSignInWithEmail, useSignInWithFacebook, useSignInWithGoogle } from '@hooks'
import { useAuth, useTheme, useToast } from '@providers'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import styles from './styles'
const Login = () => {
  const { colors } = useTheme()
  const { email: emailParam, password: passwordParam, displayName: displayNameParam } = useLocalSearchParams()
  const [email, setEmail] = useState(emailParam as string)
  const [password, setPassword] = useState(passwordParam as string)
  const { user } = useAuth()
  const { showToast } = useToast()
  const { signIn } = useSignInWithEmail()
  const { signInGoogle } = useSignInWithGoogle()
  const { signInFacebook } = useSignInWithFacebook()
  const { signInApple } = useSignInWithApple()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
    general: '',
  })

  const { loading: dataLoading} = useFetchData(user);
  const { loading: seersLoading, error: seersError } = useFetchSeers(user);
  
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(prev => ({ ...prev, email: '', password: '', general: '' }));

      const userCredential = await signIn(email, password);

      if (userCredential?.user?.emailVerified && userCredential.newUser) {
        router.replace('/src/screens/side/Introduction');
      } else if (userCredential?.user?.emailVerified && !userCredential.newUser) {
        // Data fetch işlemini bekle  
        
        if (!dataLoading && !seersLoading && !seersError) {
          router.replace('/src/screens/main/navigator/(tabs)/GuideScreen');
        }
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
  
  const handleSignInGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signInGoogle();
      console.log(result.newUser);
      if (result.user) {
        if (result.newUser) {
          router.replace('/src/screens/side/Introduction');
        } else {
          // Veri fetch işlemini bekle
          if (!dataLoading && !seersLoading && !seersError) {
            router.replace('/src/screens/main/navigator/FortuneTellingScreen');
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      showToast(t('auth.auth/google-sign-in-error'), 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  }

  const handleSignInFacebook = async () => {
    try {
      setIsFacebookLoading(true);
      const result = await signInFacebook();
      console.log(result.newUser);
      if (result.user) {
        if (result.newUser) {
          router.replace('/src/screens/side/Introduction');
        } else {
          // Veri fetch işlemini bekle
          if (!dataLoading && !seersLoading && !seersError) {
            router.replace('/src/screens/main/navigator/FortuneTellingScreen');
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      showToast(t('auth.auth/facebook-sign-in-error'), 'error');
    } finally {
      setIsFacebookLoading(false);
    }
  }

  const handleSignInApple = async () => {
    try {
      setIsAppleLoading(true);
      const result = await signInApple();
      console.log(result.newUser);
      if (result.user) {
        if (result.newUser) {
          router.replace('/src/screens/side/Introduction');
        } else {
          // Veri fetch işlemini bekle
          if (!dataLoading && !seersLoading && !seersError) {
            router.replace('/src/screens/main/navigator/FortuneTellingScreen');
          }
        }
      }
    } catch (error: any) {
      console.log(error);
      showToast(t('auth.auth/apple-sign-in-error'), 'error');
    } finally {
      setIsAppleLoading(false);
    }
  }

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
        <UnderLineText title="Hesabın Yok mu?" route="/src/screens/auth/Register"  contentStyle={{ marginTop: 10 }}/>
        <UnderLineText title="Şifremi unuttum" route="/src/screens/auth/ForgotPassword" contentStyle={{ marginTop: 10, fontSize: 14 }}/>
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
            onPress={handleSignInFacebook}
            variant="primary"
            size="medium"
            leftImage={require('@assets/image/facebook.png')}
            loading={isFacebookLoading}
          />
          <ContainerButton
            title="Apple ile Giriş Yap"
            onPress={handleSignInApple}
            variant="primary"
            size="medium"
            leftImage={require('@assets/image/apple.png')}
            loading={isAppleLoading}
          />
        </View>
      </View>
    </Animated.View>
  )
}

export default Login