import Icon from '@assets/icons';
import { useTheme } from '@providers';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import styles from './styles';
interface CustomButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
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
}) => {
  const { colors } = useTheme();


  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        disabled && styles.disabled,
        { backgroundColor: colors.primary },
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator 
            color={variant === 'primary' ? colors.surface : colors.primary} 
            size="small" 
          />
        ) : (
          <>
            {leftIcon && (
              <Icon 
                name={leftIcon} 
                size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} 
                color={variant === 'primary' ? colors.surface : colors.primary} 
                style={styles.leftIcon}
              />
            )}
            <Text style={styles.text}>{title}</Text>
            {rightIcon && (
              <Icon 
                name={rightIcon} 
                size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} 
                color={variant === 'primary' ? colors.surface : colors.primary} 
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