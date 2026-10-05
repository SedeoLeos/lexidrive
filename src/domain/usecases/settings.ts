import type { AppSettings } from '../entities';
import type { ISettingsRepository } from '../repositories';
import type { INotificationService, ISpeechService } from '../services';

export class GetSettingsUseCase {
  constructor(private readonly settings: ISettingsRepository) {}
  execute(): Promise<AppSettings> {
    return this.settings.get();
  }
}

export class ReminderPermissionDeniedError extends Error {
  constructor() {
    super('Autorise les notifications dans les réglages du téléphone pour recevoir le rappel quotidien.');
    this.name = 'ReminderPermissionDeniedError';
  }
}

/** Persists settings and keeps the scheduled daily reminder in sync. */
export class UpdateSettingsUseCase {
  constructor(
    private readonly settings: ISettingsRepository,
    private readonly notifications: INotificationService,
  ) {}

  async execute(patch: Partial<AppSettings>): Promise<AppSettings> {
    const touchesReminder =
      patch.reminderEnabled !== undefined || patch.reminderHour !== undefined || patch.reminderMinute !== undefined;

    if (touchesReminder) {
      const current = await this.settings.get();
      const next = { ...current, ...patch };
      if (next.reminderEnabled) {
        const granted = await this.notifications.requestPermission();
        if (!granted) {
          await this.settings.update({ reminderEnabled: false });
          throw new ReminderPermissionDeniedError();
        }
        await this.notifications.scheduleDailyReminder(next.reminderHour, next.reminderMinute);
      } else {
        await this.notifications.cancelDailyReminder();
      }
    }
    return this.settings.update(patch);
  }
}

export class AddCustomWordUseCase {
  constructor(private readonly settings: ISettingsRepository) {}

  async execute(word: string): Promise<AppSettings> {
    const w = word.trim().toLowerCase();
    const current = await this.settings.get();
    if (!w || current.customWords.includes(w)) return current;
    return this.settings.update({ customWords: [...current.customWords, w] });
  }
}

/** Reads text aloud with the learner's accent and rate preferences. */
export class SpeakTextUseCase {
  constructor(
    private readonly settings: ISettingsRepository,
    private readonly speech: ISpeechService,
  ) {}

  /** @param rateFactor multiplies the learner's preferred rate (e.g. 0.7 for "slow replay"). */
  async execute(text: string, onDone?: () => void, rateFactor = 1): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed) return;
    const { accent, speechRate } = await this.settings.get();
    await this.speech.stop();
    await this.speech.speak(trimmed, { accent, rate: speechRate * rateFactor, onDone });
  }

  stop(): Promise<void> {
    return this.speech.stop();
  }
}
