import type { JournalDraft, JournalEntry, JournalPrompt } from '../entities';

export interface IJournalRepository {
  save(draft: JournalDraft): Promise<JournalEntry>;
  getById(id: number): Promise<JournalEntry | null>;
  getByDate(dateKey: string): Promise<JournalEntry[]>;
  list(limit: number, offset: number): Promise<JournalEntry[]>;
  delete(id: number): Promise<void>;
  count(): Promise<number>;
  getPrompts(): Promise<JournalPrompt[]>;
}
