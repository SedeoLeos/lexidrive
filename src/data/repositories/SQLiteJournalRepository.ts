import type { SQLiteDatabase } from 'expo-sqlite';
import { countWords } from '@/core/utils/text';
import type { JournalDraft, JournalEntry, JournalKind, JournalPrompt } from '@/domain/entities';
import type { IJournalRepository } from '@/domain/repositories';
import { mapJournalRow, type JournalRow } from '../mappers/rows';

export class SQLiteJournalRepository implements IJournalRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async save(draft: JournalDraft): Promise<JournalEntry> {
    const now = new Date().toISOString();
    const wordCount = countWords(draft.englishText);
    let id = draft.id;

    if (id !== undefined) {
      await this.db.runAsync(
        `UPDATE user_journal SET prompt = ?, kind = ?, french_text = ?, english_text = ?, word_count = ?, updated_at = ?
         WHERE id = ?`,
        draft.prompt,
        draft.kind,
        draft.frenchText,
        draft.englishText,
        wordCount,
        now,
        id,
      );
    } else {
      const result = await this.db.runAsync(
        `INSERT INTO user_journal (date_key, prompt, kind, french_text, english_text, word_count, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        draft.dateKey,
        draft.prompt,
        draft.kind,
        draft.frenchText,
        draft.englishText,
        wordCount,
        now,
        now,
      );
      id = result.lastInsertRowId;
    }

    const saved = await this.getById(id);
    if (!saved) throw new Error('Journal entry could not be saved.');
    return saved;
  }

  async getById(id: number): Promise<JournalEntry | null> {
    const row = await this.db.getFirstAsync<JournalRow>('SELECT * FROM user_journal WHERE id = ?', id);
    return row ? mapJournalRow(row) : null;
  }

  async getByDate(dateKey: string): Promise<JournalEntry[]> {
    const rows = await this.db.getAllAsync<JournalRow>(
      'SELECT * FROM user_journal WHERE date_key = ? ORDER BY updated_at DESC',
      dateKey,
    );
    return rows.map(mapJournalRow);
  }

  async list(limit: number, offset: number): Promise<JournalEntry[]> {
    const rows = await this.db.getAllAsync<JournalRow>(
      'SELECT * FROM user_journal ORDER BY date_key DESC, updated_at DESC LIMIT ? OFFSET ?',
      limit,
      offset,
    );
    return rows.map(mapJournalRow);
  }

  async delete(id: number): Promise<void> {
    await this.db.runAsync('DELETE FROM user_journal WHERE id = ?', id);
  }

  async count(): Promise<number> {
    const row = await this.db.getFirstAsync<{ n: number }>('SELECT COUNT(*) AS n FROM user_journal');
    return row?.n ?? 0;
  }

  async getPrompts(): Promise<JournalPrompt[]> {
    const rows = await this.db.getAllAsync<{ id: string; kind: JournalKind; text: string }>(
      'SELECT id, kind, text FROM journal_prompts ORDER BY position',
    );
    return rows;
  }
}
