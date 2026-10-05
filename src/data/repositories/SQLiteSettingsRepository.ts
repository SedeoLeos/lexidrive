import type { SQLiteDatabase } from 'expo-sqlite';
import { DEFAULT_SETTINGS, type AppSettings } from '@/domain/entities';
import type { ISettingsRepository } from '@/domain/repositories';

const SETTINGS_KEY = 'app_settings';

/** Settings are stored as one JSON document, merged over defaults so new keys get sane values. */
export class SQLiteSettingsRepository implements ISettingsRepository {
  private cache: AppSettings | null = null;

  constructor(private readonly db: SQLiteDatabase) {}

  async get(): Promise<AppSettings> {
    if (this.cache) return this.cache;
    const raw = await this.getValue(SETTINGS_KEY);
    let stored: Partial<AppSettings> = {};
    if (raw) {
      try {
        stored = JSON.parse(raw) as Partial<AppSettings>;
      } catch {
        stored = {};
      }
    }
    this.cache = { ...DEFAULT_SETTINGS, ...stored };
    return this.cache;
  }

  async update(patch: Partial<AppSettings>): Promise<AppSettings> {
    const next = { ...(await this.get()), ...patch };
    await this.setValue(SETTINGS_KEY, JSON.stringify(next));
    this.cache = next;
    return next;
  }

  async getValue(key: string): Promise<string | null> {
    const row = await this.db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
    return row?.value ?? null;
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      key,
      value,
    );
  }
}
