import { Header } from '@components';
import { useAuth, useTheme } from '@providers';
import { Drawer } from 'expo-router/drawer';
import * as SystemUI from 'expo-system-ui';
import { User } from 'firebase/auth';

export default function Layout() {
  const { user } = useAuth();
  const { theme, colors } = useTheme();
  SystemUI.setBackgroundColorAsync(colors.background);
  return (
    <Drawer
      screenOptions={({ navigation }) => ({
        headerShown: true,

        header: () => <Header user={user as User} onPress={() => navigation.toggleDrawer()} />,

        sceneStyle: {
          backgroundColor: colors.background,
        },
        drawerType: 'slide',

        drawerStyle: {
          width: '70%',
          backgroundColor: colors.background,
        },
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: colors.text,
        drawerInactiveTintColor: colors.text,
        drawerLabelStyle: {
          fontFamily: 'Almendra-Regular',
          fontWeight: 'bold',
          fontSize: 16,
        },
        drawerStatusBarAnimation: 'slide',
      })}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="Profile/index"
        options={{
          title: 'Profile',
          headerShown: true,
        }}
      />
      <Drawer.Screen
        name="Logout/index"
        options={{
          title: 'Logout',
          headerShown: false,

        }}
      />
    </Drawer>
  );
}