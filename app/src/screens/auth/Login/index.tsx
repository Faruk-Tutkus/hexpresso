import { ContainerButton, CustomButton, FloatingLabelInput, ForgotPassword } from '@components'
import React, { useState } from 'react'
import { View } from 'react-native'
import { useTheme } from 'ThemeContext'
import styles from './styles'
const Login = () => {
  const { theme, colors, toggleTheme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <FloatingLabelInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          leftIcon="mail"
        />
        <FloatingLabelInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          leftIcon="lock-closed"
          isPassword={true}
          error={'hataa'}
        />
        <CustomButton
          title="Login"
          onPress={() => {}}
          variant="primary"
          size="medium"
          leftIcon="enter"
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
    </View>
  )
}

export default Login