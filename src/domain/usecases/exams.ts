import { nextLevel, type Level } from '@/core/constants/levels';
import type { Exam, ExamAnswer, ExamAttempt, ExamResult } from '../entities';
import { gradeExam } from '../logic/examGrading';
import type { ICourseRepository, IExamRepository, IProgressRepository } from '../repositories';

export interface ExamEligibility {
  /** null at C2: there is nothing above. */
  exam: Pick<Exam, 'id' | 'fromLevel' | 'toLevel' | 'title' | 'description' | 'passRatio'> | null;
  questionCount: number;
  eligible: boolean;
  lessonsRemaining: number;
  attempts: ExamAttempt[];
}

/** The exam is unlocked once every lesson of the current level has been completed. */
export class GetExamEligibilityUseCase {
  constructor(
    private readonly exams: IExamRepository,
    private readonly courses: ICourseRepository,
  ) {}

  async execute(level: Level): Promise<ExamEligibility> {
    const exam = await this.exams.getExamFrom(level);
    if (!exam || nextLevel(level) === null) {
      return { exam: null, questionCount: 0, eligible: false, lessonsRemaining: 0, attempts: [] };
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
      eligible: lessonsRemaining === 0,
      lessonsRemaining,
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

/** Loads the exam for the learner's current level, refusing it when not yet eligible. */
export class StartExamUseCase {
  constructor(
    private readonly exams: IExamRepository,
    private readonly progress: IProgressRepository,
    private readonly eligibility: GetExamEligibilityUseCase,
  ) {}

  async execute(examId: string): Promise<Exam> {
    const exam = await this.exams.getExam(examId);
    if (!exam) throw new ExamNotAvailableError('Examen introuvable.');
    const user = await this.progress.getUserProgress();
    if (exam.fromLevel !== user.currentLevel) {
      throw new ExamNotAvailableError(`Cet examen se passe depuis le niveau ${exam.fromLevel}.`);
    }
    const status = await this.eligibility.execute(user.currentLevel);
    if (!status.eligible) {
      throw new ExamNotAvailableError(
        `Termine encore ${status.lessonsRemaining} leçon(s) du niveau ${exam.fromLevel} pour débloquer l'examen.`,
      );
    }
    return exam;
  }
}

export interface ExamSubmission {
  result: ExamResult;
  /** Set when the exam was passed and the learner moved up. */
  promotedTo: Level | null;
}

/** Grades the exam, records it, and promotes the learner when passed. */
export class SubmitExamUseCase {
  constructor(
    private readonly exams: IExamRepository,
    private readonly progress: IProgressRepository,
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
    return { result, promotedTo };
  }
}
