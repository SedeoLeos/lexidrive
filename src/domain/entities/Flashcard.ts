import type { Level } from '@/core/constants/levels';

/** A vocabulary card scheduled with a Leitner spaced-repetition system. */
export interface Flashcard {
  wordKey: string;
  english: string;
  french: string;
  example: string;
  lessonId: string;
  level: Level;
  /** Leitner box 1 (new / failed) → 5 (well known). */
  box: number;
  /** Local date key on which the card is next due. */
  dueDate: string;
  reviews: number;
  lapses: number;
}

export interface FlashcardSeed {
  english: string;
  french: string;
  example: string;
  lessonId: string;
  level: Level;
}
