import type { Level } from '@/core/constants/levels';
import type { GrammarPoint } from '../generator';
import type { QuizSeed } from '../types';

/** Compact constructor for a grammar point of the library. */
export function G(
  level: Level,
  id: string,
  title: string,
  explanation: string,
  shortcut: string,
  examples: string[],
  quizzes: QuizSeed[],
): GrammarPoint {
  // Short item explanations are completed with the point's shortcut, so every answer teaches the rule.
  const enriched = quizzes.map((quiz) =>
    quiz.explanation.length < 40 ? { ...quiz, explanation: `${quiz.explanation} Rappel : ${shortcut}` } : quiz,
  );
  return { id, level, tip: { title, explanation, shortcut, examples }, quizzes: enriched };
}

export function library(points: GrammarPoint[]): Record<string, GrammarPoint> {
  return Object.fromEntries(points.map((p) => [p.id, p]));
}
