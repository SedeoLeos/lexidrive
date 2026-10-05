import type { Level } from '@/core/constants/levels';
import type { StudyActivity } from '@/core/constants/bootcamp';
import type { DailyStudy, LessonProgress, ScoreRecord, ScoreSource, UserProgress } from '../entities';

export interface IProgressRepository {
  getUserProgress(): Promise<UserProgress>;
  setCurrentLevel(level: Level): Promise<void>;

  /** Adds `seconds` of study to the given local day and activity (upsert). */
  addStudyTime(dateKey: string, activity: StudyActivity, seconds: number): Promise<void>;
  getDailyStudy(dateKey: string): Promise<DailyStudy>;
  /** Days (YYYY-MM-DD) whose total study time is at least `minSeconds`, newest first. */
  getActiveDays(minSeconds: number): Promise<string[]>;
  getStudyHistory(days: number, untilDateKey: string): Promise<DailyStudy[]>;

  getLessonProgress(lessonId: string): Promise<LessonProgress | null>;
  saveLessonAttempt(lessonId: string, ratio: number, completed: boolean): Promise<void>;

  addScore(source: ScoreSource, refId: string, score: number, maxScore: number): Promise<void>;
  getScoreHistory(limit: number): Promise<ScoreRecord[]>;
}
