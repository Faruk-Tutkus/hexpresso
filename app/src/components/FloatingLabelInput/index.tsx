import Icon from '@assets/icons';
import { useTheme } from '@providers';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { breathingAnimation, shakeAnimation, styles } from './styles';

interface FloatingLabelInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  leftIcon?: string;
  rightIcon?: string;
  isPassword?: boolean;
  type: 'text' | 'email' | 'password' | 'number';
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  value,
  onChangeText,
  placeholder,
  leftIcon,
  rightIcon,
  isPassword = false,
  type = 'text',
  error,
  onFocus,
  onBlur,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [localError, setLocalError] = useState(error);
  const animatedLabelPosition = useRef(new Animated.Value(value ? 1 : 0)).current;
  const shakeAnimationValue = useRef(new Animated.Value(0)).current;
  const breathingAnimationValue = useRef(new Animated.Value(0)).current;
  const { colors, theme } = useTheme();
  useEffect(() => {
    setLocalError(error);
  }, [error]);

  useEffect(() => {
    let breathingAnim: Animated.CompositeAnimation | null = null;
    
    if (localError) {
      shakeAnimation(shakeAnimationValue).start();
      breathingAnim = breathingAnimation(breathingAnimationValue);
      breathingAnim.start();
    } else {
      breathingAnimationValue.setValue(0);
    }

    return () => {
      breathingAnim?.stop();
    };
  }, [localError]);

  useEffect(() => {
    Animated.timing(animatedLabelPosition, {
      toValue: (isFocused || value) ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFocused, value]);

  const handleChangeText = (text: string) => {
    if (localError) {
      setLocalError('');
    }
    onChangeText(text);
  };

  const labelStyle = {
    transform: [
      {
        translateY: animatedLabelPosition.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -28],
        })
      },
      {
        scale: animatedLabelPosition.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.9],
        })
      }
    ],
    opacity: animatedLabelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    }),
  };

  const containerStyle = {
    transform: [{ translateX: shakeAnimationValue }],
  };

  const borderColor = breathingAnimationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.errorBorder, colors.errorBorder + '80'],
  });

  return (
    <Animated.View style={[styles.container, containerStyle, { backgroundColor: 'transparent' }]}>
      <Animated.View style={[
        styles.inputContainer,
        localError && styles.errorContainer,
        { 
          borderColor: localError ? borderColor : isFocused ? colors.primary : colors.border 
        }
      ]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Icon name={leftIcon} size={24} color={colors.text} />
          </View>
        )}
        <Animated.View style={[styles.label, labelStyle, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>{placeholder}</Text>
        </Animated.View>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          secureTextEntry={isPassword && !isPasswordVisible}
          autoCapitalize='none'
          autoComplete={'off'}
          keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'}
        />
        {isPassword ? (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-off'}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={styles.iconContainer}>
            <Icon name={rightIcon} size={24} color={colors.text} />
          </View>
        ) : null}
      </Animated.View>
      {localError && <Text style={[styles.errorText, { color: colors.errorText }]}>{localError}</Text>}
    </Animated.View>
  );
};

export default FloatingLabelInput;