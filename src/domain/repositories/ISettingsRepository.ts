import type { AppSettings } from '../entities';

export interface ISettingsRepository {
  get(): Promise<AppSettings>;
  update(patch: Partial<AppSettings>): Promise<AppSettings>;
  getValue(key: string): Promise<string | null>;
  setValue(key: string, value: string): Promise<void>;
}
