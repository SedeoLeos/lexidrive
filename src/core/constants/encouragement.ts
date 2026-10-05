/**
 * Warm, varied feedback. A correct answer is celebrated, a mistake is reframed as progress.
 */
export const CORRECT_MESSAGES = [
  'Exact.',
  'Bravo !',
  'Parfait.',
  'Excellent !',
  'Tu l’as.',
  'Impeccable.',
  'Bien joué !',
];
export const WRONG_MESSAGES = [
  'Presque !',
  'Bonne tentative.',
  'Pas tout à fait.',
  'On y est presque.',
  'C’est en se trompant qu’on retient.',
];

export function pickMessage(list: readonly string[], seed: number): string {
  return list[Math.abs(seed) % list.length];
}

/** Score-based message for end-of-session screens. */
export function scoreMessage(ratio: number): string {
  if (ratio >= 0.95) return 'Remarquable. Tu maîtrises ce sujet.';
  if (ratio >= 0.8) return 'Très beau score. Continue sur cette lancée.';
  if (ratio >= 0.6) return 'Validé. Chaque erreur revue aujourd’hui est un mot acquis demain.';
  if (ratio >= 0.4) return 'Tu progresses. Relis les explications et retente : ça viendra vite.';
  return 'Un début, c’est déjà beaucoup. Reprends la leçon tranquillement, puis réessaie.';
}
