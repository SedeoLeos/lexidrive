/**
 * Local-calendar date helpers. Study time is bucketed by the learner's *local* day
 * (a session at 23:50 belongs to today, at 00:10 to tomorrow), never by UTC.
 */

/** Formats a date as `YYYY-MM-DD` in local time. */
export function toLocalDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parses a `YYYY-MM-DD` key into a local Date at midnight. */
export function fromLocalDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Returns the key of the day `offset` days from `key` (negative = past). */
export function shiftDateKey(key: string, offset: number): string {
  const date = fromLocalDateKey(key);
  date.setDate(date.getDate() + offset);
  return toLocalDateKey(date);
}

/** Day-of-year based index, used to rotate the daily prompt deterministically. */
export function dayNumber(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000) + date.getFullYear() * 366;
}

const FR_DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const FR_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

/** "lundi 5 octobre" */
export function formatLongFrenchDate(date: Date): string {
  return `${FR_DAYS[date.getDay()]} ${date.getDate()} ${FR_MONTHS[date.getMonth()]}`;
}

const FR_MONTHS_SHORT = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

/** "5 oct. 2026" */
export function formatShortFrenchDate(date: Date): string {
  return `${date.getDate()} ${FR_MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

/** 3725 s → "1 h 02" ; 300 s → "5 min" */
export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h} h ${String(m).padStart(2, '0')}`;
}

/** 7 → "07:00" style helper for reminders. */
export function formatClock(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}
