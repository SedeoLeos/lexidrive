import type { XpSource } from '../entities';

export interface IMotivationRepository {
  addXp(dateKey: string, source: XpSource, refId: string, points: number): Promise<void>;
  getTotalXp(): Promise<number>;
  getXpForDate(dateKey: string): Promise<number>;
  /** Sources that earned XP on a given day (drives the daily path checkmarks). */
  getSourcesForDate(dateKey: string): Promise<XpSource[]>;
  hasXp(source: XpSource, refId: string): Promise<boolean>;
  countBySource(source: XpSource): Promise<number>;
  getUnlockedAchievements(): Promise<Record<string, string>>;
  unlockAchievement(id: string, unlockedAt: string): Promise<void>;
}
