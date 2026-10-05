import type { SQLiteDatabase } from 'expo-sqlite';
import type { Level } from '@/core/constants/levels';
import { normalizeSearch } from '@/core/utils/text';
import type { Flashcard, FlashcardSeed } from '@/domain/entities';
import type { IFlashcardRepository } from '@/domain/repositories';

interface FlashcardRow {
  word_key: string;
  english: string;
  french: string;
  example: string;
  lesson_id: string;
  level: Level;
  box: number;
  due_date: string;
  reviews: number;
  lapses: number;
}

function map(row: FlashcardRow): Flashcard {
  return {
    wordKey: row.word_key,
    english: row.english,
    french: row.french,
    example: row.example,
    lessonId: row.lesson_id,
    level: row.level,
    box: row.box,
    dueDate: row.due_date,
    reviews: row.reviews,
    lapses: row.lapses,
  };
}

export class SQLiteFlashcardRepository implements IFlashcardRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async addCards(cards: FlashcardSeed[], dueDate: string): Promise<number> {
    let added = 0;
    const now = new Date().toISOString();
    for (const c of cards) {
      const result = await this.db.runAsync(
        `INSERT OR IGNORE INTO flashcards (word_key, english, french, example, lesson_id, level, box, due_date, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        normalizeSearch(c.english),
        c.english,
        c.french,
        c.example,
        c.lessonId,
        c.level,
        dueDate,
        now,
      );
      added += result.changes;
    }
    return added;
  }

  async getDue(todayKey: string, limit: number): Promise<Flashcard[]> {
    // Weakest cards first, then the oldest due dates.
    const rows = await this.db.getAllAsync<FlashcardRow>(
      'SELECT * FROM flashcards WHERE due_date <= ? ORDER BY box ASC, due_date ASC, created_at ASC LIMIT ?',
      todayKey,
      limit,
    );
    return rows.map(map);
  }

  async countDue(todayKey: string): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number }>(
      'SELECT COUNT(*) AS n FROM flashcards WHERE due_date <= ?',
      todayKey,
    );
    return row?.n ?? 0;
  }

  async saveReview(wordKey: string, box: number, dueDate: string, lapsed: boolean): Promise<void> {
    await this.db.runAsync(
      `UPDATE flashcards SET box = ?, due_date = ?, reviews = reviews + 1, lapses = lapses + ?, last_reviewed_at = ?
       WHERE word_key = ?`,
      box,
      dueDate,
      lapsed ? 1 : 0,
      new Date().toISOString(),
      wordKey,
    );
  }

  async countLearned(minBox: number): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number }>(
      'SELECT COUNT(*) AS n FROM flashcards WHERE box >= ?',
      minBox,
    );
    return row?.n ?? 0;
  }

  async countReviews(): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number | null }>('SELECT SUM(reviews) AS n FROM flashcards');
    return row?.n ?? 0;
  }

  async countAll(): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM flashcards');
    return row?.n ?? 0;
  }
}
