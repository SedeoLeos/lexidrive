import { nextLevel, type Level } from '@/core/constants/levels';
import type { Exam, ExamAnswer, ExamAttempt, ExamResult, Reward } from '../entities';
import type { AwardXpUseCase } from './motivation';
import { gradeExam } from '../logic/examGrading';
import type { ICourseRepository, IExamRepository, IProgressRepository } from '../repositories';

export interface ExamEligibility {
  /** null at C2: there is nothing above. */
  exam: Pick<Exam, 'id' | 'fromLevel' | 'toLevel' | 'title' | 'description' | 'passRatio'> | null;
  questionCount: number;
  /** Always true when an exam exists: a learner who already has the level may test directly. */
  eligible: boolean;
  /** Lessons of the level not yet completed — a recommendation, never a lock. */
  lessonsRemaining: number;
  /** True once every lesson of the level is completed (the learner is "ready"). */
  prepared: boolean;
  attempts: ExamAttempt[];
}

/**
 * The exam of the current level is always open (placement-style: someone who already has
 * the level can prove it without doing the lessons). Lesson completion is reported as advice.
 */
export class GetExamEligibilityUseCase {
  constructor(
    private readonly exams: IExamRepository,
    private readonly courses: ICourseRepository,
  ) {}

  async execute(level: Level): Promise<ExamEligibility> {
    const exam = await this.exams.getExamFrom(level);
    if (!exam || nextLevel(level) === null) {
      return { exam: null, questionCount: 0, eligible: false, lessonsRemaining: 0, prepared: false, attempts: [] };
    }
    const [summaries, attempts] = await Promise.all([
      this.courses.getLessonSummaries(level),
      this.exams.getAttempts(exam.id),
    ]);
    const lessonsRemaining = summaries.filter((s) => !s.completed).length;
    const { questions, ...meta } = exam;
    return {
      exam: meta,
      questionCount: questions.length,
      eligible: true,
      lessonsRemaining,
      prepared: lessonsRemaining === 0,
      attempts,
    };
  }
}

export class ExamNotAvailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExamNotAvailableError';
  }
}

/** Loads the exam for the learner's current level (exams of other levels are refused). */
export class StartExamUseCase {
  constructor(
    private readonly exams: IExamRepository,
    private readonly progress: IProgressRepository,
  ) {}

  async execute(examId: string): Promise<Exam> {
    const exam = await this.exams.getExam(examId);
    if (!exam) throw new ExamNotAvailableError('Examen introuvable.');
    const user = await this.progress.getUserProgress();
    if (exam.fromLevel !== user.currentLevel) {
      throw new ExamNotAvailableError(`Cet examen se passe depuis le niveau ${exam.fromLevel}.`);
    }
    return exam;
  }
}

export interface ExamSubmission {
  result: ExamResult;
  /** Set when the exam was passed and the learner moved up. */
  promotedTo: Level | null;
  reward: Reward | null;
}

/** Grades the exam, records it, and promotes the learner when passed. */
export class SubmitExamUseCase {
  constructor(
    private readonly exams: IExamRepository,
    private readonly progress: IProgressRepository,
    private readonly award?: AwardXpUseCase,
  ) {}

  async execute(exam: Exam, answers: Readonly<Record<string, ExamAnswer>>): Promise<ExamSubmission> {
    const result = gradeExam(exam, answers);
    await this.exams.saveAttempt(exam.id, result.score, result.maxScore, result.passed);
    await this.progress.addScore('exam', exam.id, result.score, result.maxScore);

    let promotedTo: Level | null = null;
    if (result.passed) {
      const user = await this.progress.getUserProgress();
      if (user.currentLevel === exam.fromLevel) {
        await this.progress.setCurrentLevel(exam.toLevel);
        promotedTo = exam.toLevel;
      }
    }
    const reward =
      promotedTo && this.award
        ? await this.award.execute('exam_passed', exam.id, undefined, `Niveau ${promotedTo} atteint`)
        : null;
    return { result, promotedTo, reward };
  }
}
