import type { SQLiteDatabase } from 'expo-sqlite';
import type { Level } from '@/core/constants/levels';
import type { Exam, ExamAttempt } from '@/domain/entities';
import type { IExamRepository } from '@/domain/repositories';
import { mapExamQuestionRow, type ExamQuestionRow } from '../mappers/rows';

interface ExamRow {
  id: string;
  from_level: Level;
  to_level: Level;
  title: string;
  description: string;
  pass_ratio: number;
}

export class SQLiteExamRepository implements IExamRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  private async hydrate(row: ExamRow | null): Promise<Exam | null> {
    if (!row) return null;
    const questions = await this.db.getAllAsync<ExamQuestionRow>(
      `SELECT id, section, kind, prompt, payload_json, explanation, points
       FROM exam_questions WHERE exam_id = ? ORDER BY position`,
      row.id,
    );
    return {
      id: row.id,
      fromLevel: row.from_level,
      toLevel: row.to_level,
      title: row.title,
      description: row.description,
      passRatio: row.pass_ratio,
      questions: questions.map(mapExamQuestionRow),
    };
  }

  async getExamFrom(level: Level): Promise<Exam | null> {
    return this.hydrate(await this.db.getFirstAsync<ExamRow>('SELECT * FROM exams WHERE from_level = ?', level));
  }

  async getExam(id: string): Promise<Exam | null> {
    return this.hydrate(await this.db.getFirstAsync<ExamRow>('SELECT * FROM exams WHERE id = ?', id));
  }

  async saveAttempt(examId: string, score: number, maxScore: number, passed: boolean): Promise<void> {
    await this.db.runAsync(
      'INSERT INTO exam_attempts (exam_id, score, max_score, passed, taken_at) VALUES (?, ?, ?, ?, ?)',
      examId,
      score,
      maxScore,
      passed ? 1 : 0,
      new Date().toISOString(),
    );
  }

  async getAttempts(examId: string): Promise<ExamAttempt[]> {
    const rows = await this.db.getAllAsync<{
      id: number;
      exam_id: string;
      score: number;
      max_score: number;
      passed: number;
      taken_at: string;
    }>('SELECT * FROM exam_attempts WHERE exam_id = ? ORDER BY taken_at DESC', examId);
    return rows.map((r) => ({
      id: r.id,
      examId: r.exam_id,
      score: r.score,
      maxScore: r.max_score,
      passed: r.passed === 1,
      takenAt: r.taken_at,
    }));
  }
}
