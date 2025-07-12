import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV({ id: 'daily_notifications' });

const useDailyNotificationManager = () => {
  
  // 10 farklı motivasyon mesajı
  const dailyMessages = [
    {
      title: '🔮 Bugün Nasıl Geçti?',
      body: 'Gününüzü falcılarımızla paylaşın ve yarın için ipuçları alın!'
    },
    {
      title: '✨ Kaderiniz Sizi Bekliyor',
      body: 'Bugün hangi sorularınız var? Falcılarımız yanıtlarınızı hazırladı!'
    },
    {
      title: '🌙 Akşam Saatleri Sihirli',
      body: 'En doğru fallar akşam saatlerinde bakılır. Hemen bir fal baktırın!'
    },
    {
      title: '🃏 Yeni Keşifler Zamanı',
      body: 'Tarot kartları bugün hangi mesajları veriyor? Merak etmiyor musunuz?'
    },
    {
      title: '💫 Bugün Şanslı Gününüz',
      body: 'Yıldızlar size özel mesajlar gönderiyor. Falcılarımızla buluşun!'
    },
    {
      title: '🌟 Rüyalarınızın Anlamı',
      body: 'Geçen gece gördüğünüz rüya size ne anlatmak istiyordu? Öğrenin!'
    },
    {
      title: '☕ Kahve Falı Zamanı',
      body: 'Türk kahvesi hazır mı? Telvenizle geleceğinizi keşfedin!'
    },
    {
      title: '✋ Elleriniz Konuşuyor',
      body: 'Avuç içinizdeki çizgiler bugün farklı bir hikaye anlatıyor!'
    },
    {
      title: '🎭 Günün Sırrı',
      body: 'Her gün yeni bir sır, yeni bir keşif! Falcılarımız sizi bekliyor.'
    },
    {
      title: '💭 Merak Ettiğiniz Sorular',
      body: 'Aklınızdaki o soru hala yanıtsız mı? Cevabını bulma zamanı!'
    }
  ];

  const requestPermissions = async (): Promise<boolean> => {
    try {
      console.log('🔔 Requesting daily notification permissions...');
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-notifications', {
          name: 'Daily Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('❌ Daily notification permission denied');
        return false;
      }

      console.log('✅ Daily notification permission granted');
      return true;
    } catch (error) {
      console.error('❌ Error requesting daily notification permissions:', error);
      return false;
    }
  };

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * dailyMessages.length);
    return dailyMessages[randomIndex];
  };

  // Check if user has manually disabled notifications
  const hasUserDisabledNotifications = (): boolean => {
    const userDisabled = storage.getBoolean('user_disabled_notifications');
    return userDisabled === true;
  };

  // Set user preference for notifications
  const setUserNotificationPreference = (enabled: boolean): void => {
    storage.set('user_disabled_notifications', !enabled);
    console.log(`📱 User notification preference set to: ${enabled ? 'enabled' : 'disabled'}`);
  };

  // Auto-initialize notifications (called on app start)
  const autoInitializeDailyNotifications = async (): Promise<boolean> => {
    try {
      console.log('🚀 Auto-initializing daily notifications...');
      
      // Check if user has manually disabled notifications
      if (hasUserDisabledNotifications()) {
        console.log('🔕 User has disabled notifications, skipping auto-initialization');
        return false;
      }

      // Check if notifications are already scheduled
      const existingNotifications = await getScheduledDailyNotifications();
      if (existingNotifications.length > 0) {
        console.log(`✅ ${existingNotifications.length} notifications already scheduled, skipping auto-initialization`);
        return true;
      }

      // Auto-setup notifications
      const success = await setupDailyNotifications();
      if (success) {
        console.log('✅ Daily notifications auto-initialized successfully');
      } else {
        console.log('❌ Failed to auto-initialize daily notifications');
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Error during auto-initialization:', error);
      return false;
    }
  };

  const setupDailyNotifications = async (): Promise<boolean> => {
    try {
      console.log('🌅 Setting up daily notifications...');
      
      // Check permissions first
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log('❌ No permission for daily notifications');
        return false;
      }

      // Cancel any existing daily notifications
      await cancelDailyNotifications();

      // Schedule daily notifications for the next 30 days
      const notificationIds: string[] = [];
      const today = new Date();
      
      for (let i = 0; i < 90; i++) {
        const notificationDate = new Date(today);
        notificationDate.setDate(today.getDate() + i);
        notificationDate.setHours(18, 0, 0, 0); // 6 PM
        
        // Skip if the time has already passed today
        if (i === 0 && notificationDate.getTime() <= Date.now()) {
          notificationDate.setDate(notificationDate.getDate() + 1);
        }

        const randomMessage = getRandomMessage();
        
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: randomMessage.title,
            body: randomMessage.body,
            data: {
              type: 'daily_reminder',
              date: notificationDate.toISOString(),
            },
            sound: false,
            vibrate: [0, 250, 250, 250],
          },
          trigger: {
            type: 'date',
            date: notificationDate,
          } as any,
        });

        notificationIds.push(notificationId);
        console.log(`📅 Scheduled daily notification for ${notificationDate.toLocaleString()}: ${notificationId}`);
      }

      console.log(`✅ Successfully scheduled ${notificationIds.length} daily notifications`);
      return true;
      
    } catch (error) {
      console.error('❌ Error setting up daily notifications:', error);
      return false;
    }
  };

  const cancelDailyNotifications = async (): Promise<boolean> => {
    try {
      console.log('🗑️ Cancelling existing daily notifications...');
      
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const dailyNotifications = scheduledNotifications.filter(notification => 
        notification.content.data?.type === 'daily_reminder'
      );

      for (const notification of dailyNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log(`🗑️ Cancelled daily notification: ${notification.identifier}`);
      }

      console.log(`✅ Cancelled ${dailyNotifications.length} daily notifications`);
      return true;
      
    } catch (error) {
      console.error('❌ Error cancelling daily notifications:', error);
      return false;
    }
  };

  const refreshDailyNotifications = async (): Promise<boolean> => {
    try {
      console.log('🔄 Refreshing daily notifications...');
      
      // Cancel existing and setup new ones
      await cancelDailyNotifications();
      const success = await setupDailyNotifications();
      
      if (success) {
        console.log('✅ Daily notifications refreshed successfully');
      } else {
        console.log('❌ Failed to refresh daily notifications');
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Error refreshing daily notifications:', error);
      return false;
    }
  };

  const getScheduledDailyNotifications = async () => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const dailyNotifications = scheduledNotifications.filter(notification => 
        notification.content.data?.type === 'daily_reminder'
      );
      
      console.log(`📋 Found ${dailyNotifications.length} scheduled daily notifications`);
      return dailyNotifications;
      
    } catch (error) {
      console.error('❌ Error getting scheduled daily notifications:', error);
      return [];
    }
  };

  const enableDailyNotifications = async (): Promise<boolean> => {
    console.log('🔛 Enabling daily notifications...');
    setUserNotificationPreference(true);
    return await setupDailyNotifications();
  };

  const disableDailyNotifications = async (): Promise<boolean> => {
    console.log('🔕 Disabling daily notifications...');
    setUserNotificationPreference(false);
    return await cancelDailyNotifications();
  };

  return {
    setupDailyNotifications,
    cancelDailyNotifications,
    refreshDailyNotifications,
    getScheduledDailyNotifications,
    enableDailyNotifications,
    disableDailyNotifications,
    autoInitializeDailyNotifications,
    hasUserDisabledNotifications,
    requestPermissions,
  };
};

export default useDailyNotificationManager; 