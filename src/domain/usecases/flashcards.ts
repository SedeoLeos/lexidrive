import { toLocalDateKey } from '@/core/utils/date';
import type { Flashcard, Lesson, Reward } from '../entities';
import { scheduleReview } from '../logic/srs';
import { XP_POINTS } from '../logic/xp';
import type { IFlashcardRepository } from '../repositories';
import type { AwardXpUseCase } from './motivation';

/** Opening a lesson puts its 20 words in the spaced-repetition deck (due today). */
export class AddLessonToDeckUseCase {
  constructor(private readonly flashcards: IFlashcardRepository) {}

  execute(lesson: Pick<Lesson, 'id' | 'level' | 'vocabulary'>): Promise<number> {
    return this.flashcards.addCards(
      lesson.vocabulary.map((v) => ({
        english: v.english,
        french: v.french,
        example: v.example,
        lessonId: lesson.id,
        level: lesson.level,
      })),
      toLocalDateKey(),
    );
  }
}

export class GetReviewSessionUseCase {
  constructor(private readonly flashcards: IFlashcardRepository) {}

  async execute(limit = 20): Promise<{ cards: Flashcard[]; dueTotal: number; deckSize: number }> {
    const today = toLocalDateKey();
    const [cards, dueTotal, deckSize] = await Promise.all([
      this.flashcards.getDue(today, limit),
      this.flashcards.countDue(today),
      this.flashcards.countAll(),
    ]);
    return { cards, dueTotal, deckSize };
  }
}

export class ReviewFlashcardUseCase {
  constructor(private readonly flashcards: IFlashcardRepository) {}

  async execute(card: Flashcard, knew: boolean): Promise<{ box: number; dueDate: string }> {
    const next = scheduleReview(card, knew, toLocalDateKey());
    await this.flashcards.saveReview(card.wordKey, next.box, next.dueDate, !knew);
    return next;
  }
}

/** One reward per review session (not per card) keeps celebrations meaningful. */
export class FinishReviewSessionUseCase {
  constructor(private readonly award: AwardXpUseCase) {}

  execute(known: number, total: number): Promise<Reward> {
    const points = known * XP_POINTS.flashcard + (total - known) * 2;
    return this.award.execute('flashcard', `review:${Date.now()}`, points, `${total} cartes révisées`);
  }
}
