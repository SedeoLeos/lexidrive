import type { SpellToken } from '../services';

/**
 * Pure spell-checking algorithms (no I/O). The data layer supplies the lexicon.
 */

const WORD_RE = /[A-Za-zÀ-ɏ]+(?:['’][A-Za-z]+)*/g;

/** Common English contractions / clitics accepted as a whole. */
const CONTRACTION_SUFFIXES = ["'s", "'re", "'ve", "'ll", "'d", "'m", "n't"];

/** Splits text into word / non-word tokens, preserving every character. */
export function tokenizeText(text: string, isCorrect: (word: string) => boolean): SpellToken[] {
  const tokens: SpellToken[] = [];
  let last = 0;
  for (const match of text.matchAll(WORD_RE)) {
    const start = match.index ?? 0;
    if (start > last) {
      tokens.push({ text: text.slice(last, start), isWord: false, misspelled: false, start: last });
    }
    const word = match[0];
    tokens.push({ text: word, isWord: true, misspelled: !isCorrect(word), start });
    last = start + word.length;
  }
  if (last < text.length) {
    tokens.push({ text: text.slice(last), isWord: false, misspelled: false, start: last });
  }
  return tokens;
}

/**
 * Checks a word against a lexicon, handling case, contractions and possessives.
 * Single letters and all-caps acronyms (≤ 5 letters) are accepted.
 */
export function isWordCorrect(rawWord: string, lexicon: ReadonlySet<string>): boolean {
  const word = rawWord.replace(/’/g, "'");
  if (word.length <= 1) return true;
  if (/^[A-Z]{2,5}$/.test(word)) return true;

  const lower = word.toLowerCase();
  if (lexicon.has(lower)) return true;

  for (const suffix of CONTRACTION_SUFFIXES) {
    if (lower.endsWith(suffix)) {
      const stem = lower.slice(0, -suffix.length);
      if (stem.length === 0) return false;
      // "won't", "can't", "shan't" have irregular stems.
      if (suffix === "n't" && ['wo', 'ca', 'sha', 'ai'].includes(stem)) return true;
      if (lexicon.has(stem) || stem === 'i') return true;
    }
  }
  if (lower.endsWith("s'") && lexicon.has(lower.slice(0, -1))) return true;
  return false;
}

/** Damerau–Levenshtein (optimal string alignment) distance with an early-exit bound. */
export function editDistance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const d: number[][] = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  for (let i = 0; i < rows; i++) d[i][0] = i;
  for (let j = 0; j < cols; j++) d[0][j] = j;

  for (let i = 1; i < rows; i++) {
    let rowMin = Infinity;
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, d[i - 2][j - 2] + 1);
      }
      d[i][j] = v;
      rowMin = Math.min(rowMin, v);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length][b.length];
}

/**
 * Suggests corrections ranked by edit distance, then by shared prefix, then alphabetically.
 * `candidates` should be pre-filtered (e.g. by length bucket) by the caller for performance.
 */
export function rankSuggestions(word: string, candidates: Iterable<string>, max = 4): string[] {
  const target = word.toLowerCase();
  const scored: { w: string; d: number; p: number }[] = [];
  for (const c of candidates) {
    if (c === target) continue;
    const d = editDistance(target, c, 2);
    if (d <= 2) {
      let p = 0;
      while (p < c.length && p < target.length && c[p] === target[p]) p++;
      scored.push({ w: c, d, p });
    }
  }
  scored.sort((x, y) => x.d - y.d || y.p - x.p || x.w.localeCompare(y.w));
  const isCapitalized = /^[A-Z]/.test(word);
  return scored.slice(0, max).map((s) => (isCapitalized ? s.w.charAt(0).toUpperCase() + s.w.slice(1) : s.w));
}
