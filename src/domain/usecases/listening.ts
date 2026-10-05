import { hashString } from '@/core/utils/random';
import type { ListeningSession, Reward } from '../entities';
import { buildListeningItems } from '../logic/listening';
import { XP_POINTS } from '../logic/xp';
import type { ICourseRepository, IProgressRepository } from '../repositories';
import type { AwardXpUseCase } from './motivation';

/** Builds a ~5-minute immersive listening session from a lesson (default: the next one). */
export class GetListeningSessionUseCase {
  constructor(
    private readonly courses: ICourseRepository,
    private readonly progress: IProgressRepository,
  ) {}

  async execute(lessonId?: string, seed: number = Date.now()): Promise<ListeningSession | null> {
    const user = await this.progress.getUserProgress();
    const id = lessonId ?? (await this.courses.getNextLesson(user.currentLevel))?.id;
    if (!id) return null;
    const lesson = await this.courses.getLesson(id);
    if (!lesson) return null;
    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      items: buildListeningItems(lesson.id, lesson.vocabulary, lesson.keyPhrases, seed ^ hashString(lesson.id)),
    };
  }
}

export class FinishListeningUseCase {
  constructor(private readonly award: AwardXpUseCase) {}

  execute(lessonId: string, correct: number, total: number): Promise<Reward> {
    // Finishing always earns something: showing up is what builds the habit.
    const points = Math.max(XP_POINTS.listening, correct * XP_POINTS.listening);
    return this.award.execute('listening', `${lessonId}:${Date.now()}`, points, `Écoute active · ${correct}/${total}`);
  }
}
