import { Animated, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 36,
    paddingBottom: 24,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  menuContainer: {
    width: 32,
    height: 32, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Domine-SemiBold',
  },
  message: {
    fontSize: 14,
    fontFamily: 'Domine-Regular',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    justifyContent: 'center',
    gap: 8,
  },
  iconText: {
    fontSize: 24,
    fontFamily: 'Domine-SemiBold',
    textAlign: 'center',
  },
  logo: {
    width: 24,
    height: 24,
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
