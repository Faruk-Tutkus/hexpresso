import Icon from '@assets/icons';
import { useTheme } from "@providers";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from "expo-router";
import * as SystemUI from 'expo-system-ui';
import { useCallback, useEffect, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

// Route configuration for cleaner management
const ROUTE_CONFIG = {
  'GuideScreen/index': {
    icon: 'book',
    title: 'Burçlar',
    id: 'guide'
  },
  'FortuneTellingScreen/index': {
    icon: 'planet',
    title: 'Fallar',
    id: 'home'
  },
  'MyFortunes/index': {
    icon: 'heart',
    title: 'Fallarım',
    id: 'myfortunes'
  },
  'SignComments/index': {
    icon: 'comment',
    title: 'Yorumlar',
    id: 'comments'
  }
} as const;

// Animation constants with Reanimated optimized values
const ANIMATION_CONFIG = {
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
  },
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  timing: {
    duration: 300,
  }
};

const TabLayout = () => {
  const { colors } = useTheme();
  
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

    // Create shared values for each possible route at top level to follow Hook rules
    const guideProgress = useSharedValue(state.index === state.routes.findIndex(r => r.name === 'GuideScreen/index') ? 1 : 0);
    const fortuneProgress = useSharedValue(state.index === state.routes.findIndex(r => r.name === 'FortuneTellingScreen/index') ? 1 : 0);
    const myFortunesProgress = useSharedValue(state.index === state.routes.findIndex(r => r.name === 'MyFortunes/index') ? 1 : 0);
    const commentsProgress = useSharedValue(state.index === state.routes.findIndex(r => r.name === 'SignComments/index') ? 1 : 0);

    // Map route names to their respective progress values
    const animationProgress = useMemo(() => ({
      'GuideScreen/index': guideProgress,
      'FortuneTellingScreen/index': fortuneProgress,
      'MyFortunes/index': myFortunesProgress,
      'SignComments/index': commentsProgress,
    } as Record<string, any>), [guideProgress, fortuneProgress, myFortunesProgress, commentsProgress]);

    // Update animations when active tab changes
    useEffect(() => {
      filteredRoutes.forEach((route) => {
        const isActive = state.routes.findIndex(r => r.name === route.name) === state.index;
        const progress = animationProgress[route.name];
        
        if (progress) {
          // Use spring animation for smooth, bouncy effect
          progress.value = withSpring(isActive ? 1 : 0, {
            damping: ANIMATION_CONFIG.spring.damping,
            stiffness: ANIMATION_CONFIG.spring.stiffness,
            mass: ANIMATION_CONFIG.spring.mass,
          });
        }
      });
    }, [state.index, filteredRoutes, animationProgress]);

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
        height: 75,
        marginBottom: 8,
        width: '95%',
        borderRadius: 24,
        alignSelf: 'center',
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
          const progress = animationProgress[route.name];

          if (!routeConfig || !progress) return null;

          // Tab item animated styles
          const animatedIconContainerStyle = useAnimatedStyle(() => {
            const scale = interpolate(
              progress.value,
              [0, 1],
              [ANIMATION_CONFIG.scale.inactive, ANIMATION_CONFIG.scale.active]
            );
            
            const translateY = interpolate(
              progress.value,
              [0, 1],
              [ANIMATION_CONFIG.translateY.inactive, ANIMATION_CONFIG.translateY.active]
            );

            return {
              transform: [
                { scale },
                { translateY }
              ]
            };
          });

          const animatedIconStyle = useAnimatedStyle(() => {
            const opacity = interpolate(
              progress.value,
              [0, 1],
              [ANIMATION_CONFIG.opacity.inactive, ANIMATION_CONFIG.opacity.active]
            );

            return {
              opacity
            };
          });

          const animatedTextStyle = useAnimatedStyle(() => {
            const opacity = interpolate(
              progress.value,
              [0, 1],
              [ANIMATION_CONFIG.opacity.inactive, ANIMATION_CONFIG.opacity.active]
            );

            return {
              opacity
            };
          });

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
                style={[
                  {
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  animatedIconContainerStyle
                ]}
              >
                <Animated.View
                  style={[
                    {
                      marginBottom: 4,
                    },
                    animatedIconStyle
                  ]}
                >
                  <Icon
                    name={isFocused ? routeConfig.icon as any : `${routeConfig.icon}-outline` as any}
                    size={26}
                    color={isFocused ? colors.primary : colors.text}
                    zodiac={true ? routeConfig.icon === 'comment' : false}
                  />
                </Animated.View>
                
                <Animated.Text
                  style={[
                    {
                      color: isFocused ? colors.primary : colors.text,
                      textAlign: 'center',
                      fontSize: 11,
                      fontWeight: isFocused ? '600' : '400',
                    },
                    animatedTextStyle
                  ]}
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
        name="FortuneTellingScreen/index"
        options={{
          title: 'Fallar',
        }}
      />
      <Tabs.Screen
        name="FortuneTellingScreen/styles"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="MyFortunes/index"
        options={{
          title: 'Fallarım',
        }}
      />
      <Tabs.Screen
        name="MyFortunes/styles"
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