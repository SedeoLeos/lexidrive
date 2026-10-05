import type { Level } from '@/core/constants/levels';
import { createRng, hashString, shuffle } from '@/core/utils/random';
import type { GrammarTip, KeyPhrase, VocabularyItem } from '@/domain/entities';
import { LEXICON } from './spelling/lexicon';
import type { LessonSeed, QuizSeed } from './types';

/**
 * Curriculum generator.
 *
 * Teachers author what only a human can write well — theme, 20 words with a natural example,
 * 5 key phrases, a journal prompt, and a per-level grammar library. Every lesson's 21-item
 * quiz bank is then derived deterministically from its own vocabulary:
 *
 *  A · Vocabulaire  (7) — FR → EN and EN → FR multiple choice, every wrong option explained
 *  B · Grammaire    (7) — items from the lesson's grammar point + re-ordering of its examples
 *  C · Orthographe  (7) — gap-fills from the examples + a deliberate typo to correct
 *                         (typos are checked against the offline lexicon so they are never real words)
 */

export interface GrammarPoint {
  id: string;
  level: Level;
  tip: GrammarTip;
  /** Bank of grammar items (≥ 7); each lesson draws a rotating subset. */
  quizzes: QuizSeed[];
}

export interface LessonSpec {
  title: string;
  theme: string;
  grammar: string;
  /** One word per line: `english | français | example sentence containing the word` */
  words: string;
  /** One phrase per line: `English phrase | traduction` */
  phrases: string;
  journal: string;
}

/** Authoring helper so lesson files stay compact and readable. */
export const L = (
  title: string,
  theme: string,
  grammar: string,
  words: string,
  phrases: string,
  journal: string,
): LessonSpec => ({
  title,
  theme,
  grammar,
  words,
  phrases,
  journal,
});

export function parseWords(block: string): VocabularyItem[] {
  return block
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [english, french, example] = line.split('|').map((s) => s.trim());
      return { english, french, example };
    });
}

export function parsePhrases(block: string): KeyPhrase[] {
  return block
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [english, french] = line.split('|').map((s) => s.trim());
      return { english, french };
    });
}

let lexiconSet: Set<string> | null = null;
function isRealWord(word: string): boolean {
  if (!lexiconSet) lexiconSet = new Set(LEXICON.split('\n'));
  return lexiconSet.has(word.toLowerCase());
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Finds `word` as a whole word in `sentence` (case-insensitive); returns the exact matched text. */
export function findWord(sentence: string, word: string): { index: number; text: string } | null {
  const re = new RegExp(`(^|[^A-Za-z'])(${escapeRegExp(word)})(?=$|[^A-Za-z'])`, 'i');
  const m = re.exec(sentence);
  if (!m) return null;
  return { index: m.index + m[1].length, text: m[2] };
}

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

export interface Typo {
  wrong: string;
  hint: string;
}

/**
 * Produces a plausible misspelling that is NOT an existing English word, with a hint explaining
 * the trap. Strategies mirror real learner errors: doubled/undoubled consonants, swapped letters,
 * dropped silent letters.
 */
export function makeTypo(word: string): Typo | null {
  const w = word;
  const lower = w.toLowerCase();
  const candidates: Typo[] = [];

  // 1. A doubled consonant written once ("really" → "realy").
  for (let i = 1; i < lower.length; i++) {
    if (lower[i] === lower[i - 1] && !VOWELS.has(lower[i])) {
      candidates.push({ wrong: w.slice(0, i) + w.slice(i + 1), hint: `la consonne « ${lower[i]} » est doublée` });
    }
  }
  // 2. A single consonant doubled ("market" → "markket"), after the first vowel.
  const firstVowel = [...lower].findIndex((c) => VOWELS.has(c));
  for (let i = Math.max(1, firstVowel + 1); i < lower.length - 1; i++) {
    const c = lower[i];
    if (!VOWELS.has(c) && lower[i - 1] !== c && lower[i + 1] !== c) {
      candidates.push({
        wrong: w.slice(0, i + 1) + w[i] + w.slice(i + 1),
        hint: `la consonne « ${c} » ne se double pas`,
      });
      break;
    }
  }
  // 3. Two adjacent interior letters swapped ("friend" → "freind").
  for (let i = 1; i < lower.length - 2; i++) {
    if (lower[i] !== lower[i + 1]) {
      candidates.push({
        wrong: w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2),
        hint: `attention à l'ordre des lettres « ${lower[i]}${lower[i + 1]} »`,
      });
    }
  }
  // 4. An interior vowel dropped ("vegetable" → "vegtable").
  for (let i = 1; i < lower.length - 1; i++) {
    if (VOWELS.has(lower[i])) {
      candidates.push({ wrong: w.slice(0, i) + w.slice(i + 1), hint: `n'oublie pas le « ${lower[i]} »` });
    }
  }

  return candidates.find((c) => c.wrong.toLowerCase() !== lower && c.wrong.length >= 3 && !isRealWord(c.wrong)) ?? null;
}

function isSingleWord(value: string): boolean {
  return /^[A-Za-z]+$/.test(value);
}

/** Picks `n` distractors whose displayed text differs from the answer and from each other. */
function distinctDistractors(
  answer: VocabularyItem,
  pool: VocabularyItem[],
  key: 'english' | 'french',
  n: number,
  rng: () => number,
) {
  const seen = new Set([answer[key].toLowerCase()]);
  const out: VocabularyItem[] = [];
  for (const v of shuffle(pool, rng)) {
    const k = v[key].toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(v);
    if (out.length === n) break;
  }
  return out;
}

