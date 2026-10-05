import type { Flashcard, FlashcardSeed } from '../entities';

export interface IFlashcardRepository {
  /** Adds cards that are not in the deck yet (existing cards keep their schedule). Returns how many were added. */
  addCards(cards: FlashcardSeed[], dueDate: string): Promise<number>;
  getDue(todayKey: string, limit: number): Promise<Flashcard[]>;
  countDue(todayKey: string): Promise<number>;
  saveReview(wordKey: string, box: number, dueDate: string, lapsed: boolean): Promise<void>;
  countLearned(minBox: number): Promise<number>;
  countReviews(): Promise<number>;
  countAll(): Promise<number>;
}
