import type { AchievementDefinition, AchievementStats } from '../entities';

interface Rule extends AchievementDefinition {
  test: (s: AchievementStats) => boolean;
}

/** Achievements are pure predicates over aggregated stats: easy to test, easy to extend. */
const RULES: Rule[] = [
  {
    id: 'first-steps',
    title: 'Premiers pas',
    description: 'Valider ta première leçon.',
    icon: 'check-circle',
    test: (s) => s.lessonsCompleted >= 1,
  },
  {
    id: 'five-lessons',
    title: 'Sur la lancée',
    description: 'Valider 5 leçons.',
    icon: 'book-open',
    test: (s) => s.lessonsCompleted >= 5,
  },
  {
    id: 'words-25',
    title: '25 mots ancrés',
    description: 'Mémoriser durablement 25 mots en révision.',
    icon: 'layers',
    test: (s) => s.wordsLearned >= 25,
  },
  {
    id: 'words-100',
    title: '100 mots ancrés',
    description: 'Mémoriser durablement 100 mots.',
    icon: 'layers',
    test: (s) => s.wordsLearned >= 100,
  },
  {
    id: 'reviewer',
    title: 'Mémoire vive',
    description: 'Faire 100 révisions de cartes.',
    icon: 'zap',
    test: (s) => s.flashcardReviews >= 100,
  },
  {
    id: 'ears-open',
    title: 'Oreille tendue',
    description: 'Terminer ta première écoute active.',
    icon: 'headphones',
    test: (s) => s.listeningSessions >= 1,
  },
  {
    id: 'ears-10',
    title: 'Immersion totale',
    description: 'Terminer 10 écoutes actives.',
    icon: 'headphones',
    test: (s) => s.listeningSessions >= 10,
  },
  {
    id: 'first-page',
    title: 'Première page',
    description: 'Écrire ton premier journal.',
    icon: 'feather',
    test: (s) => s.journalEntries >= 1,
  },
  {
    id: 'writer-10',
    title: 'Plume régulière',
    description: 'Écrire 10 journaux.',
    icon: 'edit-3',
    test: (s) => s.journalEntries >= 10,
  },
  {
    id: 'streak-3',
    title: 'Trois jours de suite',
    description: 'Étudier 3 jours d’affilée.',
    icon: 'sun',
    test: (s) => s.streak >= 3,
  },
  {
    id: 'streak-7',
    title: 'Une semaine entière',
    description: 'Étudier 7 jours d’affilée.',
    icon: 'sun',
    test: (s) => s.streak >= 7,
  },
  {
    id: 'streak-30',
    title: 'Discipline de fer',
    description: 'Étudier 30 jours d’affilée.',
    icon: 'target',
    test: (s) => s.streak >= 30,
  },
  {
    id: 'hour-1',
    title: 'Première heure',
    description: 'Cumuler 1 heure d’étude.',
    icon: 'clock',
    test: (s) => s.totalStudySeconds >= 3600,
  },
  {
    id: 'hours-7',
    title: 'Un Bootcamp complet',
    description: 'Cumuler 7 heures d’étude.',
    icon: 'coffee',
    test: (s) => s.totalStudySeconds >= 7 * 3600,
  },
  {
    id: 'exam-1',
    title: 'Niveau supérieur',
    description: 'Réussir ton premier examen de passage.',
    icon: 'award',
    test: (s) => s.examsPassed >= 1,
  },
  {
    id: 'xp-1000',
    title: 'Mille points',
    description: 'Atteindre 1 000 XP.',
    icon: 'star',
    test: (s) => s.totalXp >= 1000,
  },
];

export const ACHIEVEMENTS: readonly AchievementDefinition[] = RULES.map(({ test: _test, ...def }) => def);

/** Ids of every achievement whose condition is met by `stats`. */
export function evaluateAchievements(stats: AchievementStats): string[] {
  return RULES.filter((r) => r.test(stats)).map((r) => r.id);
}
