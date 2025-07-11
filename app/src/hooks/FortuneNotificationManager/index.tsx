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
    fortuneData: FortuneNotificationData,
    fortuneId?: string
  ): Promise<string | null> => {
    try {
      console.log(`⏰ Scheduling fortune completion notification for ${fortuneData.seerName} - ${fortuneData.fortuneType}`);
      
      // Check permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log('❌ No notification permission, skipping schedule');
        return null;
      }

      // Calculate absolute completion time (from now + response time)
      const completionTime = new Date(Date.now() + (fortuneData.responseTimeMinutes * 60 * 1000));
      
      console.log(`⏰ Notification will trigger at: ${completionTime.toLocaleString()} (${fortuneData.responseTimeMinutes} minutes from now)`);

      // Schedule the main completion notification (with vibration)
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔮 Falınız Hazır!',
          body: `${fortuneData.seerName} tarafından ${fortuneData.fortuneType === 'Rüya Yorumu' ? 'Rüya' : fortuneData.fortuneType} yorumunuz tamamlandı.`,
          data: {
            type: 'fortune_completed',
            seerName: fortuneData.seerName,
            fortuneType: fortuneData.fortuneType,
            fortuneId: fortuneId,
          },
          sound: false,
          vibrate: [0, 250, 250, 250],
        },
        trigger: {
          type: 'date',
          date: completionTime,
        } as any,
      });

      console.log(`✅ Fortune completion notification scheduled with ID: ${notificationId}`);
      
      // Schedule 5-minute warning notification (silent) if response time is more than 5 minutes
      if (fortuneData.responseTimeMinutes > 5) {
        const warningTime = new Date(completionTime.getTime() - (5 * 60 * 1000));
        
        const warningNotificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏳ Falınız Yakında Hazır',
            body: `${fortuneData.seerName} tarafından ${fortuneData.fortuneType === 'Rüya Yorumu' ? 'Rüya' : fortuneData.fortuneType} yorumunuz 5 dakika içinde tamamlanacak.`,
            data: {
              type: 'fortune_warning',
              seerName: fortuneData.seerName,
              fortuneType: fortuneData.fortuneType,
              fortuneId: fortuneId,
            },
            sound: false,
            vibrate: undefined,
          },
          trigger: {
            type: 'date',
            date: warningTime,
          } as any,
        });

        console.log(`🔔 Fortune warning notification scheduled with ID: ${warningNotificationId}`);
      }

      return notificationId;
      
    } catch (error) {
      console.error('❌ Error scheduling fortune notification:', error);
      return null;
    }
  };

  const updateFortuneNotificationTime = async (
    fortuneId: string,
    newResponseTimeMinutes: number,
    fortuneData: FortuneNotificationData,
    completionTime?: Date
  ): Promise<string | null> => {
    try {
      console.log(`⏰ Updating fortune notification time for ${fortuneId} to ${newResponseTimeMinutes} minutes`);
      
      // Cancel existing notifications for this fortune
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const fortuneNotifications = scheduledNotifications.filter(notification => 
        notification.content.data?.fortuneId === fortuneId ||
        notification.content.data?.seerName === fortuneData.seerName
      );
      
      // Cancel old notifications
      for (const notification of fortuneNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        console.log(`🗑️ Cancelled old notification: ${notification.identifier}`);
      }
      
      // Check permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log('❌ No notification permission, skipping schedule');
        return null;
      }

      // Use provided completion time or calculate from response time
      const finalCompletionTime = completionTime || new Date(Date.now() + (newResponseTimeMinutes * 60 * 1000));
      
      console.log(`⏰ New notification will trigger at: ${finalCompletionTime.toLocaleString()} (${newResponseTimeMinutes} minutes from now)`);

      // Schedule new main completion notification (with vibration)
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔮 Falınız Hazır!',
          body: `${fortuneData.seerName} tarafından ${fortuneData.fortuneType === 'Rüya Yorumu' ? 'Rüya' : fortuneData.fortuneType} yorumunuz tamamlandı.`,
          data: {
            type: 'fortune_completed',
            seerName: fortuneData.seerName,
            fortuneType: fortuneData.fortuneType,
            fortuneId: fortuneId,
          },
          sound: false,
          vibrate: [0, 250, 250, 250],
        },
        trigger: {
          type: 'date',
          date: finalCompletionTime,
        } as any,
      });

      console.log(`✅ Updated fortune notification scheduled with ID: ${notificationId}`);
      
      // Schedule new 5-minute warning notification (silent) if response time is more than 5 minutes
      if (newResponseTimeMinutes > 5) {
        const warningTime = new Date(finalCompletionTime.getTime() - (5 * 60 * 1000));
        
        const warningNotificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '⏳ Falınız Yakında Hazır',
            body: `${fortuneData.seerName} tarafından ${fortuneData.fortuneType === 'Rüya Yorumu' ? 'Rüya' : fortuneData.fortuneType} yorumunuz 5 dakika içinde tamamlanacak.`,
            data: {
              type: 'fortune_warning',
              seerName: fortuneData.seerName,
              fortuneType: fortuneData.fortuneType,
              fortuneId: fortuneId,
            },
            sound: false,
            vibrate: undefined,
          },
          trigger: {
            type: 'date',
            date: warningTime,
          } as any,
        });

        console.log(`🔔 Updated fortune warning notification scheduled with ID: ${warningNotificationId}`);
      }

      return notificationId;
      
    } catch (error) {
      console.error('❌ Error updating fortune notification:', error);
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
    updateFortuneNotificationTime,
    cancelFortuneNotification,
    cancelAllFortuneNotifications,
    getScheduledNotifications,
    requestPermissions,
  };
};

export default useFortuneNotificationManager; 