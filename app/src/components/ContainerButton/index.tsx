import { Image } from 'expo-image';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from 'ThemeContext';
import styles from './styles';

interface ContainerButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  leftImage?: string;
  rightImage?: string;
}

const ContainerButton: React.FC<ContainerButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftImage,
  rightImage,
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        disabled && styles.disabled,
        { backgroundColor: colors.text },
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
            {leftImage && (
              <Image
              style={styles.image}
              source={leftImage}
              contentFit="cover"
              transition={1000}
              />
            )}
            <Text style={styles.text}>{title}</Text>
            {rightImage && (
              <Image
                style={styles.image}
                source={rightImage}
                placeholder={{ blurhash: 'L3C00000' }}
                contentFit="cover"
                transition={1000}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ContainerButton; 