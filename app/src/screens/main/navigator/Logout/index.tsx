import { auth } from '@api/config.firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useRef } from "react";
import { Alert, AppState, InteractionManager } from "react-native";
import { MMKV } from "react-native-mmkv";

const Logout = () => {
  const isMountedRef = useRef(true);
  const navigationAttempted = useRef(false);
  const logoutInProgress = useRef(false);
  const timeoutRefs = useRef<number[]>([]);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
  };

  const addTimeout = (callback: () => void, delay: number): number => {
    const timeout = setTimeout(callback, delay);
    timeoutRefs.current.push(timeout);
    return timeout;
  };

  const navigateToStartScreen = () => {
    if (navigationAttempted.current || !isMountedRef.current) {
      console.log("Navigation already attempted or component unmounted");
      return;
    }
    
    navigationAttempted.current = true;
    console.log("StartScreen'e yönlendiriliyor...");
    
    const attemptNavigation = (method: 'replace' | 'push', fallback?: () => void) => {
      try {
        if (method === 'replace') {
          router.replace('/src/screens/side/StartScreen');
        } else {
          router.push('/src/screens/side/StartScreen');
        }
        console.log(`✅ Navigation successful with ${method}`);
      } catch (error) {
        console.log(`❌ Router ${method} navigation failed:`, error);
        if (fallback) {
          addTimeout(fallback, 100);
        }
      }
    };

    // Primary navigation attempt
    attemptNavigation('replace', () => {
      // Fallback 1: router.push
      attemptNavigation('push', () => {
        // Fallback 2: Force navigation after delay
        if (isMountedRef.current) {
          console.log("🔄 Attempting final navigation fallback...");
          try {
            router.replace('/src/screens/side/StartScreen');
          } catch (finalError) {
            console.error("❌ All navigation methods failed:", finalError);
            // Last resort: show alert to user
            Alert.alert(
              "Çıkış Tamamlandı",
              "Uygulamayı yeniden başlatın.",
              [{ text: "Tamam" }]
            );
          }
        }
      });
    });
  };

  const safeAsyncOperation = async <T,>(
    operation: () => Promise<T>,
    operationName: string,
    fallback?: T
  ): Promise<T | undefined> => {
    try {
      if (!isMountedRef.current) {
        console.log(`🚫 ${operationName}: Component unmounted, skipping`);
        return fallback;
      }

      const result = await operation();
      console.log(`✅ ${operationName} completed successfully`);
      return result;
    } catch (error) {
      console.log(`⚠️ ${operationName} failed:`, error);
      return fallback;
    }
  };

  useEffect(() => {
    // Prevent multiple simultaneous logout attempts
    if (logoutInProgress.current) {
      console.log("🚫 Logout already in progress, skipping");
      return;
    }

    const performLogout = async () => {
      logoutInProgress.current = true;
      
      try {
        console.log("🚀 Logout işlemi başlıyor...");
        
        // Step 1: Firebase logout
        await safeAsyncOperation(
          () => signOut(auth),
          "Firebase logout"
        );

        // Step 2: Google logout (non-critical)
        await safeAsyncOperation(
          () => GoogleSignin.signOut(),
          "Google Sign-In logout"
        );

        // Step 3: Clear MMKV cache (non-critical)
        await safeAsyncOperation(
          async () => {
            const signsStorage = new MMKV({ id: 'signs_data' });
            signsStorage.clearAll();
            
            const seersStorage = new MMKV({ id: 'seers_data' });
            seersStorage.clearAll();
            
            const defaultStorage = new MMKV();
            const keys = defaultStorage.getAllKeys();
            
            keys.forEach(key => {
              if (key.includes('cache_') || key.includes('app_') || key.includes('user_')) {
                defaultStorage.delete(key);
              }
            });
            
            return true;
          },
          "MMKV cache cleanup"
        );

        // Step 4: Clear AsyncStorage (non-critical)
        await safeAsyncOperation(
          async () => {
            const allKeys = await AsyncStorage.getAllKeys();
            const keysToRemove = allKeys.filter(key => 
              !key.includes('firebase') && 
              !key.includes('@react-native-async-storage_dont_remove') &&
              !key.includes('ReactNativePersistence') &&
              !key.includes('expo') &&
              !key.includes('ExponentDeviceId')
            );
            
            if (keysToRemove.length > 0) {
              await AsyncStorage.multiRemove(keysToRemove);
            }
            
            return true;
          },
          "AsyncStorage cleanup"
        );

        console.log("✅ Logout cleanup completed");

        // Step 5: Navigation with multiple fallbacks
        InteractionManager.runAfterInteractions(() => {
          addTimeout(() => {
            navigateToStartScreen();
          }, 100);
        });

        // Fallback navigation attempts
        addTimeout(() => {
          if (!navigationAttempted.current && isMountedRef.current) {
            console.log("🔄 Fallback navigation executing...");
            navigateToStartScreen();
          }
        }, 500);

        addTimeout(() => {
          if (!navigationAttempted.current && isMountedRef.current) {
            console.log("🔄 Final fallback navigation executing...");
            navigationAttempted.current = false; // Reset to allow retry
            navigateToStartScreen();
          }
        }, 1500);

      } catch (error) {
        console.error("❌ Critical logout error:", error);
        
        // Even on critical error, attempt navigation
        InteractionManager.runAfterInteractions(() => {
          addTimeout(() => {
            navigateToStartScreen();
          }, 100);
        });
      } finally {
        logoutInProgress.current = false;
      }
    };

    // Start logout with slight delay to ensure component is mounted
    addTimeout(() => {
      if (isMountedRef.current) {
        performLogout();
      }
    }, 50);

    // Component unmount cleanup
    return () => {
      isMountedRef.current = false;
      clearAllTimeouts();
      logoutInProgress.current = false;
    };
  }, []);

  // Handle app state changes during logout
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log("📱 App going to background during logout");
        clearAllTimeouts();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  return null;
};

export default Logout;