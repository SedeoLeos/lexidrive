import type { Level } from '@/core/constants/levels';
import type { Exam, ExamAttempt } from '../entities';

export interface IExamRepository {
  getExamFrom(level: Level): Promise<Exam | null>;
  getExam(id: string): Promise<Exam | null>;
  saveAttempt(examId: string, score: number, maxScore: number, passed: boolean): Promise<void>;
  getAttempts(examId: string): Promise<ExamAttempt[]>;
  countPassed(): Promise<number>;
}
