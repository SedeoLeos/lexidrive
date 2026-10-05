import { isLevel, type Level } from '@/core/constants/levels';
import type {
  DictionaryCategory,
  DictionaryEntry,
  ExamQuestion,
  JournalEntry,
  JournalKind,
  Quiz,
} from '@/domain/entities';

/** Raw SQLite row shapes and their conversion to domain entities. */

export interface DictionaryRow {
  id: number;
  word: string;
  translation: string;
  part_of_speech: string | null;
  definition: string | null;
  example: string | null;
  collocations_json: string;
  alternatives_json: string;
  note: string | null;
  level: string | null;
  category: string;
}

export interface QuizRow {
  id: string;
  category: Quiz['category'];
  kind: Quiz['kind'];
  payload_json: string;
}

export interface ExamQuestionRow {
  id: string;
  section: string;
  kind: 'mcq' | 'fill';
  prompt: string;
  payload_json: string;
  explanation: string;
  points: number;
}

export interface JournalRow {
  id: number;
  date_key: string;
  prompt: string;
  kind: string;
  french_text: string;
  english_text: string;
  word_count: number;
  created_at: string;
  updated_at: string;
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function toLevelOrNull(value: string | null): Level | null {
  return isLevel(value) ? value : null;
}

export function mapDictionaryRow(row: DictionaryRow): DictionaryEntry {
  return {
    id: row.id,
    word: row.word,
    translation: row.translation,
    partOfSpeech: row.part_of_speech,
    definition: row.definition,
    example: row.example,
    collocations: parseJson<string[]>(row.collocations_json, []),
    alternatives: parseJson<string[]>(row.alternatives_json, []),
    note: row.note,
    level: toLevelOrNull(row.level),
    category: row.category as DictionaryCategory,
  };
}

export function mapQuizRow(row: QuizRow): Quiz {
  const payload = parseJson<Record<string, unknown>>(row.payload_json, {});
  return { ...payload, id: row.id, category: row.category, kind: row.kind } as Quiz;
}

export function mapExamQuestionRow(row: ExamQuestionRow): ExamQuestion {
  const payload = parseJson<Record<string, unknown>>(row.payload_json, {});
  return {
    ...payload,
    id: row.id,
    section: row.section,
    kind: row.kind,
    prompt: row.prompt,
    explanation: row.explanation,
    points: row.points,
  } as ExamQuestion;
}

export function mapJournalRow(row: JournalRow): JournalEntry {
  return {
    id: row.id,
    dateKey: row.date_key,
    prompt: row.prompt,
    kind: row.kind as JournalKind,
    frenchText: row.french_text,
    englishText: row.english_text,
    wordCount: row.word_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export { parseJson };
