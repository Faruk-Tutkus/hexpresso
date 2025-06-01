import { router } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { useTheme } from 'ThemeContext'
import styles from './styles'

type ForgotPasswordProps = {
  title: string;
  route?: string;
}

const ForgotPassword = ({title, route}: ForgotPasswordProps) => {
  const { colors } = useTheme()
  return (
    <TouchableOpacity 
      style={styles.forgotPasswordContainer} 
      onPress={() => router.push(route as any)}
    >
        <Text style={[styles.forgotPasswordText, { color: colors.text }]}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default ForgotPassword;