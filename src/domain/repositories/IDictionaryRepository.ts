import type { DictionaryCategory, DictionaryEntry } from '../entities';

export interface IDictionaryRepository {
  /** Searches English headwords and French translations (accent-insensitive). */
  search(query: string, limit?: number): Promise<DictionaryEntry[]>;
  getByWord(word: string): Promise<DictionaryEntry | null>;
  listByCategory(category: DictionaryCategory, limit?: number): Promise<DictionaryEntry[]>;
  /** Every distinct lowercase English token known by the dictionary (feeds the spell checker). */
  getAllHeadwordTokens(): Promise<string[]>;
}
