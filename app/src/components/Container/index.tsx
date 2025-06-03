import { useTheme } from '@providers'
import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styles from './styles'

interface ContainerProps {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

const Container = ({ children, style}: ContainerProps) => {
  const { colors } = useTheme()

  return (
    <View style={[
        styles.container, { backgroundColor: colors.surface, borderColor: colors.border},
        style
    ]}>
      {children}
    </View>
  )
}

export default Container