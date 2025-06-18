import { useTheme } from '@providers'
import { Image } from 'expo-image'
import React, { useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import styles from './styles'

interface HoroscopeCardProps {
  sign: string
  date: string,
  image: string,
  onPress: () => void
}

const HoroscopeCard = ({ sign, date, image, onPress }: HoroscopeCardProps) => {
  const { colors } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const handlePress = async () => {
    setIsLoading(true)
    try {
      await onPress()
    } finally {
      // Reset loading after a short delay to ensure navigation is complete
      setTimeout(() => setIsLoading(false), 1000)
    }
  }

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: colors.secondaryText, opacity: isLoading ? 0.7 : 1 }]} 
      onPress={handlePress}
      disabled={isLoading}
    >
      <View style={styles.left}>
        <Text style={[styles.sign, { color: colors.background }]}>{sign}</Text>
        <Text style={[styles.date, { color: colors.background }]}>{date}</Text>
      </View>
      <View style={styles.right}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.background} />
          </View>
        ) : (
          <Image source={image} style={styles.image} tintColor={colors.background} contentFit="contain" />
        )}
      </View>
    </TouchableOpacity>
  )
}

export default HoroscopeCard