/**
 * The daily Bootcamp: ~7 hours of study, freely split into as many sittings as the learner wants.
 * Each module has its own minute budget; the sum is the daily goal.
 */
export const STUDY_ACTIVITIES = [
  'vocabulary',
  'grammar',
  'quiz',
  'pronunciation',
  'journal',
  'dictionary',
  'exam',
] as const;

export type StudyActivity = (typeof STUDY_ACTIVITIES)[number];

export interface BootcampModule {
  activity: StudyActivity;
  label: string;
  description: string;
  targetMinutes: number;
}

export const BOOTCAMP_MODULES: readonly BootcampModule[] = [
  { activity: 'vocabulary', label: 'Vocabulaire', description: 'Les 20 mots du jour, en contexte.', targetMinutes: 60 },
  { activity: 'grammar', label: 'Grammaire', description: "L'astuce du jour et les phrases clés.", targetMinutes: 60 },
  {
    activity: 'quiz',
    label: 'Quiz intensifs',
    description: 'Mémorisation active, vingt questions et plus.',
    targetMinutes: 90,
  },
  {
    activity: 'pronunciation',
    label: 'Prononciation',
    description: 'Écoute et répétition à voix haute.',
    targetMinutes: 45,
  },
  {
    activity: 'journal',
    label: 'Journal & Débat',
    description: 'Traduire sa propre vie en anglais.',
    targetMinutes: 75,
  },
  {
    activity: 'dictionary',
    label: 'Dictionnaire',
    description: 'Explorer, écouter, retenir les collocations.',
    targetMinutes: 30,
  },
  {
    activity: 'exam',
    label: 'Examens & révision',
    description: 'Préparer le passage au niveau suivant.',
    targetMinutes: 60,
  },
];

/** 7 hours = 420 minutes. Derived from the modules so the two can never drift apart. */
export const DAILY_GOAL_MINUTES = BOOTCAMP_MODULES.reduce((sum, m) => sum + m.targetMinutes, 0);

/** How often (ms) an active study session flushes its elapsed time to SQLite. */
export const STUDY_HEARTBEAT_MS = 15_000;

/**
 * Upper bound (s) accepted for a single heartbeat delta. Protects the log against clock jumps
 * or a JS thread that was frozen in background without an AppState event.
 */
export const MAX_HEARTBEAT_DELTA_SECONDS = 60;

/** Minimum study seconds in a day for it to count towards the streak. */
export const STREAK_MIN_SECONDS = 60;

/** Pass mark for a level exam (fraction of points). */
export const EXAM_PASS_RATIO = 0.8;

/** Score needed for a lesson to be considered completed. */
export const LESSON_PASS_RATIO = 0.6;
