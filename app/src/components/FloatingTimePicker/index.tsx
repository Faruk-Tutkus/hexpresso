import Icon from '@assets/icons';
import { useTheme } from '@providers';
import DatePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { breathingAnimation, shakeAnimation, styles } from './styles';

interface FloatingTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  placeholder: string;
  leftIcon?: string;
  error?: string;
}

const FloatingTimePicker: React.FC<FloatingTimePickerProps> = ({
  value,
  onChange,
  placeholder,
  leftIcon,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localError, setLocalError] = useState(error);
  const animatedLabelPosition = useRef(new Animated.Value(1)).current;
  const shakeAnimationValue = useRef(new Animated.Value(0)).current;
  const breathingAnimationValue = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);
  const { colors, theme } = useTheme();

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}.${minutes}`;
  };

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

  const handleChangeText = (event: any, selectedDate?: Date) => {
    setIsOpen(false);
    if (event.type === 'set' && selectedDate) {
      if (localError) {
        setLocalError('');
      }
      onChange(selectedDate);
    }
  };
  useEffect(() => {
    Animated.timing(animatedLabelPosition, {
      toValue: (isFocused || value) ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isFocused, value]);

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
            <Icon name={leftIcon as any} size={24} color={colors.text} />
          </View>
        )}
        <Animated.View style={[styles.label, labelStyle, { backgroundColor: colors.background }]}>
          <Text style={{ color: colors.text }}>{placeholder}</Text>
        </Animated.View>
        <TouchableOpacity onPress={() => setIsOpen(true)} style={{ flex: 1, paddingVertical: 8 }}>
          <Text style={[styles.labelText, { color: colors.text }]}>{value ? formatTime(value) : ''}</Text>
        </TouchableOpacity>
      </Animated.View>
      {localError && <Text style={[styles.errorText, { color: colors.errorText }]}>{localError}</Text>}
      
      {isOpen && (
        <DatePicker
          mode="time"
          display="clock"
          value={value || new Date()}
          onChange={handleChangeText}
          maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 8))}
          
        />
      )}
    </Animated.View>
  );
};

export default FloatingTimePicker;