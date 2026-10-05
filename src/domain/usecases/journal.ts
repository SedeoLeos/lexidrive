import { dayNumber, toLocalDateKey } from '@/core/utils/date';
import { countWords } from '@/core/utils/text';
import type { JournalDraft, JournalEntry, JournalPrompt } from '../entities';
import type { ICourseRepository, IJournalRepository, IProgressRepository } from '../repositories';

/**
 * Prompt of the day: the journal prompt of the learner's next lesson when available,
 * otherwise a deterministic rotation through the general prompt pool (alternating life / debate).
 */
export class GetDailyPromptUseCase {
  constructor(
    private readonly journal: IJournalRepository,
    private readonly courses: ICourseRepository,
    private readonly progress: IProgressRepository,
  ) {}

  async execute(now: Date = new Date()): Promise<{ lessonPrompt: JournalPrompt | null; dailyPrompt: JournalPrompt }> {
    const prompts = await this.journal.getPrompts();
    const pool = prompts.filter((p) => !p.lessonId);
    const dailyPrompt = pool[dayNumber(now) % Math.max(1, pool.length)] ?? {
      id: 'fallback',
      kind: 'life' as const,
      text: "Raconte ta journée d'hier en détail : ce que tu as fait, avec qui, et ce que tu as ressenti.",
    };

    const user = await this.progress.getUserProgress();
    const next = await this.courses.getNextLesson(user.currentLevel);
    let lessonPrompt: JournalPrompt | null = null;
    if (next) {
      const lesson = await this.courses.getLesson(next.id);
      if (lesson) {
        lessonPrompt = { id: `lesson:${lesson.id}`, kind: 'debate', text: lesson.journalPrompt, lessonId: lesson.id };
      }
    }
    return { lessonPrompt, dailyPrompt };
  }
}

export class EmptyJournalError extends Error {
  constructor() {
    super('Écris au moins quelques mots avant de sauvegarder.');
    this.name = 'EmptyJournalError';
  }
}

export class SaveJournalEntryUseCase {
  constructor(private readonly journal: IJournalRepository) {}

  async execute(draft: Omit<JournalDraft, 'dateKey'> & { dateKey?: string }): Promise<JournalEntry> {
    const frenchText = draft.frenchText.trim();
    const englishText = draft.englishText.trim();
    if (countWords(frenchText) + countWords(englishText) === 0) throw new EmptyJournalError();
    return this.journal.save({
      ...draft,
      frenchText,
      englishText,
      dateKey: draft.dateKey ?? toLocalDateKey(),
    });
  }
}

export class GetJournalHistoryUseCase {
  constructor(private readonly journal: IJournalRepository) {}

  async execute(limit = 30, offset = 0): Promise<{ entries: JournalEntry[]; total: number }> {
    const [entries, total] = await Promise.all([this.journal.list(limit, offset), this.journal.count()]);
    return { entries, total };
  }
}

export class GetJournalEntryUseCase {
  constructor(private readonly journal: IJournalRepository) {}
  execute(id: number): Promise<JournalEntry | null> {
    return this.journal.getById(id);
  }
}

export class DeleteJournalEntryUseCase {
  constructor(private readonly journal: IJournalRepository) {}
  execute(id: number): Promise<void> {
    return this.journal.delete(id);
  }
}
