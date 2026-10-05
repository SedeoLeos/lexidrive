import { normalizeAnswer } from '@/core/utils/text';
import type { Quiz, QuizEvaluation, QuizResponse } from '../entities';

/** True when `typed` matches one of the accepted answers (case/accents/quotes-insensitive). */
export function matchesAnswer(typed: string, accepted: readonly string[]): boolean {
  const n = normalizeAnswer(typed);
  if (n.length === 0) return false;
  return accepted.some((a) => normalizeAnswer(a) === n);
}

/** Human-readable canonical answer for a quiz. */
export function expectedAnswer(quiz: Quiz): string {
  switch (quiz.kind) {
    case 'mcq':
      return quiz.options[quiz.answerIndex];
    case 'reorder':
      return quiz.words.join(' ');
    case 'fill':
    case 'correct':
      return quiz.answers[0];
  }
}

/** Grades a single quiz response. A response of the wrong kind is always incorrect. */
export function evaluateQuiz(quiz: Quiz, response: QuizResponse): QuizEvaluation {
  const expected = expectedAnswer(quiz);
  let correct = false;

  if (quiz.kind === 'mcq' && response.kind === 'mcq') {
    correct = response.index === quiz.answerIndex;
  } else if (quiz.kind === 'reorder' && response.kind === 'reorder') {
    correct = normalizeAnswer(response.words.join(' ')) === normalizeAnswer(quiz.words.join(' '));
  } else if (quiz.kind === 'fill' && response.kind === 'fill') {
    correct = matchesAnswer(response.text, quiz.answers);
  } else if (quiz.kind === 'correct' && response.kind === 'correct') {
    correct = matchesAnswer(response.text, quiz.answers);
  }

  return { correct, expected };
}

/** Ratio in [0, 1]; an empty bank scores 0. */
export function scoreRatio(correctCount: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(1, Math.max(0, correctCount / total));
}
