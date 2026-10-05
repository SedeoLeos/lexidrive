/**
 * CEFR levels supported by LexiDrive, ordered from complete beginner to mastery.
 */
export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type Level = (typeof LEVELS)[number];

export interface LevelMeta {
  code: Level;
  /** Stage in the curriculum (Débutant / Cœur / Avancé). */
  stage: 'Débutant' | 'Cœur' | 'Avancé';
  title: string;
  tagline: string;
}

export const LEVEL_META: Record<Level, LevelMeta> = {
  A1: { code: 'A1', stage: 'Débutant', title: 'Fondations', tagline: 'Les mots et phrases qui font tenir debout.' },
  A2: { code: 'A2', stage: 'Débutant', title: 'Quotidien', tagline: 'Se débrouiller seul dans la vie de tous les jours.' },
  B1: { code: 'B1', stage: 'Cœur', title: 'Autonomie', tagline: 'Discuter, raconter, donner son avis sans bloquer.' },
  B2: { code: 'B2', stage: 'Cœur', title: 'Aisance professionnelle', tagline: 'Négocier, argumenter, travailler avec des anglophones.' },
  C1: { code: 'C1', stage: 'Avancé', title: 'Précision', tagline: 'Nuance, registre et élégance de la syntaxe.' },
  C2: { code: 'C2', stage: 'Avancé', title: 'Maîtrise', tagline: 'La langue littéraire, académique et ironique.' },
};

export function isLevel(value: unknown): value is Level {
  return typeof value === 'string' && (LEVELS as readonly string[]).includes(value);
}

export function levelIndex(level: Level): number {
  return LEVELS.indexOf(level);
}

/** Returns the level that follows `level`, or `null` when `level` is the last one (C2). */
export function nextLevel(level: Level): Level | null {
  const i = levelIndex(level);
  return i < LEVELS.length - 1 ? LEVELS[i + 1] : null;
}

/** True when `candidate` is at or below `reached` in the curriculum. */
export function isLevelUnlocked(candidate: Level, reached: Level): boolean {
  return levelIndex(candidate) <= levelIndex(reached);
}
