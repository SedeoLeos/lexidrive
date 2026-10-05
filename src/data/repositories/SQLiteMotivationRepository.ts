import type { SQLiteDatabase } from 'expo-sqlite';
import type { XpSource } from '@/domain/entities';
import type { IMotivationRepository } from '@/domain/repositories';

export class SQLiteMotivationRepository implements IMotivationRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async addXp(dateKey: string, source: XpSource, refId: string, points: number): Promise<void> {
    await this.db.runAsync(
      'INSERT INTO xp_log (date_key, source, ref_id, points, created_at) VALUES (?, ?, ?, ?, ?)',
      dateKey,
      source,
      refId,
      points,
      new Date().toISOString(),
    );
  }

  async getTotalXp(): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number | null }>('SELECT SUM(points) AS n FROM xp_log');
    return row?.n ?? 0;
  }

  async getXpForDate(dateKey: string): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number | null }>(
      'SELECT SUM(points) AS n FROM xp_log WHERE date_key = ?',
      dateKey,
    );
    return row?.n ?? 0;
  }

  async getSourcesForDate(dateKey: string): Promise<XpSource[]> {
    const rows = await this.db.getAllAsync<{ source: XpSource }>(
      'SELECT DISTINCT source FROM xp_log WHERE date_key = ?',
      dateKey,
    );
    return rows.map((r) => r.source);
  }

  async hasXp(source: XpSource, refId: string): Promise<boolean> {
    const row = await this.db.getFirstAsync<{ n: number }>(
      'SELECT COUNT(*) AS n FROM xp_log WHERE source = ? AND ref_id = ?',
      source,
      refId,
    );
    return (row?.n ?? 0) > 0;
  }

  async countBySource(source: XpSource): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM xp_log WHERE source = ?', source);
    return row?.n ?? 0;
  }

  async getUnlockedAchievements(): Promise<Record<string, string>> {
    const rows = await this.db.getAllAsync<{ id: string; unlocked_at: string }>(
      'SELECT id, unlocked_at FROM achievements',
    );
    return Object.fromEntries(rows.map((r) => [r.id, r.unlocked_at]));
  }

  async unlockAchievement(id: string, unlockedAt: string): Promise<void> {
    await this.db.runAsync('INSERT OR IGNORE INTO achievements (id, unlocked_at) VALUES (?, ?)', id, unlockedAt);
  }
}
