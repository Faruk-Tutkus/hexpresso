import { useTheme } from '@providers'
import { Image } from 'expo-image'
import React from 'react'
import { Text, View } from 'react-native'
import styles from './styles'
interface HoroscopeCardProps {
  sign: string
  date: string,
  image: string
}

const HoroscopeCard = ({ sign, date, image }: HoroscopeCardProps) => {
  const { colors } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: colors.secondaryText }]}>
      <View style={styles.left}>
        <Text style={[styles.sign, { color: colors.background }]}>{sign}</Text>
        <Text style={[styles.date, { color: colors.background }]}>{date}</Text>
      </View>
      <View style={styles.right}>
        <Image source={image} style={styles.image} tintColor={colors.background} contentFit="contain" />
      </View>
    </View>
  )
}

export default HoroscopeCard