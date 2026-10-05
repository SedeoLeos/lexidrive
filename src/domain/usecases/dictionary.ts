import type { DictionaryCategory, DictionaryEntry } from '../entities';
import type { IDictionaryRepository } from '../repositories';

export class SearchDictionaryUseCase {
  constructor(private readonly dictionary: IDictionaryRepository) {}

  /** Empty or 1-char queries return nothing to keep the pop-up calm while typing. */
  async execute(query: string, limit = 30): Promise<DictionaryEntry[]> {
    const q = query.trim();
    if (q.length < 2) return [];
    return this.dictionary.search(q, limit);
  }
}

export class LookupWordUseCase {
  constructor(private readonly dictionary: IDictionaryRepository) {}

  /** Exact headword lookup, falling back to the best search hit. */
  async execute(word: string): Promise<DictionaryEntry | null> {
    const cleaned = word.replace(/[^A-Za-zÀ-ɏ' -]/g, '').trim();
    if (!cleaned) return null;
    const exact = await this.dictionary.getByWord(cleaned);
    if (exact) return exact;
    const hits = await this.dictionary.search(cleaned, 1);
    return hits[0] ?? null;
  }
}

export class BrowseDictionaryUseCase {
  constructor(private readonly dictionary: IDictionaryRepository) {}
  execute(category: DictionaryCategory, limit = 100): Promise<DictionaryEntry[]> {
    return this.dictionary.listByCategory(category, limit);
  }
}
