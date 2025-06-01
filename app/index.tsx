import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from '@screens';
const Stack = createStackNavigator();
export default function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='SplashScreen'
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}