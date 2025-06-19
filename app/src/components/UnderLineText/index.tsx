import { useTheme } from '@providers';
import { router } from 'expo-router';
import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity } from 'react-native';
import styles from './styles';

type UnderLineTextProps = {
  title: string;
  route?: string;
  contentStyle?: StyleProp<TextStyle>;
}

const UnderLineText = ({title, route, contentStyle}: UnderLineTextProps) => {
  const { colors } = useTheme()
  return (
    <TouchableOpacity 
      style={styles.forgotPasswordContainer} 
      onPress={() => router.push(route as any)}
    >
        <Text style={[styles.forgotPasswordText, { color: colors.text }, contentStyle]}>
            {title}
        </Text>
    </TouchableOpacity>
  )
}

export default UnderLineText;