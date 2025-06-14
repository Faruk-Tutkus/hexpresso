import { FloatingLabelInput } from '@components'
import { useTheme } from '@providers'
import React from 'react'
import { Text, View } from 'react-native'
import styles from './styles'

const AskAI = () => {
  const [value, onChangeText] = React.useState('')
  const { colors } = useTheme()

  return (
  <View style={[styles.container, { borderColor: colors.border }]}>
    <FloatingLabelInput
      placeholder="Mordecai'ya sor"
      type="text"
      leftIcon="search"
      rightIcon="send"
      value={value}
      onChangeText={onChangeText}
    />
    <View style={[styles.answerContainer, { borderColor: colors.border }]}>
      <Text style={[styles.answerText, { color: colors.text }]}>Mordecai'ya sokjhkjdskjf hkjsdhfksdhfkj hkjfhkdshf kdshfkj hdskh fkjdhfk dhkfhr</Text>
    </View>
  </View>
  )
}

export default AskAI