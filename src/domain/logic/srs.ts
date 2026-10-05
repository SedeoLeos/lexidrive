import { shiftDateKey } from '@/core/utils/date';
import type { Flashcard } from '../entities';

/** Days until the next review once a card reaches box n (index = box). */
export const LEITNER_INTERVALS = [0, 1, 2, 4, 8, 16] as const;
export const MAX_BOX = LEITNER_INTERVALS.length - 1;
/** A word counts as "learned" from this box on. */
export const LEARNED_BOX = 3;

/**
 * Leitner scheduling: a known card moves up one box (longer interval);
 * a forgotten card goes back to box 1 and is due again today.
 */
export function scheduleReview(
  card: Pick<Flashcard, 'box'>,
  knew: boolean,
  todayKey: string,
): { box: number; dueDate: string } {
  if (!knew) return { box: 1, dueDate: todayKey };
  const box = Math.min(MAX_BOX, card.box + 1);
  return { box, dueDate: shiftDateKey(todayKey, LEITNER_INTERVALS[box]) };
}
