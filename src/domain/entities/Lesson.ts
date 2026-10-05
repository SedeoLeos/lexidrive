import type { Level } from '@/core/constants/levels';
import type { Quiz } from './Quiz';

/** One of the 20 words studied in a lesson. */
export interface VocabularyItem {
  english: string;
  french: string;
  example: string;
}

/** A daily lesson: theme, vocabulary, grammar shortcut, key phrases, quiz bank and journal prompt. */
export interface Lesson {
  id: string;
  level: Level;
  /** Position of the lesson within its level (1-based). */
  order: number;
  title: string;
  /** Real-life or professional scenario the lesson prepares for. */
  theme: string;
  vocabulary: VocabularyItem[];
  grammarTip: GrammarTip;
  keyPhrases: KeyPhrase[];
  quizzes: Quiz[];
  journalPrompt: string;
}

export interface GrammarTip {
  title: string;
  /** Short, practical explanation (French). */
  explanation: string;
  /** Mnemonic shortcut to avoid the error. */
  shortcut: string;
  examples: string[];
}

export interface KeyPhrase {
  english: string;
  french: string;
}

/** Lightweight projection used by course lists. */
export interface LessonSummary {
  id: string;
  level: Level;
  order: number;
  title: string;
  theme: string;
  quizCount: number;
  bestScore: number | null;
  completed: boolean;
}
