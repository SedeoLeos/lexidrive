import type { Level } from '@/core/constants/levels';
import type { StudyActivity } from '@/core/constants/bootcamp';

/** Persistent learner state (single row). */
export interface UserProgress {
  currentLevel: Level;
  dailyGoalMinutes: number;
  createdAt: string;
  updatedAt: string;
}

/** Seconds studied per Bootcamp module for one day. */
export type ActivityBreakdown = Record<StudyActivity, number>;

export interface DailyStudy {
  dateKey: string;
  totalSeconds: number;
  breakdown: ActivityBreakdown;
}

export interface LessonProgress {
  lessonId: string;
  bestScore: number;
  attempts: number;
  completed: boolean;
  lastStudiedAt: string;
}

export type ScoreSource = 'lesson' | 'exam';

export interface ScoreRecord {
  id: number;
  source: ScoreSource;
  refId: string;
  score: number;
  maxScore: number;
  takenAt: string;
}

export interface StreakInfo {
  current: number;
  longest: number;
  /** Whether today already counts. */
  todayCounted: boolean;
}