function vocabularyQuizzes(words: VocabularyItem[], rng: () => number): QuizSeed[] {
  const chosen = shuffle(words, rng).slice(0, 7);
  return chosen.map((word, i) => {
    const frToEn = i < 4;
    const key = frToEn ? 'english' : 'french';
    const distractors = distinctDistractors(word, words, key, 3, rng);
    const options = shuffle([word, ...distractors], rng).map((v) => v[key]);
    const others = distractors.map((d) => `« ${d.english} » = ${d.french}`).join(' ; ');
    return {
      category: 'vocabulary' as const,
      kind: 'mcq' as const,
      prompt: frToEn ? `« ${word.french} » se dit :` : `Que signifie « ${word.english} » ?`,
      options,
      answerIndex: options.indexOf(word[key]),
      explanation: `« ${word.english} » = ${word.french}. Les autres : ${others}. Exemple : ${word.example}`,
    };
  });
}

function reorderQuizzes(words: VocabularyItem[], rng: () => number, max: number): QuizSeed[] {
  const sentences = words
    .map((w) => w.example)
    .filter((s) => {
      const n = s.split(/\s+/).length;
      return n >= 4 && n <= 9;
    });
  return shuffle(sentences, rng)
    .slice(0, max)
    .map((sentence) => ({
      category: 'grammar' as const,
      kind: 'reorder' as const,
      prompt: "Remets les mots dans l'ordre.",
      words: sentence.split(/\s+/),
      explanation: `Ordre naturel de la phrase anglaise : sujet → verbe → complément, puis lieu et temps. Phrase complète : « ${sentence} »`,
    }));
}

function spellingQuizzes(words: VocabularyItem[], rng: () => number, reservedSentences: Set<string>): QuizSeed[] {
  const out: QuizSeed[] = [];
  const used = new Set<string>();
  // Sentences already used for re-ordering would give the answer away.
  const shuffled = shuffle(words, rng).filter((w) => !reservedSentences.has(w.example));

  // Three deliberate typos inside the example sentence.
  for (const w of shuffled) {
    if (out.length >= 3) break;
    if (!isSingleWord(w.english) || w.english.length < 4) continue;
    const found = findWord(w.example, w.english);
    if (!found) continue;
    const typo = makeTypo(found.text);
    if (!typo) continue;
    const text = w.example.slice(0, found.index) + typo.wrong + w.example.slice(found.index + found.text.length);
    out.push({
      category: 'spelling',
      kind: 'correct',
      prompt: 'Un mot est mal orthographié. Écris-le correctement.',
      text,
      wrong: typo.wrong,
      answers: [found.text],
      explanation: `On écrit « ${found.text} » (${w.french}) : ${typo.hint}.`,
    });
    used.add(w.english);
  }

  // Gap-fills from the examples, with the French meaning as a gentle hint.
  for (const w of shuffled) {
    if (out.length >= 7) break;
    if (used.has(w.english)) continue;
    const found = findWord(w.example, w.english);
    if (!found) continue;
    out.push({
      category: 'spelling',
      kind: 'fill',
      prompt: `Écris le mot manquant (${w.french}).`,
      text: w.example.slice(0, found.index) + '___' + w.example.slice(found.index + found.text.length),
      answers: [found.text, w.english],
      explanation: `« ${w.english} » = ${w.french}. Phrase complète : « ${w.example} »`,
    });
    used.add(w.english);
  }

  // Fallback: type the English word from its French meaning.
  for (const w of shuffled) {
    if (out.length >= 7) break;
    if (used.has(w.english)) continue;
    out.push({
      category: 'spelling',
      kind: 'fill',
      prompt: `Traduis en anglais : « ${w.french} ».`,
      text: '___',
      answers: [w.english],
      explanation: `« ${w.french} » se dit « ${w.english} ». Exemple : ${w.example}`,
    });
    used.add(w.english);
  }
  return out;
}

/** Builds a complete lesson (with its 21-quiz bank) from an authored spec. */
export function buildLesson(
  spec: LessonSpec,
  level: Level,
  order: number,
  grammarLibrary: Record<string, GrammarPoint>,
): LessonSeed {
  const id = `${level.toLowerCase()}-${String(order).padStart(2, '0')}`;
  const grammar = grammarLibrary[spec.grammar];
  if (!grammar) throw new Error(`Unknown grammar point "${spec.grammar}" in lesson ${id}`);
  const vocabulary = parseWords(spec.words);
  const rng = createRng(hashString(id));

  const reorders = reorderQuizzes(vocabulary, rng, 2);
  // Rotate through the grammar bank so lessons sharing a point see different items.
  const start = (order * 3) % grammar.quizzes.length;
  const rotated = [...grammar.quizzes.slice(start), ...grammar.quizzes.slice(0, start)];
  const grammarItems = rotated.slice(0, 7 - reorders.length);

  return {
    id,
    level,
    order,
    title: spec.title,
    theme: spec.theme,
    vocabulary,
    grammarTip: grammar.tip,
    keyPhrases: parsePhrases(spec.phrases),
    quizzes: [
      ...vocabularyQuizzes(vocabulary, rng),
      ...grammarItems,
      ...reorders,
      ...spellingQuizzes(
        vocabulary,
        rng,
        new Set(reorders.map((r) => (r.kind === 'reorder' ? r.words.join(' ') : ''))),
      ),
    ],
    journalPrompt: spec.journal,
  };
}

/** Builds a level track; orders continue after the hand-written lessons. */
export function buildTrack(
  level: Level,
  firstOrder: number,
  specs: LessonSpec[],
  grammarLibrary: Record<string, GrammarPoint>,
): LessonSeed[] {
  return specs.map((spec, i) => buildLesson(spec, level, firstOrder + i, grammarLibrary));
}
