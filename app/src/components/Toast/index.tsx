import { useTheme } from "@providers";
import { Text, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { styles } from "./styles";
interface ToastProps {
  message?: string;
  type?: 'success' | 'error' | 'info';
}

const Toast = ({ message, type = 'success' }: ToastProps) => {
  const { colors } = useTheme()
  return (
    <View style={{position: 'absolute', width: '100%', height: '25%', justifyContent: 'center', alignItems: 'center'}}>
      {message && (
        <Animated.View style={[styles.container, {backgroundColor: type === 'success' ? colors.primary : type === 'error' ? colors.errorBorder : colors.surface}]}
          entering={FadeInUp}
          exiting={FadeOutUp}
        >
          <Text style={[styles.text, {color: colors.text}]}>
            {message}
          </Text>
        </Animated.View>
      )}
    </View>
  )
}

export default Toast
