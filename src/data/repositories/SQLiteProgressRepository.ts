import type { SQLiteDatabase } from 'expo-sqlite';
import { DAILY_GOAL_MINUTES, STUDY_ACTIVITIES, type StudyActivity } from '@/core/constants/bootcamp';
import { isLevel, type Level } from '@/core/constants/levels';
import { shiftDateKey } from '@/core/utils/date';
import type { DailyStudy, LessonProgress, ScoreRecord, ScoreSource, UserProgress } from '@/domain/entities';
import { emptyBreakdown } from '@/domain/logic/studyTime';
import type { IProgressRepository } from '@/domain/repositories';

interface UserProgressRow {
  current_level: string;
  daily_goal_minutes: number;
  created_at: string;
  updated_at: string;
}

interface StudyRow {
  date_key: string;
  activity: string;
  seconds: number;
}

function isActivity(value: string): value is StudyActivity {
  return (STUDY_ACTIVITIES as readonly string[]).includes(value);
}

function aggregate(dateKey: string, rows: StudyRow[]): DailyStudy {
  const breakdown = emptyBreakdown();
  let totalSeconds = 0;
  for (const r of rows) {
    if (r.date_key !== dateKey) continue;
    totalSeconds += r.seconds;
    if (isActivity(r.activity)) breakdown[r.activity] += r.seconds;
  }
  return { dateKey, totalSeconds, breakdown };
}

export class SQLiteProgressRepository implements IProgressRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async getUserProgress(): Promise<UserProgress> {
    const row = await this.db.getFirstAsync<UserProgressRow>('SELECT * FROM user_progress WHERE id = 1');
    const now = new Date().toISOString();
    if (!row) {
      return { currentLevel: 'A1', dailyGoalMinutes: DAILY_GOAL_MINUTES, createdAt: now, updatedAt: now };
    }
    return {
      currentLevel: isLevel(row.current_level) ? row.current_level : 'A1',
      dailyGoalMinutes: row.daily_goal_minutes,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async setCurrentLevel(level: Level): Promise<void> {
    await this.db.runAsync(
      'UPDATE user_progress SET current_level = ?, updated_at = ? WHERE id = 1',
      level,
      new Date().toISOString(),
    );
  }

  async addStudyTime(dateKey: string, activity: StudyActivity, seconds: number): Promise<void> {
    if (seconds <= 0) return;
    await this.db.runAsync(
      `INSERT INTO study_time_log (date_key, activity, seconds, updated_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(date_key, activity) DO UPDATE SET
         seconds = seconds + excluded.seconds,
         updated_at = excluded.updated_at`,
      dateKey,
      activity,
      Math.round(seconds),
      new Date().toISOString(),
    );
  }

  async getDailyStudy(dateKey: string): Promise<DailyStudy> {
    const rows = await this.db.getAllAsync<StudyRow>(
      'SELECT date_key, activity, seconds FROM study_time_log WHERE date_key = ?',
      dateKey,
    );
    return aggregate(dateKey, rows);
  }

  async getActiveDays(minSeconds: number): Promise<string[]> {
    const rows = await this.db.getAllAsync<{ date_key: string }>(
      `SELECT date_key FROM study_time_log GROUP BY date_key HAVING SUM(seconds) >= ? ORDER BY date_key DESC`,
      minSeconds,
    );
    return rows.map((r) => r.date_key);
  }

  async getStudyHistory(days: number, untilDateKey: string): Promise<DailyStudy[]> {
    const fromKey = shiftDateKey(untilDateKey, -(days - 1));
    const rows = await this.db.getAllAsync<StudyRow>(
      'SELECT date_key, activity, seconds FROM study_time_log WHERE date_key BETWEEN ? AND ?',
      fromKey,
      untilDateKey,
    );
    return Array.from({ length: days }, (_, i) => aggregate(shiftDateKey(fromKey, i), rows));
  }

  async getLessonProgress(lessonId: string): Promise<LessonProgress | null> {
    const row = await this.db.getFirstAsync<{
      lesson_id: string;
      best_score: number;
      attempts: number;
      completed: number;
      last_studied_at: string;
    }>('SELECT * FROM lesson_progress WHERE lesson_id = ?', lessonId);
    if (!row) return null;
    return {
      lessonId: row.lesson_id,
      bestScore: row.best_score,
      attempts: row.attempts,
      completed: row.completed === 1,
      lastStudiedAt: row.last_studied_at,
    };
  }

  async saveLessonAttempt(lessonId: string, ratio: number, completed: boolean): Promise<void> {
    await this.db.runAsync(
      `INSERT INTO lesson_progress (lesson_id, best_score, attempts, completed, last_studied_at)
       VALUES (?, ?, 1, ?, ?)
       ON CONFLICT(lesson_id) DO UPDATE SET
         best_score = MAX(best_score, excluded.best_score),
         attempts = attempts + 1,
         completed = MAX(completed, excluded.completed),
         last_studied_at = excluded.last_studied_at`,
      lessonId,
      ratio,
      completed ? 1 : 0,
      new Date().toISOString(),
    );
  }

  async countCompletedLessons(): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number }>(
      'SELECT COUNT(*) AS n FROM lesson_progress WHERE completed = 1',
    );
    return row?.n ?? 0;
  }

  async getTotalStudySeconds(): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number | null }>('SELECT SUM(seconds) AS n FROM study_time_log');
    return row?.n ?? 0;
  }

  async addScore(source: ScoreSource, refId: string, score: number, maxScore: number): Promise<void> {
    await this.db.runAsync(
      'INSERT INTO score_history (source, ref_id, score, max_score, taken_at) VALUES (?, ?, ?, ?, ?)',
      source,
      refId,
      score,
      maxScore,
      new Date().toISOString(),
    );
  }

  async getScoreHistory(limit: number): Promise<ScoreRecord[]> {
    const rows = await this.db.getAllAsync<{
      id: number;
      source: ScoreSource;
      ref_id: string;
      score: number;
      max_score: number;
      taken_at: string;
    }>('SELECT * FROM score_history ORDER BY taken_at DESC LIMIT ?', limit);
    return rows.map((r) => ({
      id: r.id,
      source: r.source,
      refId: r.ref_id,
      score: r.score,
      maxScore: r.max_score,
      takenAt: r.taken_at,
    }));
  }
}
