import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 1. Configure foreground notification presentation behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions from the OS and configure Android channels.
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    // Android 8.0+ (Oreo) requires notification channels
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('habit-reminders', {
        name: 'Habit Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#38bdf8',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Schedule a recurring daily habit reminder at specified hour and minute.
 */
export const scheduleHabitReminder = async (
  habitId: string,
  title: string,
  hour: number,
  minute: number
): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return null;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for: ${title}`,
        body: `Don't break your streak! Take a moment to complete your habit today.`,
        data: { habitId },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    return id;
  } catch (error) {
    console.error('Error scheduling habit reminder:', error);
    return null;
  }
};

/**
 * Cancel a previously scheduled notification.
 */
export const cancelHabitReminder = async (notificationId: string): Promise<void> => {
  try {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  } catch (error) {
    console.error('Error cancelling notification:', error);
  }
};

/**
 * Send an immediate test notification to verify device setup.
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return false;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Habit Tracker Active',
        body: 'Notifications are configured and working smoothly on your device!',
        sound: true,
      },
      trigger: null, // trigger immediately
    });

    return true;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};
