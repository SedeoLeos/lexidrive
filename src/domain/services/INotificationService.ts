/** Local (on-device) notifications for the daily study reminder. */
export interface INotificationService {
  requestPermission(): Promise<boolean>;
  /** Cancels any previous reminder and schedules a repeating one at hour:minute local time. */
  scheduleDailyReminder(hour: number, minute: number): Promise<void>;
  cancelDailyReminder(): Promise<void>;
}
