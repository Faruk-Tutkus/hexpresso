import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@providers";
import { useRouter } from 'expo-router';
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { styles } from "./styles";

interface ToastProps {
  message?: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  onClose?: () => void;
  duration?: number;
  showProgress?: boolean;
  routerTitle?: any;
}

const Toast = ({ 
  message, 
  type = 'success', 
  title,
  onClose,
  duration = 4000,
  showProgress = true,
  routerTitle
}: ToastProps) => {
  const { colors } = useTheme();
  const progress = useSharedValue(1);
  const router = useRouter();

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          borderColor: colors.primary,
          backgroundColor: colors.secondaryText,
          iconColor: colors.background,
          title: title || 'Başarılı',
          message: message || 'İşlem başarıyla tamamlandı'
        };
      case 'error':
        return {
          icon: 'close-circle',
          borderColor: colors.errorBorder,
          backgroundColor: colors.secondaryText,
          iconColor: colors.background,
          title: title || 'Hata',
          message: message || 'Bir hata oluştu'
        };
      case 'warning':
        return {
          icon: 'warning',
          borderColor: '#FF9500',
          backgroundColor: colors.secondaryText,
          iconColor: colors.background,
          title: title || 'Uyarı',
          message: message || 'Dikkat edilmesi gereken bir durum var'
        };
      case 'info':
        return {
          icon: 'information-circle',
          borderColor: colors.secondary,
          backgroundColor: colors.secondaryText,
          iconColor: colors.background,
          title: title || 'Bilgi',
          message: message || 'Bilgilendirme mesajı'
        };
      default:
        return {
          icon: 'checkmark-circle',
          borderColor: colors.primary,
          backgroundColor: colors.secondaryText,
          iconColor: colors.background,
          title: title || 'Başarılı',
          message: message || 'İşlem başarıyla tamamlandı'
        };
    }
  };

  const config = getToastConfig();

  // Define border color for the left border based on type
  const borderColor = config.borderColor;
  const backgroundColor = config.backgroundColor;

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  useEffect(() => {
    if (showProgress && duration > 0) {
      progress.value = withTiming(0, { duration }, () => {
        if (onClose) {
          runOnJS(onClose)();
        }
      });
    }
  }, [duration, showProgress, onClose]);

  if (!message && !title) return null;

  return (
    <TouchableOpacity style={[styles.container, styles.toastSpacing]} 
    activeOpacity={1}
    onPress={() => router.navigate(routerTitle || '')}
    >
      <Animated.View
        style={[
          styles.toastWrapper,
          {
            backgroundColor: backgroundColor,
            borderLeftWidth: 6,
            borderLeftColor: borderColor,
            borderRightWidth: 6,
            borderRightColor: borderColor,

          },
        ]}
        entering={FadeInUp.springify().damping(15).stiffness(150)}
        exiting={FadeOutUp.springify().damping(15).stiffness(150)}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons 
            name={config.icon as any} 
            size={20} 
            color={borderColor} 
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, { color: colors.background }]}> 
            {config.title}
          </Text>
          {message && (
            <Text style={[styles.message, { color: colors.background }]}> 
              {message}
            </Text>
          )}
        </View>

        {/* Progress Bar */}
        {showProgress && (
          <Animated.View
            style={[
              styles.progressBar,
              { backgroundColor: borderColor + '40' },
              progressStyle
            ]}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Toast;
