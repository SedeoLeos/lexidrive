import type { SQLiteDatabase } from 'expo-sqlite';
import { normalizeSearch } from '@/core/utils/text';
import type { DictionaryCategory, DictionaryEntry } from '@/domain/entities';
import type { IDictionaryRepository } from '@/domain/repositories';
import { mapDictionaryRow, type DictionaryRow } from '../mappers/rows';

/** Escapes LIKE wildcards so user input is matched literally. */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export class SQLiteDictionaryRepository implements IDictionaryRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  /**
   * Ranking: exact headword → exact translation → headword prefix → translation prefix
   * → contained anywhere (headword or translation). Shorter words first within a rank.
   */
  async search(query: string, limit = 30): Promise<DictionaryEntry[]> {
    const key = normalizeSearch(query);
    if (!key) return [];
    const prefix = `${escapeLike(key)}%`;
    const contains = `%${escapeLike(key)}%`;
    const rows = await this.db.getAllAsync<DictionaryRow>(
      `SELECT *,
         CASE
           WHEN word_key = $key THEN 0
           WHEN translation_key = $key THEN 1
           WHEN word_key LIKE $prefix ESCAPE '\\' THEN 2
           WHEN translation_key LIKE $prefix ESCAPE '\\' THEN 3
           ELSE 4
         END AS rank
       FROM dictionary
       WHERE word_key LIKE $contains ESCAPE '\\' OR translation_key LIKE $contains ESCAPE '\\'
       ORDER BY rank, length(word), word_key
       LIMIT $limit`,
      { $key: key, $prefix: prefix, $contains: contains, $limit: limit },
    );
    return rows.map(mapDictionaryRow);
  }

  async getByWord(word: string): Promise<DictionaryEntry | null> {
    const row = await this.db.getFirstAsync<DictionaryRow>(
      'SELECT * FROM dictionary WHERE word_key = ?',
      normalizeSearch(word),
    );
    return row ? mapDictionaryRow(row) : null;
  }

  async listByCategory(category: DictionaryCategory, limit = 100): Promise<DictionaryEntry[]> {
    const rows = await this.db.getAllAsync<DictionaryRow>(
      `SELECT * FROM dictionary WHERE category = ?
       ORDER BY CASE level WHEN 'A1' THEN 1 WHEN 'A2' THEN 2 WHEN 'B1' THEN 3 WHEN 'B2' THEN 4
                           WHEN 'C1' THEN 5 WHEN 'C2' THEN 6 ELSE 7 END, word_key
       LIMIT ?`,
      category,
      limit,
    );
    return rows.map(mapDictionaryRow);
  }

  async getAllHeadwordTokens(): Promise<string[]> {
    const rows = await this.db.getAllAsync<{ word: string }>('SELECT word FROM dictionary');
    const tokens = new Set<string>();
    for (const { word } of rows) {
      for (const t of word.toLowerCase().split(/[^a-z']+/)) {
        if (t.length > 1) tokens.add(t);
      }
    }
    return [...tokens];
  }
}
