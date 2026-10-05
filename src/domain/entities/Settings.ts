export type Accent = 'en-GB' | 'en-US';

export interface AppSettings {
  accent: Accent;
  /** Speech rate, 1 = natural. */
  speechRate: number;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
  /** Words the learner told the spell checker to accept. */
  customWords: string[];
  /** Immersion: French translations hidden until tapped, English read aloud automatically. */
  immersionMode: boolean;
  /** Whether the welcome flow has been completed. */
  onboarded: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  accent: 'en-GB',
  speechRate: 0.92,
  reminderEnabled: false,
  reminderHour: 19,
  reminderMinute: 30,
  customWords: [],
  immersionMode: false,
  onboarded: false,
};
