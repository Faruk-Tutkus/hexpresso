import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Notification handler configuration
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface FortuneNotificationData {
  seerName: string;
  fortuneType: string;
  responseTimeMinutes: number;
}

const useFortuneNotificationManager = () => {
  
  useEffect(() => {
    // Request permissions on component mount
    requestPermissions();
  }, []);

  const requestPermissions = async (): Promise<boolean> => {
    try {
      console.log('🔔 Requesting notification permissions...');
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('fortune-notifications', {
          name: 'Fortune Notifications',
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
        console.log('❌ Notification permission denied');
        return false;
      }

      console.log('✅ Notification permission granted');
      return true;
    } catch (error) {
      console.error('❌ Error requesting notification permissions:', error);
      return false;
    }
  };

  const scheduleFortuneCompletionNotification = async (
    fortuneData: FortuneNotificationData
  ): Promise<string | null> => {
    try {
      console.log('📅 Scheduling fortune completion notification...', fortuneData);
      
      // Check permissions first
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log('❌ No notification permission, skipping schedule');
        return null;
      }

      // Calculate trigger time (convert minutes to seconds)
      const triggerSeconds = fortuneData.responseTimeMinutes * 60;
      
      console.log(`⏰ Notification will trigger in ${triggerSeconds} seconds (${fortuneData.responseTimeMinutes} minutes)`);

      // Schedule the notification
      // @ts-ignore - Expo Notifications trigger type issue
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔮 Falınız Hazır!',
          body: `${fortuneData.seerName} tarafından ${fortuneData.fortuneType === 'Rüya Yorumu' ? 'Rüya' : fortuneData.fortuneType} yorumunuz tamamlandı.`,
          data: {
            type: 'fortune_completed',
            seerName: fortuneData.seerName,
            fortuneType: fortuneData.fortuneType,
          },
          sound: true,
        },
        trigger: {
          type: 'timeInterval',
          seconds: triggerSeconds,
        } as any,
      });

      console.log(`✅ Fortune completion notification scheduled with ID: ${notificationId}`);
      
      // Also schedule a reminder notification 5 minutes before completion (if response time > 10 minutes)
      if (fortuneData.responseTimeMinutes > 10) {
        const reminderTriggerSeconds = Math.max(triggerSeconds - (5 * 60), 60); // At least 1 minute from now
        
        // @ts-ignore - Expo Notifications trigger type issue
        const reminderNotificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏳ Falınız Yakında Hazır',
            body: `${fortuneData.seerName} tarafından ${fortuneData.fortuneType} yorumunuz 5 dakika içinde tamamlanacak.`,
            data: {
              type: 'fortune_reminder',
              seerName: fortuneData.seerName,
              fortuneType: fortuneData.fortuneType,
            },
            sound: false,
          },
          trigger: {
            type: 'timeInterval',
            seconds: reminderTriggerSeconds,
          } as any,
        });

        console.log(`🔔 Fortune reminder notification scheduled with ID: ${reminderNotificationId}`);
      }

      return notificationId;
      
    } catch (error) {
      console.error('❌ Error scheduling fortune notification:', error);
      return null;
    }
  };

  const cancelFortuneNotification = async (notificationId: string): Promise<boolean> => {
    try {
      console.log(`🗑️ Cancelling notification with ID: ${notificationId}`);
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('✅ Notification cancelled successfully');
      return true;
    } catch (error) {
      console.error('❌ Error cancelling notification:', error);
      return false;
    }
  };

  const cancelAllFortuneNotifications = async (): Promise<boolean> => {
    try {
      console.log('🗑️ Cancelling all fortune notifications...');
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ All notifications cancelled successfully');
      return true;
    } catch (error) {
      console.error('❌ Error cancelling all notifications:', error);
      return false;
    }
  };

  const getScheduledNotifications = async () => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('📋 Scheduled notifications:', scheduledNotifications);
      return scheduledNotifications;
    } catch (error) {
      console.error('❌ Error getting scheduled notifications:', error);
      return [];
    }
  };

  return {
    scheduleFortuneCompletionNotification,
    cancelFortuneNotification,
    cancelAllFortuneNotifications,
    getScheduledNotifications,
    requestPermissions,
  };
};

export default useFortuneNotificationManager; 