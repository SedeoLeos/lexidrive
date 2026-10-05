import type { SQLiteDatabase } from 'expo-sqlite';
import type { Level } from '@/core/constants/levels';
import type { GrammarTip, KeyPhrase, Lesson, LessonSummary, VocabularyItem } from '@/domain/entities';
import type { ICourseRepository } from '@/domain/repositories';
import { mapQuizRow, parseJson, type QuizRow } from '../mappers/rows';

interface CourseRow {
  id: string;
  level: Level;
  position: number;
  title: string;
  theme: string;
  vocabulary_json: string;
  grammar_json: string;
  phrases_json: string;
  journal_prompt: string;
}

interface SummaryRow {
  id: string;
  level: Level;
  position: number;
  title: string;
  theme: string;
  quiz_count: number;
  best_score: number | null;
  completed: number | null;
}

function mapSummary(row: SummaryRow): LessonSummary {
  return {
    id: row.id,
    level: row.level,
    order: row.position,
    title: row.title,
    theme: row.theme,
    quizCount: row.quiz_count,
    bestScore: row.best_score,
    completed: row.completed === 1,
  };
}

const SUMMARY_SQL = `
  SELECT c.id, c.level, c.position, c.title, c.theme,
         (SELECT COUNT(*) FROM course_quizzes q WHERE q.course_id = c.id) AS quiz_count,
         lp.best_score, lp.completed
  FROM courses c
  LEFT JOIN lesson_progress lp ON lp.lesson_id = c.id
  WHERE c.level = ?
  ORDER BY c.position`;

export class SQLiteCourseRepository implements ICourseRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async getLessonSummaries(level: Level): Promise<LessonSummary[]> {
    const rows = await this.db.getAllAsync<SummaryRow>(SUMMARY_SQL, level);
    return rows.map(mapSummary);
  }

  async getLesson(id: string): Promise<Lesson | null> {
    const row = await this.db.getFirstAsync<CourseRow>('SELECT * FROM courses WHERE id = ?', id);
    if (!row) return null;
    const quizzes = await this.db.getAllAsync<QuizRow>(
      'SELECT id, category, kind, payload_json FROM course_quizzes WHERE course_id = ? ORDER BY position',
      id,
    );
    return {
      id: row.id,
      level: row.level,
      order: row.position,
      title: row.title,
      theme: row.theme,
      vocabulary: parseJson<VocabularyItem[]>(row.vocabulary_json, []),
      grammarTip: parseJson<GrammarTip>(row.grammar_json, { title: '', explanation: '', shortcut: '', examples: [] }),
      keyPhrases: parseJson<KeyPhrase[]>(row.phrases_json, []),
      quizzes: quizzes.map(mapQuizRow),
      journalPrompt: row.journal_prompt,
    };
  }

  async countLessons(level: Level): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM courses WHERE level = ?', level);
    return row?.n ?? 0;
  }

  async getNextLesson(level: Level): Promise<LessonSummary | null> {
    const summaries = await this.getLessonSummaries(level);
    if (summaries.length === 0) return null;
    return summaries.find((s) => !s.completed) ?? summaries[summaries.length - 1];
  }
}
