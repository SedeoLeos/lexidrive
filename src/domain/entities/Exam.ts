import type { Level } from '@/core/constants/levels';

export type ExamQuestionKind = 'mcq' | 'fill';

export interface ExamQuestionBase {
  id: string;
  section: string;
  prompt: string;
  explanation: string;
  points: number;
}

export interface ExamMcqQuestion extends ExamQuestionBase {
  kind: 'mcq';
  options: string[];
  answerIndex: number;
}

/** Spelling gap-fill: `text` contains one "___"; any of `answers` is accepted. */
export interface ExamFillQuestion extends ExamQuestionBase {
  kind: 'fill';
  text: string;
  answers: string[];
}

export type ExamQuestion = ExamMcqQuestion | ExamFillQuestion;

/** A level-transition exam (e.g. A2 → B1). */
export interface Exam {
  id: string;
  fromLevel: Level;
  toLevel: Level;
  title: string;
  description: string;
  passRatio: number;
  questions: ExamQuestion[];
}

export type ExamAnswer = { kind: 'mcq'; index: number | null } | { kind: 'fill'; text: string };

export interface ExamQuestionResult {
  questionId: string;
  correct: boolean;
  earned: number;
  expected: string;
}

export interface ExamResult {
  examId: string;
  score: number;
  maxScore: number;
  ratio: number;
  passed: boolean;
  details: ExamQuestionResult[];
}

export interface ExamAttempt {
  id: number;
  examId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  takenAt: string;
}
