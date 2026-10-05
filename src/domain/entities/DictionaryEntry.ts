import type { Level } from '@/core/constants/levels';

export type DictionaryCategory = 'core' | 'lesson' | 'pillar' | 'idiom' | 'connector';

export interface DictionaryEntry {
  id: number;
  word: string;
  translation: string;
  partOfSpeech: string | null;
  definition: string | null;
  example: string | null;
  /** Words that naturally go together ("make a decision"). */
  collocations: string[];
  /** More elegant or precise alternatives. */
  alternatives: string[];
  /** Pitfall for French speakers (false friend, frequent mistranslation…). */
  note: string | null;
  level: Level | null;
  category: DictionaryCategory;
}
