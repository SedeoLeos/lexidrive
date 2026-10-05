import type { KeyPhrase, VocabularyItem } from '@/domain/entities';
import type { ExamQuestionSeed, QuizSeed } from './types';

/**
 * Tiny authoring helpers so curriculum files read like a teacher's worksheet.
 * MCQ answers are given as the *text* of the correct option (resolved to an index here),
 * which removes a whole class of off-by-one content bugs. Validated by content tests.
 */

function indexOfAnswer(options: string[], answer: string): number {
  const i = options.indexOf(answer);
  if (i < 0) throw new Error(`Answer "${answer}" is not among options: ${options.join(' | ')}`);
  return i;
}

/** Vocabulary item: "word | traduction | example". */
export const w = (english: string, french: string, example: string): VocabularyItem => ({ english, french, example });

/** Key phrase. */
export const p = (english: string, french: string): KeyPhrase => ({ english, french });

/** Catégorie A — vocabulary MCQ. */
export const vocab = (prompt: string, options: string[], answer: string, explanation: string): QuizSeed => ({
  category: 'vocabulary',
  kind: 'mcq',
  prompt,
  options,
  answerIndex: indexOfAnswer(options, answer),
  explanation,
});

/** Catégorie B — grammar MCQ. */
export const grammar = (prompt: string, options: string[], answer: string, explanation: string): QuizSeed => ({
  category: 'grammar',
  kind: 'mcq',
  prompt,
  options,
  answerIndex: indexOfAnswer(options, answer),
  explanation,
});

/** Catégorie B — put the words back in order. `sentence` is the correct sentence (space-separated). */
export const order = (prompt: string, sentence: string, explanation: string): QuizSeed => ({
  category: 'grammar',
  kind: 'reorder',
  prompt,
  words: sentence.split(' '),
  explanation,
});

/** Catégorie C — type the missing word ("___" in `text`). */
export const fill = (prompt: string, text: string, answers: string | string[], explanation: string): QuizSeed => ({
  category: 'spelling',
  kind: 'fill',
  prompt,
  text,
  answers: Array.isArray(answers) ? answers : [answers],
  explanation,
});

/** Catégorie C — find and correct the deliberately misspelled word. */
export const fix = (text: string, wrong: string, answers: string | string[], explanation: string): QuizSeed => ({
  category: 'spelling',
  kind: 'correct',
  prompt: 'Un mot est mal orthographié. Écris-le correctement.',
  text,
  wrong,
  answers: Array.isArray(answers) ? answers : [answers],
  explanation,
});

/** Exam MCQ. */
export const examMcq = (
  section: string,
  prompt: string,
  options: string[],
  answer: string,
  explanation: string,
  points = 1,
): ExamQuestionSeed => ({
  kind: 'mcq',
  section,
  prompt,
  options,
  answerIndex: indexOfAnswer(options, answer),
  explanation,
  points,
});

/** Exam spelling gap-fill. */
export const examFill = (
  section: string,
  prompt: string,
  text: string,
  answers: string | string[],
  explanation: string,
  points = 1,
): ExamQuestionSeed => ({
  kind: 'fill',
  section,
  prompt,
  text,
  answers: Array.isArray(answers) ? answers : [answers],
  explanation,
  points,
});
