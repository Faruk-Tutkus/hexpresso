import { Animated, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 8,
    minWidth: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 56,
  },
  picker: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  placeholder: {
    position: 'absolute',
    top: -11,
    transform: [{ scale: 0.9 }],
    left: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItem: {
    left: 100,
  },
  iconContainer: {
    padding: 8,
  },
  errorContainer: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 12,
  },
});

export const shakeAnimation = (value: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: -10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 10,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
  ]);
};

export const breathingAnimation = (value: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(value, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: false,
      }),
    ])
  );
};
