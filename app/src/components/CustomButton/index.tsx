import Icon from '@assets/icons';
import { useTheme } from '@providers';
import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import styles from './styles';
interface CustomButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'third';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  contentStyle?: StyleProp<ViewStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  contentStyle,
}) => {
  const { colors } = useTheme();


  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        contentStyle,
        disabled && styles.disabled,
        { backgroundColor: variant === 'secondary' ? colors.errorBorder : variant === 'third' ? colors.secondary : colors.primary },
      ]}
    >
      <View style={[styles.content]}>
        {loading ? (
          <ActivityIndicator 
            color={colors.surface} 
            size="small" 
          />
        ) : (
          <>
            {leftIcon && (
              <Icon 
                name={leftIcon as any} 
                size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} 
                color={colors.background} 
                style={styles.leftIcon}
              />
            )}
            <Text style={[styles.text, { color: colors.background }]}>{title}</Text>
            {rightIcon && (
              <Icon 
                name={rightIcon as any} 
                size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} 
                color={colors.background} 
                style={styles.rightIcon}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton; 