import { Ionicons } from '@expo/vector-icons';
import { useTheme } from "@providers";
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Tabs } from "expo-router";
import * as SystemUI from 'expo-system-ui';
import { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';

const TabLayout = () => {
  const { theme, colors } = useTheme();
  SystemUI.setBackgroundColorAsync(colors.background);

  const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
    const filteredRoutes = state.routes.filter((route: any) => route.name !== 'HomeScreen/styles' && route.name !== 'GuideScreen/styles' && route.name !== 'FortunesScreen/styles' && route.name !== 'ExclusiveFortunesScreen/styles');
    const animatedValues = useRef(filteredRoutes.map(() => new Animated.Value(1))).current;
    const transformY = useRef(filteredRoutes.map(() => new Animated.Value(0))).current;

    useEffect(() => {
      filteredRoutes.forEach((_: any, index: number) => {
        const isCurrentlyFocused = state.routes.findIndex(route => route.name === filteredRoutes[index].name) === state.index;
        Animated.spring(animatedValues[index], {
          toValue: isCurrentlyFocused ? 1.2 : 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
        Animated.spring(transformY[index], {
          toValue: isCurrentlyFocused ? -10 : 0,
          useNativeDriver: true,
          tension: 7,
          friction: 1,
        }).start();
      });
    }, [state.index]);

    const onPress = (route: any, index: number) => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <View style={{ 
        flexDirection: 'row', 
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        paddingTop: 18,
        height: 80,
        width: '90%',
        borderRadius: 20,
        alignSelf: 'center',
        marginBottom: 30,
      }}>
        {filteredRoutes.map((route: any, index: number) => {
          const originalIndex = state.routes.findIndex(r => r.name === route.name);
          const isFocused = state.index === originalIndex;
          const iconName = route.name === 'HomeScreen/index' ? 'home' : route.name === 'GuideScreen/index' ? 'book' : route.name === 'FortunesScreen/index' ? 'star' : 'star';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => onPress(route, index)}
              style={{
                flex: 1,
                alignItems: 'center',
              }}
            >
              <Animated.View
                style={{
                  alignItems: 'center',
                  transform: [{ scale: animatedValues[index] }, { translateY: transformY[index] }]
                }}
              >
                <Animated.View
                  style={{
                    opacity: animatedValues[index].interpolate({
                      inputRange: [1, 1.2],
                      outputRange: [0.5, 1]
                    })
                  }}
                >
                  <Ionicons
                    name={isFocused ? iconName : `${iconName}-outline`}
                    size={24}
                    color={isFocused ? colors.primary : colors.text}
                  />
                </Animated.View>
                <Animated.Text
                  style={{
                    color: isFocused ? colors.primary : colors.text,
                    textAlign: 'center',
                    fontSize: 12,
                    marginTop: 4,
                    opacity: animatedValues[index].interpolate({
                      inputRange: [1, 1.2],
                      outputRange: [0.5, 1]
                    })
                  }}
                >
                  {route.name === 'HomeScreen/index' ? 'Ana Sayfa' : route.name === 'GuideScreen/index' ? 'Rehber' : route.name === 'FortunesScreen/index' ? 'Fallarım' : 'Exclusive Fallarım'}
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
        name="FortunesScreen/index"
        options={{
          title: 'Fortunes',
        }} 
      />
      <Tabs.Screen 
        name="FortunesScreen/styles"
        options={{
          href: null,
        }} 
      />
    </Tabs>
  )
}

export default TabLayout;