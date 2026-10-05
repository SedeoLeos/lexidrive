import { LESSON_PASS_RATIO } from '@/core/constants/bootcamp';
import { LEVELS, isLevelUnlocked, type Level } from '@/core/constants/levels';
import type { Lesson, LessonSummary } from '../entities';
import { scoreRatio } from '../logic/quizGrading';
import type { ICourseRepository, IProgressRepository } from '../repositories';

export interface LevelCatalog {
  level: Level;
  unlocked: boolean;
  current: boolean;
  lessons: LessonSummary[];
}

/** Full course catalogue A1 → C2 with lock state derived from the learner's current level. */
export class GetCourseCatalogUseCase {
  constructor(
    private readonly courses: ICourseRepository,
    private readonly progress: IProgressRepository,
  ) {}

  async execute(): Promise<LevelCatalog[]> {
    const user = await this.progress.getUserProgress();
    return Promise.all(
      LEVELS.map(async (level) => ({
        level,
        unlocked: isLevelUnlocked(level, user.currentLevel),
        current: level === user.currentLevel,
        lessons: await this.courses.getLessonSummaries(level),
      })),
    );
  }
}

export class LessonLockedError extends Error {
  constructor(public readonly level: Level) {
    super(`Le niveau ${level} n'est pas encore débloqué.`);
    this.name = 'LessonLockedError';
  }
}

export class GetLessonUseCase {
  constructor(
    private readonly courses: ICourseRepository,
    private readonly progress: IProgressRepository,
  ) {}

  /** Throws `LessonLockedError` if the lesson belongs to a level above the learner's. */
  async execute(id: string): Promise<Lesson | null> {
    const lesson = await this.courses.getLesson(id);
    if (!lesson) return null;
    const user = await this.progress.getUserProgress();
    if (!isLevelUnlocked(lesson.level, user.currentLevel)) throw new LessonLockedError(lesson.level);
    return lesson;
  }
}

export interface LessonQuizOutcome {
  ratio: number;
  completed: boolean;
}

/** Stores a quiz-bank attempt; the lesson is completed once a score ≥ LESSON_PASS_RATIO is reached. */
export class SubmitLessonQuizUseCase {
  constructor(private readonly progress: IProgressRepository) {}

  async execute(lessonId: string, correct: number, total: number): Promise<LessonQuizOutcome> {
    const ratio = scoreRatio(correct, total);
    const completed = ratio >= LESSON_PASS_RATIO;
    await this.progress.saveLessonAttempt(lessonId, ratio, completed);
    await this.progress.addScore('lesson', lessonId, correct, total);
    return { ratio, completed };
  }
}
