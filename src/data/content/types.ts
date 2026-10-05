import type { Level } from '@/core/constants/levels';
import type {
  DictionaryCategory,
  ExamFillQuestion,
  ExamMcqQuestion,
  GrammarTip,
  JournalKind,
  KeyPhrase,
  Quiz,
  VocabularyItem,
} from '@/domain/entities';

/**
 * Authoring formats for the embedded curriculum. Ids are derived at seed time
 * (e.g. "b1-02" → quizzes "b1-02-q07") so content stays readable.
 */

type WithoutId<T> = T extends unknown ? Omit<T, 'id'> : never;

export type QuizSeed = WithoutId<Quiz>;

export interface LessonSeed {
  id: string;
  level: Level;
  order: number;
  title: string;
  theme: string;
  vocabulary: VocabularyItem[];
  grammarTip: GrammarTip;
  keyPhrases: KeyPhrase[];
  quizzes: QuizSeed[];
  journalPrompt: string;
}

export type ExamQuestionSeed =
  | (Omit<ExamMcqQuestion, 'id' | 'points'> & { points?: number })
  | (Omit<ExamFillQuestion, 'id' | 'points'> & { points?: number });

export interface ExamSeed {
  id: string;
  fromLevel: Level;
  toLevel: Level;
  title: string;
  description: string;
  passRatio: number;
  questions: ExamQuestionSeed[];
}

export interface DictionarySeed {
  word: string;
  translation: string;
  partOfSpeech?: string;
  definition?: string;
  example?: string;
  collocations?: string[];
  alternatives?: string[];
  note?: string;
  level?: Level;
  category: DictionaryCategory;
}

export interface JournalPromptSeed {
  id: string;
  kind: JournalKind;
  text: string;
}
