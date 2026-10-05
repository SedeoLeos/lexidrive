export type JournalKind = 'life' | 'debate';

/** One dual-language production: the learner's French text and their own English translation. */
export interface JournalEntry {
  id: number;
  /** Local day (YYYY-MM-DD) the entry belongs to. */
  dateKey: string;
  prompt: string;
  kind: JournalKind;
  frenchText: string;
  englishText: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JournalDraft {
  id?: number;
  dateKey: string;
  prompt: string;
  kind: JournalKind;
  frenchText: string;
  englishText: string;
}

export interface JournalPrompt {
  id: string;
  kind: JournalKind;
  text: string;
  /** Optional source lesson. */
  lessonId?: string;
}
