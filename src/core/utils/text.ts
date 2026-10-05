/**
 * Text normalisation shared by quiz grading, exam grading and dictionary search.
 */

/** Removes diacritics: "élève" → "eleve". */
export function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Canonical form used to compare typed answers:
 * lowercase, accents removed, curly quotes → straight, collapsed whitespace,
 * trailing punctuation removed.
 */
export function normalizeAnswer(value: string): string {
  return stripAccents(value)
    .toLowerCase()
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .replace(/[\s.!?;:,]+$/g, '')
    .trim();
}

/** Canonical form used for dictionary search keys. */
export function normalizeSearch(value: string): string {
  return stripAccents(value).toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
}

/** Word count, used by the journal to display writing volume. */
export function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
}
