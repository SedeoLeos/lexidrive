import type { IconName } from './icons';

/** Everything that earns experience points. */
export type XpSource =
  | 'quiz_correct'
  | 'lesson_completed'
  | 'flashcard'
  | 'listening'
  | 'journal'
  | 'exam_passed'
  | 'daily_goal';

export interface XpLevel {
  /** 1-based experience level (distinct from the CEFR level). */
  level: number;
  title: string;
  /** XP at which this level starts. */
  floor: number;
  /** XP at which the next level starts. */
  ceiling: number;
}

export interface XpSummary {
  total: number;
  today: number;
  level: XpLevel;
  /** 0 → 1 progress inside the current level. */
  progress: number;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

export interface Achievement extends AchievementDefinition {
  unlockedAt: string | null;
}

/** Feedback returned to the UI after any rewarded action, so it can celebrate. */
export interface Reward {
  points: number;
  reason: string;
  totalXp: number;
  /** Set when this reward crossed an experience level. */
  levelUp: XpLevel | null;
  achievements: AchievementDefinition[];
}

/** Aggregated learner statistics used to evaluate achievements. */
export interface AchievementStats {
  lessonsCompleted: number;
  wordsLearned: number;
  flashcardReviews: number;
  listeningSessions: number;
  journalEntries: number;
  examsPassed: number;
  totalStudySeconds: number;
  streak: number;
  totalXp: number;
}
