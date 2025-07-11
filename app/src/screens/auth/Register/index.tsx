import { ContainerButton, CustomButton, FloatingLabelInput, UnderLineText } from '@components'
import { useFetchData, useFetchSeers, useSignInWithGoogle, useSignUpWithEmail } from '@hooks'
import { useAuth, useTheme, useToast } from '@providers'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import '../../../utils/i18n'
import styles from './styles'

const Register = () => {
  const { colors } = useTheme()
  const { name } = useLocalSearchParams()
  const [displayName, setDisplayName] = useState(name)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const { t } = useTranslation()
  const { showToast } = useToast()
  const { signInGoogle } = useSignInWithGoogle()
  const { signUp } = useSignUpWithEmail()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [authenticationComplete, setAuthenticationComplete] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
    general: '',
    displayName: '',
  })
  const { user } = useAuth();
  const { loading: dataLoading} = useFetchData(user);
  const { loading: seersLoading, error: seersError } = useFetchSeers(user);

  // Navigation logic - sürekli olarak loading state'leri dinle
  useEffect(() => {
    if (!user || !authenticationComplete) return;

    console.log('Register Navigation check:', {
      user: !!user,
      authenticationComplete,
      isNewUser,
      dataLoading,
      seersLoading,
      seersError: !!seersError
    });

    if (isNewUser) {
      console.log('New user - navigating to Introduction');
      router.replace('/src/screens/side/Introduction');
      setAuthenticationComplete(false); // Reset
    } else if (!dataLoading && !seersLoading && !seersError) {
      console.log('Existing user - data loaded, navigating to FortuneTellingScreen');
      router.replace('/src/screens/main/navigator/(tabs)/FortuneTellingScreen');
      setAuthenticationComplete(false); // Reset
    }
  }, [user, authenticationComplete, isNewUser, dataLoading, seersLoading, seersError]);

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
        router.replace({
          pathname: '/src/screens/auth/Login', params: {
            email: email,
            password: password,
            displayName: displayName,
          }
        })
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
      setIsLoading(false)
    }
  }

  const handleSignInGoogle = async () => {
    try {
      setIsGoogleLoading(true);
      const result = await signInGoogle();
      console.log('Google register result:', result.newUser);
      if (result.user) {
        setIsNewUser(result.newUser);
        setAuthenticationComplete(true);
        showToast('Google ile giriş başarılı! Veriler yükleniyor...', 'success');
      }
    } catch (error: any) {
      console.log(error);
      showToast(t('auth.auth/google-sign-in-error'), 'error');
      setIsGoogleLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <FloatingLabelInput
          placeholder="İsim"
          value={displayName as string}
          onChangeText={setDisplayName}
          leftIcon="person"
          type="text"
          error={errorMessage.displayName}
        />
        <FloatingLabelInput
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail"
          type="email"
          error={errorMessage.email}
        />
        <FloatingLabelInput
          placeholder="Şifre"
          value={password}
          onChangeText={setPassword}
          leftIcon="lock-closed"
          isPassword={true}
          type="password"
          error={errorMessage.password}
        />
        <FloatingLabelInput
          placeholder="Şifre Tekrar"
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
        <UnderLineText title="Zaten bir hesabın var mı?" route="/src/screens/auth/Login"  contentStyle={{ marginTop: 10 }}/>
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
            onPress={() => { showToast("Yakında desteklenecek", 'info') }}
            variant="primary"
            size="medium"
            leftImage={require('@assets/image/facebook.png')}
          />
          {/* <ContainerButton
            title="Apple ile Giriş Yap"
            onPress={() => { }}
            variant="primary"
            size="medium"
            leftImage={require('@assets/image/apple.png')}
          /> */}
        </View>
      </View>
    </View>
  )
}

export default Register