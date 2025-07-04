import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@providers";
import { useEffect } from "react";
import { Text, View } from "react-native";
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
  index?: number;
  total?: number;
}

const Toast = ({ 
  message, 
  type = 'success', 
  title,
  onClose,
  duration = 4000,
  showProgress = true,
  index = 0,
  total = 1
}: ToastProps) => {
  const { colors } = useTheme();
  const progress = useSharedValue(1);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          backgroundColor: colors.primary,
          iconColor: colors.background,
          title: title || 'Başarılı',
          message: message || 'İşlem başarıyla tamamlandı'
        };
      case 'error':
        return {
          icon: 'close-circle',
          backgroundColor: colors.errorBorder,
          iconColor: colors.background,
          title: title || 'Hata',
          message: message || 'Bir hata oluştu'
        };
      case 'warning':
        return {
          icon: 'warning',
          backgroundColor: '#FF9500',
          iconColor: colors.background,
          title: title || 'Uyarı',
          message: message || 'Dikkat edilmesi gereken bir durum var'
        };
      case 'info':
        return {
          icon: 'information-circle',
          backgroundColor: colors.secondary,
          iconColor: colors.background,
          title: title || 'Bilgi',
          message: message || 'Bilgilendirme mesajı'
        };
      default:
        return {
          icon: 'checkmark-circle',
          backgroundColor: colors.primary,
          iconColor: colors.background,
          title: title || 'Başarılı',
          message: message || 'İşlem başarıyla tamamlandı'
        };
    }
  };

  const config = getToastConfig();

  // Define border color for the left border based on type
  const borderColor = config.backgroundColor;

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

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!message && !title) return null;

  return (
    <View style={[styles.container, styles.toastSpacing]}>
      <Animated.View
        style={[
          styles.toastWrapper,
          {
            backgroundColor: colors.background,
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
          <Text style={[styles.title, { color: colors.text }]}> 
            {config.title}
          </Text>
          {message && (
            <Text style={[styles.message, { color: colors.text }]}> 
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
    </View>
  );
};

export default Toast;
