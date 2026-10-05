import { shiftDateKey } from '@/core/utils/date';
import type { StreakInfo } from '../entities';

/**
 * Computes the current and longest streak of consecutive active days.
 * The current streak stays alive until the end of today: if yesterday was active and today
 * not yet, the streak is still shown (the learner has until midnight).
 *
 * @param activeDays local date keys (any order, duplicates allowed)
 * @param todayKey   today's local date key
 */
export function computeStreak(activeDays: readonly string[], todayKey: string): StreakInfo {
  const days = new Set(activeDays);
  const todayCounted = days.has(todayKey);

  let current = 0;
  let cursor = todayCounted ? todayKey : shiftDateKey(todayKey, -1);
  while (days.has(cursor)) {
    current += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  const sorted = [...days].sort();
  let longest = 0;
  let run = 0;
  let previous: string | null = null;
  for (const day of sorted) {
    run = previous !== null && shiftDateKey(previous, 1) === day ? run + 1 : 1;
    longest = Math.max(longest, run);
    previous = day;
  }

  return { current, longest: Math.max(longest, current), todayCounted };
}
