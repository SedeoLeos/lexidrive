import { LESSON_PASS_RATIO } from '@/core/constants/bootcamp';
import { LEVELS, isLevelUnlocked, nextLevel, type Level } from '@/core/constants/levels';
import type { Lesson, LessonSummary } from '../entities';
import { scoreRatio } from '../logic/quizGrading';
import { quizPoints, XP_POINTS } from '../logic/xp';
import type { Reward } from '../entities';
import type { AwardXpUseCase } from './motivation';
import type { ICourseRepository, IExamRepository, IProgressRepository } from '../repositories';

export interface LevelCatalog {
  level: Level;
  nextLevel: Level | null;
  /** Exam leading out of this level (null at C2). */
  examId: string | null;
  unlocked: boolean;
  current: boolean;
  lessons: LessonSummary[];
}

/** Full course catalogue A1 → C2 with lock state derived from the learner's current level. */
export class GetCourseCatalogUseCase {
  constructor(
    private readonly courses: ICourseRepository,
    private readonly progress: IProgressRepository,
    private readonly exams: IExamRepository,
  ) {}

  async execute(): Promise<LevelCatalog[]> {
    const user = await this.progress.getUserProgress();
    return Promise.all(
      LEVELS.map(async (level) => ({
        level,
        nextLevel: nextLevel(level),
        examId: (await this.exams.getExamFrom(level))?.id ?? null,
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
  /** True the first time the lesson reaches the pass mark. */
  firstCompletion: boolean;
  reward: Reward | null;
}

/** Stores a quiz-bank attempt; the lesson is completed once a score ≥ LESSON_PASS_RATIO is reached. */
export class SubmitLessonQuizUseCase {
  constructor(
    private readonly progress: IProgressRepository,
    private readonly award?: AwardXpUseCase,
  ) {}

  /**
   * @param correctWithHint right answers obtained after using a hint (earn half points).
   */
  async execute(lessonId: string, correct: number, total: number, correctWithHint = 0): Promise<LessonQuizOutcome> {
    const ratio = scoreRatio(correct, total);
    const completed = ratio >= LESSON_PASS_RATIO;
    const previous = await this.progress.getLessonProgress(lessonId);
    const firstCompletion = completed && !previous?.completed;
    await this.progress.saveLessonAttempt(lessonId, ratio, completed);
    await this.progress.addScore('lesson', lessonId, correct, total);

    let reward: Reward | null = null;
    if (this.award) {
      const hinted = Math.min(correctWithHint, correct);
      const points = quizPoints(correct - hinted, hinted) + (firstCompletion ? XP_POINTS.lesson_completed : 0);
      reward = firstCompletion
        ? await this.award.execute('lesson_completed', lessonId, points, 'Leçon validée')
        : await this.award.execute('quiz_correct', lessonId, points, `Quiz · ${correct}/${total}`);
    }
    return { ratio, completed, firstCompletion, reward };
  }
}
