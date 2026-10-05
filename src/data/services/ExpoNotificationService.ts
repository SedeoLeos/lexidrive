import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { INotificationService } from '@/domain/services';

const REMINDER_ID = 'lexidrive-daily-reminder';
const CHANNEL_ID = 'daily-reminder';

const MESSAGES = [
  { title: 'Ton Bootcamp t’attend', body: 'Quelques minutes maintenant valent mieux qu’une heure demain.' },
  { title: 'Le journal du jour', body: 'Raconte ta journée en français, puis traduis-la en anglais.' },
  { title: 'Garde ta série', body: 'Une session, même courte, et ta série continue.' },
];

/** Local notifications only — nothing leaves the device. */
export class ExpoNotificationService implements INotificationService {
  /** Call once at startup so reminders display while the app is in foreground. */
  static configureForegroundHandling(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });
  }

  private async ensureChannel(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Rappel quotidien',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: '#3D469D',
    });
  }

  async requestPermission(): Promise<boolean> {
    await this.ensureChannel();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  }

  async scheduleDailyReminder(hour: number, minute: number): Promise<void> {
    await this.cancelDailyReminder();
    await this.ensureChannel();
    const message = MESSAGES[new Date().getDay() % MESSAGES.length];
    await Notifications.scheduleNotificationAsync({
      identifier: REMINDER_ID,
      content: { title: message.title, body: message.body, data: { route: '/' } },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: CHANNEL_ID,
      },
    });
  }

  async cancelDailyReminder(): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => undefined);
  }
}
