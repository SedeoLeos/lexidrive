import type { DailyPath, DailyStep } from '../entities';

export interface DailyActivity {
  dueFlashcards: number;
  reviewedToday: boolean;
  lessonDoneToday: boolean;
  listeningDoneToday: boolean;
  journalDoneToday: boolean;
  nextLessonId: string | null;
  nextLessonTitle: string | null;
}

/**
 * The guided daily path: four short, concrete steps. The learner never wonders
 * "what should I do now?" — the next undone step is always one tap away.
 */
export function buildDailyPath(a: DailyActivity): DailyPath {
  const steps: DailyStep[] = [
    {
      id: 'review',
      title: 'Réviser mes mots',
      subtitle:
        a.dueFlashcards > 0
          ? `${a.dueFlashcards} carte(s) à revoir`
          : a.reviewedToday
            ? 'Cartes revues'
            : 'Rien à revoir pour l’instant',
      icon: 'layers',
      minutes: 5,
      done: a.reviewedToday || a.dueFlashcards === 0,
      href: '/review',
    },
    {
      id: 'lesson',
      title: 'Apprendre et s’entraîner',
      subtitle: a.nextLessonTitle ?? 'Leçon du jour',
      icon: 'book-open',
      minutes: 15,
      done: a.lessonDoneToday,
      href: a.nextLessonId ? `/lesson/${a.nextLessonId}` : '/courses',
    },
    {
      id: 'listening',
      title: 'Écoute active',
      subtitle: 'Entendre, comprendre, écrire',
      icon: 'headphones',
      minutes: 5,
      done: a.listeningDoneToday,
      href: '/listening',
    },
    {
      id: 'journal',
      title: 'Écrire 3 phrases',
      subtitle: 'Ta journée, en anglais',
      icon: 'feather',
      minutes: 10,
      done: a.journalDoneToday,
      href: '/journal',
    },
  ];
  // "Nothing to review" only counts as done when there truly are no cards yet.
  const completed = steps.filter((s) => s.done).length;
  return { steps, completed, next: steps.find((s) => !s.done) ?? null };
}
