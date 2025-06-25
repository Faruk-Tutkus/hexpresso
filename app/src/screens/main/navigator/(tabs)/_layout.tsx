import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@providers";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from "expo-router";
import * as SystemUI from 'expo-system-ui';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Route configuration for cleaner management
const ROUTE_CONFIG = {
  'GuideScreen/index': {
    icon: 'book',
    title: 'Burçlar',
    id: 'guide'
  },
  'HomeScreen/index': {
    icon: 'home',
    title: 'Hexpresso',
    id: 'home'
  },
  'SignComments/index': {
    icon: 'star',
    title: 'Burç Yorumları',
    id: 'comments'
  }
} as const;

// Animation constants for better performance
const ANIMATION_CONFIG = {
  duration: 280,
  easing: Easing.bezier(0.4, 0.0, 0.2, 1), // Material Design easing
  scale: {
    inactive: 1,
    active: 1.15
  },
  translateY: {
    inactive: 0,
    active: -8
  },
  opacity: {
    inactive: 0.6,
    active: 1
  }
};

const TabLayout = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  // Memoize valid routes to avoid unnecessary recalculations
  const validRoutes = useMemo(() => {
    return Object.keys(ROUTE_CONFIG);
  }, []);

  const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
    // Filter and get only valid routes
    const filteredRoutes = useMemo(() => {
      return state.routes.filter(route => validRoutes.includes(route.name));
    }, [state.routes, validRoutes]);

    // Initialize animation values with better performance
    const animatedValues = useRef(
      filteredRoutes.reduce((acc, route, index) => {
        const isActive = state.routes.findIndex(r => r.name === route.name) === state.index;
        acc[route.name] = {
          scale: new Animated.Value(isActive ? ANIMATION_CONFIG.scale.active : ANIMATION_CONFIG.scale.inactive),
          translateY: new Animated.Value(isActive ? ANIMATION_CONFIG.translateY.active : ANIMATION_CONFIG.translateY.inactive),
          opacity: new Animated.Value(isActive ? ANIMATION_CONFIG.opacity.active : ANIMATION_CONFIG.opacity.inactive)
        };
        return acc;
      }, {} as Record<string, { scale: Animated.Value; translateY: Animated.Value; opacity: Animated.Value }>)
    ).current;

    // Optimize animation triggers
    useEffect(() => {
      filteredRoutes.forEach((route) => {
        const isActive = state.routes.findIndex(r => r.name === route.name) === state.index;
        const animations = animatedValues[route.name];
        
        if (!animations) return;

        // Run animations in parallel for better performance
        Animated.parallel([
          Animated.timing(animations.scale, {
            toValue: isActive ? ANIMATION_CONFIG.scale.active : ANIMATION_CONFIG.scale.inactive,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true,
          }),
          Animated.timing(animations.translateY, {
            toValue: isActive ? ANIMATION_CONFIG.translateY.active : ANIMATION_CONFIG.translateY.inactive,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true,
          }),
          Animated.timing(animations.opacity, {
            toValue: isActive ? ANIMATION_CONFIG.opacity.active : ANIMATION_CONFIG.opacity.inactive,
            duration: ANIMATION_CONFIG.duration,
            easing: ANIMATION_CONFIG.easing,
            useNativeDriver: true,
          })
        ]).start();
      });
    }, [state.index, filteredRoutes]);

    // Optimize onPress with useCallback
    const handlePress = useCallback((route: any) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    }, [navigation]);

    return (
      <View style={{
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        paddingVertical: 16,
        height: 75 + insets.bottom,
        width: '92%',
        borderRadius: 24,
        alignSelf: 'center',
        marginBottom: 8,
        marginTop: 4,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}>
        {filteredRoutes.map((route) => {
          const routeConfig = ROUTE_CONFIG[route.name as keyof typeof ROUTE_CONFIG];
          const originalIndex = state.routes.findIndex(r => r.name === route.name);
          const isFocused = state.index === originalIndex;
          const animations = animatedValues[route.name];

          if (!routeConfig || !animations) return null;

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => handlePress(route)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              activeOpacity={0.7}
            >
              <Animated.View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [
                    { scale: animations.scale },
                    { translateY: animations.translateY }
                  ]
                }}
              >
                <Animated.View
                  style={{
                    opacity: animations.opacity,
                    marginBottom: 4,
                  }}
                >
                  <Ionicons
                    name={isFocused ? routeConfig.icon as any : `${routeConfig.icon}-outline` as any}
                    size={26}
                    color={isFocused ? colors.primary : colors.text}
                  />
                </Animated.View>
                
                <Animated.Text
                  style={{
                    color: isFocused ? colors.primary : colors.text,
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: isFocused ? '600' : '400',
                    opacity: animations.opacity,
                  }}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {routeConfig.title}
                </Animated.Text>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <Tabs
      initialRouteName="GuideScreen/index"
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        sceneStyle: {
          backgroundColor: colors.background,
        },
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="GuideScreen/index"
        options={{
          title: 'Guide',
        }}
      />
      <Tabs.Screen
        name="GuideScreen/styles"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="HomeScreen/index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="HomeScreen/styles"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="SignComments/index"
        options={{
          title: 'Fortunes',
        }}
      />
      <Tabs.Screen
        name="SignComments/styles"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="Signs/index"
        options={{
          title: 'Burç Detayı',
          href: null,
        }}
      />
      <Tabs.Screen
        name="Signs/styles"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}

export default TabLayout;