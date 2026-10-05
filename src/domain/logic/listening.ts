import { normalizeAnswer } from '@/core/utils/text';
import { createRng, shuffle } from '@/core/utils/random';
import type { DictationResult, ListeningItem, VocabularyItem, KeyPhrase } from '../entities';

/**
 * Builds a short immersive session from a lesson: 6 "hear and choose the meaning" items
 * and 3 dictations of key phrases — about five minutes.
 */
export function buildListeningItems(
  lessonId: string,
  vocabulary: readonly VocabularyItem[],
  phrases: readonly KeyPhrase[],
  seed: number,
  choose = 6,
  dictations = 3,
): ListeningItem[] {
  const rng = createRng(seed);
  const words = shuffle(vocabulary, rng).slice(0, Math.min(choose, vocabulary.length));
  const chooseItems: ListeningItem[] = words.map((word, i) => {
    const distractors = pickDistractors(word, vocabulary, rng);
    const options = shuffle([word.french, ...distractors], rng);
    return {
      kind: 'listen-choose',
      id: `${lessonId}-l${i}`,
      audio: word.english,
      options,
      answerIndex: options.indexOf(word.french),
    };
  });
  const dictationItems: ListeningItem[] = shuffle(phrases, rng)
    .slice(0, dictations)
    .map((ph, i) => ({ kind: 'dictation', id: `${lessonId}-d${i}`, audio: ph.english, translation: ph.french }));
  return [...chooseItems, ...dictationItems];
}

/** Meaningful French tokens (≥ 3 letters) used to detect near-synonym options. */
function frenchTokens(value: string): Set<string> {
  return new Set(
    normalizeAnswer(value)
      .split(/[^a-z]+/)
      .filter((t) => t.length >= 3),
  );
}

/**
 * Three wrong options that do not share a meaningful word with the answer
 * ("prénom" is not a fair distractor for "nom de famille"), falling back to any other word.
 */
function pickDistractors(word: VocabularyItem, vocabulary: readonly VocabularyItem[], rng: () => number): string[] {
  const target = frenchTokens(word.french);
  const others = vocabulary.filter((v) => v.french !== word.french);
  const unrelated = others.filter((v) => ![...frenchTokens(v.french)].some((t) => target.has(t)));
  const pool = unrelated.length >= 3 ? unrelated : others;
  return shuffle(pool, rng)
    .slice(0, 3)
    .map((v) => v.french);
}

function words(value: string): string[] {
  return normalizeAnswer(value)
    .replace(/[.,!?;:"«»()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Lenient dictation grading (easy pedagogy): punctuation and case are ignored and the
 * attempt passes with ≥ 80 % of the expected words in order (longest common subsequence).
 */
export function gradeDictation(expected: string, typed: string, passRatio = 0.8): DictationResult {
  const exp = words(expected);
  const got = words(typed);
  const dp: number[][] = Array.from({ length: exp.length + 1 }, () => new Array<number>(got.length + 1).fill(0));
  for (let i = 1; i <= exp.length; i++) {
    for (let j = 1; j <= got.length; j++) {
      dp[i][j] = exp[i - 1] === got[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  // Walk back to flag which expected words were matched.
  const ok = new Array<boolean>(exp.length).fill(false);
  let i = exp.length;
  let j = got.length;
  while (i > 0 && j > 0) {
    if (exp[i - 1] === got[j - 1]) {
      ok[i - 1] = true;
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) i--;
    else j--;
  }
  const accuracy = exp.length === 0 ? 0 : dp[exp.length][got.length] / exp.length;
  const originalWords = expected.split(/\s+/).filter(Boolean);
  return {
    correct: accuracy >= passRatio,
    accuracy,
    words: originalWords.map((w, k) => ({ word: w, ok: ok[k] ?? false })),
  };
}
