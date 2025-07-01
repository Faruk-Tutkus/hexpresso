import { useTheme } from '@providers';
import { Image } from 'expo-image';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
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
        { backgroundColor: colors.secondaryText },
      ]}
    >
      <View style={[styles.content]}>
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? colors.surface : colors.primary}
            size="small"
          />
        ) : (
          <>
            {leftImage && (
              <View style={styles.imageContainer}>
                <Image
                  style={[styles.image, { tintColor: colors.background }]}
                  source={leftImage}
                  contentFit="cover"
                  transition={1000}
                />
              </View>
            )}
            <Text style={[styles.text, { color: colors.background }]}>{title}</Text>
            {rightImage && (
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={rightImage}
                  placeholder={{ blurhash: 'L3C00000' }}
                  contentFit="cover"
                  transition={1000}
                />
              </View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ContainerButton; 