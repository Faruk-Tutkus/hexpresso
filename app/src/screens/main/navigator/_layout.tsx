import { db } from '@api/config.firebase';
import Icon from '@assets/icons';
import { Header } from '@components';
import { useFortuneProcessor } from '@hooks';
import { useAuth, useTheme } from '@providers';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import * as SystemUI from 'expo-system-ui';
import { User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function Layout() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  
  // Initialize Fortune Processor for automatic AI processing - only for authenticated users
  useFortuneProcessor(user);
  
  SystemUI.setBackgroundColorAsync(colors.background);

  const drawerItems = [
    {
      name: '(tabs)',
      title: 'Fallar ve Burçlar',
      icon: 'cards-playing',
      route: '/src/screens/main/navigator/(tabs)/FortuneTellingScreen',
      colors: ['#FF6B6B', '#FF8E53'],
      description: 'Fal ve burç rehberiniz'
    },
    {
      name: 'Profile',
      title: 'Profilim',
      icon: 'person',
      route: '/src/screens/main/navigator/Profile',
      colors: ['#4ECDC4', '#44A08D'],
      description: 'Kişisel bilgileriniz'
    },
    {
      name: 'Coins',
      title: 'Altın Kazan',
      icon: 'play-circle',
      route: '/src/screens/main/navigator/Coins',
      colors: ['#FA709A', '#FEE140'],
      description: 'Altın kazanma yolları'
    },
    {
      name: 'About',
      title: 'Hakkımızda',
      icon: 'information-circle',
      route: '/src/screens/main/navigator/About',
      colors: ['#667EEA', '#764BA2'],
      description: 'Uygulama hakkında'
    },
    {
      name: 'Settings',
      title: 'Ayarlar',
      icon: 'settings',
      route: '/src/screens/main/navigator/Settings',
      colors: ['#F093FB', '#F5576C'],
      description: 'Uygulama ayarları'
    },
    {
      name: 'Logout',
      title: 'Çıkış Yap',
      icon: 'exit',
      route: '/src/screens/main/navigator/Logout',
      colors: ['#FF4B2B', '#FF416C'],
      description: 'Hesaptan çıkış'
    },
  ];

  // Hook'ları her item için ayrı ayrı çağırıyoruz
  const scale0 = useSharedValue(1);
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const scale3 = useSharedValue(1);
  const scale4 = useSharedValue(1);
  const scale5 = useSharedValue(1);
  const scaleValues = [scale0, scale1, scale2, scale3, scale4, scale5];


  const [userName, setUserName] = useState<any>(null);
  const getUserInfo = async () => {
    const userRef = doc(db, 'users', user?.uid as string);
    const userDoc = await getDoc(userRef);
    const userName = userDoc.data()?.name;
    setUserName(userName);
  }

  useEffect(() => {
    if (!user?.uid) {
      setUserName(null);
      return;
    }
    
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserName(data?.name || null);
      }
    }, (error) => {
      console.error('Layout listener error:', error);
      setUserName(null);
    });
    
    getUserInfo();

    return () => unsubscribe();
  }, [user?.uid]);

  const CustomDrawerContent = (props: any) => {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header with user info */}
        <LinearGradient
          colors={[colors.background, colors.surface]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View
            style={styles.userContainer}
          >
            <View style={styles.avatarContainer}>
              {user?.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={styles.avatar}
                />
              ) : (
                <LinearGradient
                  colors={[colors.background, colors.primary]}
                  style={styles.avatarPlaceholder}
                >
                  <Text style={styles.avatarText}>
                    {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </Text>
                </LinearGradient>
              )}
              <View style={styles.onlineIndicator} />
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {userName || 'Hoş Geldiniz'}
              </Text>
              <Text style={styles.userEmail}>
                {user?.email}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Menu items */}
        <ScrollView
          style={styles.menuContainer}
          showsVerticalScrollIndicator={false}
        >
          {drawerItems.map((item, index) => {
            // Aktif sayfa kontrolü - daha detaylı
            let isActive = false;

            if (item.name === '(tabs)') {
              // Ana sayfa için: tabs içindeki herhangi bir sayfa veya boş pathname
              isActive = pathname.includes('(tabs)') ||
                pathname.includes('FortuneTellingScreen') ||
                pathname.includes('GuideScreen') ||
                pathname.includes('SignComments') ||
                pathname.includes('Signs') ||
                pathname.includes('MyFortunes') ||
                pathname === '/' ||
                pathname === '';
            } else {
              // Diğer sayfalar için pathname'de sayfa adı var mı kontrol et
              isActive = pathname.toLowerCase().includes(item.name.toLowerCase());
            }

            const scale = scaleValues[index];

            const animatedStyle = useAnimatedStyle(() => {
              return {
                transform: [{ scale: scale.value }],
              };
            });

            return (
              <View key={item.name}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPressIn={() => {
                    scale.value = withSpring(0.95);
                  }}
                  onPressOut={() => {
                    props.navigation.closeDrawer();
                    scale.value = withSpring(1);
                    router.push(item.route as any);
                  }}
                >
                  <Animated.View style={animatedStyle}>
                    <View style={[
                      styles.menuItem,
                      isActive && styles.activeMenuItem,
                      { borderColor: colors.border }
                    ]}>
                      <LinearGradient
                        colors={isActive ? item.colors as any : ['transparent', 'transparent'] as any}
                        style={styles.iconContainer}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Icon
                          name={item.icon as any}
                          zodiac={item.icon === 'cards-playing' ? true : false}
                          size={25}
                          color={isActive ? '#ffffff' : colors.text}
                        />
                      </LinearGradient>

                      <View style={styles.menuTextContainer}>
                        <Animated.Text style={[
                          styles.menuTitle,
                          { color: colors.text },
                          isActive && styles.activeMenuTitle,
                          item.name === 'Coins' && { color: colors.errorBorder }
                        ]}>
                          {item.title}
                        </Animated.Text>
                        <Text style={[
                          styles.menuDescription,
                          { color: colors.text + '80' }
                        ]}>
                          {item.description}
                        </Text>
                      </View>

                      {isActive && (
                        <View style={[styles.activeIndicator, { backgroundColor: item.colors[0] }]} />
                      )}
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View
          style={[styles.footer, { borderTopColor: colors.border }]}
        >
          <Text style={[styles.footerText, { color: colors.text + '60' }]}>
            Hexpresso v1.0.0
          </Text>
          <Text style={[styles.footerText, { color: colors.text + '60' }]}>
            Made By Faruk TUTKUS
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        header: () => <Header user={user as User} onPress={() => navigation.toggleDrawer()} />,
        sceneStyle: {
          backgroundColor: colors.background,
        },
        drawerType: 'slide',
        drawerStyle: {
          width: '80%',
          backgroundColor: colors.background,
        },
        drawerStatusBarAnimation: 'slide',
        overlayColor: 'rgba(0,0,0,0.5)',
      })}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerShown: true,
          title: 'Home',
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Profile"
        options={{
          title: 'Profile',
          headerShown: true,
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="About"
        options={{
          title: 'About',
          headerShown: true,
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          title: 'Settings',
          headerShown: true,
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="Logout"
        options={{
          title: 'Logout',
          headerShown: false,
          drawerItemStyle: { display: 'none' }
        }}
      />
      <Drawer.Screen
        name="MyFortunes/index"
        options={{
          title: 'Fallarım',
          headerShown: false,
          drawerItemStyle: { display: 'none' }
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Domine-Bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  activeMenuItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    textAlign: 'center',
    marginRight: 15,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Domine-SemiBold',
  },
  activeMenuTitle: {
    fontWeight: '700',
  },
  menuDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '20%',
    bottom: '20%',
    width: 4,
    borderRadius: 2,
  },
  footer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginVertical: 4,
  },
});