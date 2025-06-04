import Icon from '@assets/icons';
import { useTheme } from '@providers';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { breathingAnimation, shakeAnimation, styles } from './styles';

interface FloatingLabelPickerProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  leftIcon?: string;
  data: { id: string; label: string; value: string }[];
  error?: string;
}

const FloatingLabelPicker: React.FC<FloatingLabelPickerProps> = ({
  value,
  onChangeText,
  placeholder,
  leftIcon,
  error,
  data,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [localError, setLocalError] = useState(error);
  const animatedLabelPosition = useRef(new Animated.Value(1)).current;
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
      toValue: (value) ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const handleChangeText = (text: string) => {
    if (localError) {
      setLocalError('');
    }
    onChangeText(text);
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
        <Animated.View style={[styles.label, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>{placeholder}</Text>
        </Animated.View>
        <Picker
          selectedValue={value}
          onValueChange={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.picker, { color: colors.text }]}
          mode="dropdown"
          dropdownIconColor={colors.text}
        >
          {data.map((item) => (
            <Picker.Item key={item.id} label={item.label} value={item.value}/>
          ))}
        </Picker>
      </Animated.View>
      {localError && <Text style={[styles.errorText, { color: colors.errorText }]}>{localError}</Text>}
    </Animated.View>
  );
};

export default FloatingLabelPicker;