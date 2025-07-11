import Icon from '@assets/icons';
import { useTheme } from '@providers';
import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  View
} from 'react-native';
import styles from './styles';
interface IconButtonProps {
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  size = 'medium',
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        disabled && styles.disabled,  
        { backgroundColor: variant === 'primary' ? colors.primary : colors.errorText },
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator 
            color={colors.surface} 
            size="small" 
          />
        ) : (
          <>
            {icon && (
              <Icon 
                name={icon as any} 
                size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} 
                color={variant === 'primary' ? colors.background : colors.text}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default IconButton; 