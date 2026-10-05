import type { XpLevel, XpSource, XpSummary } from '../entities';

/** Default points per action. Small, frequent rewards keep motivation high. */
export const XP_POINTS: Record<XpSource, number> = {
  quiz_correct: 10,
  lesson_completed: 50,
  flashcard: 5,
  listening: 10,
  journal: 30,
  exam_passed: 200,
  daily_goal: 100,
};

export const XP_REASON: Record<XpSource, string> = {
  quiz_correct: 'Quiz',
  lesson_completed: 'Leçon validée',
  flashcard: 'Révision',
  listening: 'Écoute active',
  journal: 'Journal écrit',
  exam_passed: 'Examen réussi',
  daily_goal: 'Objectif du jour atteint',
};

const TITLES = [
  'Curieux',
  'Apprenti',
  'Explorateur',
  'Voyageur',
  'Conversant',
  'Aisé',
  'Confirmé',
  'Éloquent',
  'Virtuose',
  'Maître des mots',
];

/**
 * Level n starts at 100 · n · (n − 1) / 2 · 1.5 XP: quick first levels, then a gentle curve
 * (L2 = 150, L3 = 450, L4 = 900, L5 = 1 500 …).
 */
export function levelFloor(level: number): number {
  return Math.round((150 * level * (level - 1)) / 2);
}

export function levelForXp(totalXp: number): XpLevel {
  const xp = Math.max(0, totalXp);
  let level = 1;
  while (levelFloor(level + 1) <= xp) level += 1;
  return {
    level,
    title: TITLES[Math.min(level - 1, TITLES.length - 1)],
    floor: levelFloor(level),
    ceiling: levelFloor(level + 1),
  };
}

export function summarizeXp(total: number, today: number): XpSummary {
  const level = levelForXp(total);
  return { total, today, level, progress: (total - level.floor) / (level.ceiling - level.floor) };
}

/** Quiz points: 10 per right answer, halved when a hint was used. */
export function quizPoints(correctWithoutHint: number, correctWithHint: number): number {
  return correctWithoutHint * XP_POINTS.quiz_correct + correctWithHint * Math.floor(XP_POINTS.quiz_correct / 2);
}
