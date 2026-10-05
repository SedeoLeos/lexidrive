import type { StudyActivity } from '@/core/constants/bootcamp';
import type { Level } from '@/core/constants/levels';
import type {
  DailyStudy,
  Exam,
  ExamAnswer,
  ExamAttempt,
  Lesson,
  LessonProgress,
  LessonSummary,
  ScoreRecord,
  ScoreSource,
  UserProgress,
} from '@/domain/entities';
import { emptyBreakdown } from '@/domain/logic/studyTime';
import type { ICourseRepository, IExamRepository, IProgressRepository } from '@/domain/repositories';
import {
  ExamNotAvailableError,
  GetDashboardUseCase,
  GetExamEligibilityUseCase,
  RecordStudyTimeUseCase,
  StartExamUseCase,
  SubmitExamUseCase,
  SubmitLessonQuizUseCase,
} from '@/domain/usecases';

/** In-memory fakes implementing the Domain contracts (no SQLite needed). */
class FakeProgress implements IProgressRepository {
  level: Level = 'A1';
  time = new Map<string, number>();
  lessons = new Map<string, LessonProgress>();
  scores: ScoreRecord[] = [];

  async getUserProgress(): Promise<UserProgress> {
    return { currentLevel: this.level, dailyGoalMinutes: 420, createdAt: '', updatedAt: '' };
  }
  async setCurrentLevel(level: Level) {
    this.level = level;
  }
  async addStudyTime(dateKey: string, activity: StudyActivity, seconds: number) {
    const k = `${dateKey}|${activity}`;
    this.time.set(k, (this.time.get(k) ?? 0) + seconds);
  }
  async getDailyStudy(dateKey: string): Promise<DailyStudy> {
    const breakdown = emptyBreakdown();
    let totalSeconds = 0;
    for (const [k, v] of this.time) {
      const [d, a] = k.split('|');
      if (d === dateKey) {
        breakdown[a as StudyActivity] += v;
        totalSeconds += v;
      }
    }
    return { dateKey, totalSeconds, breakdown };
  }
  async getActiveDays(minSeconds: number) {
    const totals = new Map<string, number>();
    for (const [k, v] of this.time) totals.set(k.split('|')[0], (totals.get(k.split('|')[0]) ?? 0) + v);
    return [...totals].filter(([, v]) => v >= minSeconds).map(([d]) => d);
  }
  async getStudyHistory(): Promise<DailyStudy[]> {
    return [];
  }
  async getLessonProgress(id: string) {
    return this.lessons.get(id) ?? null;
  }
  async saveLessonAttempt(id: string, ratio: number, completed: boolean) {
    const prev = this.lessons.get(id);
    this.lessons.set(id, {
      lessonId: id,
      bestScore: Math.max(prev?.bestScore ?? 0, ratio),
      attempts: (prev?.attempts ?? 0) + 1,
      completed: (prev?.completed ?? false) || completed,
      lastStudiedAt: '',
    });
  }
  async addScore(source: ScoreSource, refId: string, score: number, maxScore: number) {
    this.scores.push({ id: this.scores.length + 1, source, refId, score, maxScore, takenAt: '' });
  }
  async getScoreHistory() {
    return this.scores;
  }
}

class FakeCourses implements ICourseRepository {
  constructor(
    private readonly progress: FakeProgress,
    private readonly ids: Record<Level, string[]>,
  ) {}
  async getLessonSummaries(level: Level): Promise<LessonSummary[]> {
    return (this.ids[level] ?? []).map((id, i) => ({
      id,
      level,
      order: i + 1,
      title: id,
      theme: '',
      quizCount: 20,
      bestScore: this.progress.lessons.get(id)?.bestScore ?? null,
      completed: this.progress.lessons.get(id)?.completed ?? false,
    }));
  }
  async getLesson(): Promise<Lesson | null> {
    return null;
  }
  async countLessons(level: Level) {
    return this.ids[level]?.length ?? 0;
  }
  async getNextLesson(level: Level) {
    const s = await this.getLessonSummaries(level);
    return s.find((l) => !l.completed) ?? s[s.length - 1] ?? null;
  }
}

function makeExam(from: Level, to: Level): Exam {
  return {
    id: `exam-${from}-${to}`,
    fromLevel: from,
    toLevel: to,
    title: '',
    description: '',
    passRatio: 0.8,
    questions: Array.from({ length: 10 }, (_, i) => ({
      id: `q${i}`,
      section: 's',
      prompt: '',
      explanation: '',
      points: 1,
      kind: 'mcq' as const,
      options: ['ok', 'ko'],
      answerIndex: 0,
    })),
  };
}

class FakeExams implements IExamRepository {
  attempts: ExamAttempt[] = [];
  exams = [makeExam('A1', 'A2'), makeExam('A2', 'B1')];
  async getExamFrom(level: Level) {
    return this.exams.find((e) => e.fromLevel === level) ?? null;
  }
  async getExam(id: string) {
    return this.exams.find((e) => e.id === id) ?? null;
  }
  async saveAttempt(examId: string, score: number, maxScore: number, passed: boolean) {
    this.attempts.push({ id: this.attempts.length + 1, examId, score, maxScore, passed, takenAt: '' });
  }
  async getAttempts(examId: string) {
    return this.attempts.filter((a) => a.examId === examId);
  }
}

function answersWith(correct: number): Record<string, ExamAnswer> {
  return Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [`q${i}`, { kind: 'mcq' as const, index: i < correct ? 0 : 1 }]),
  );
}

function setup() {
  const progress = new FakeProgress();
  const courses = new FakeCourses(progress, {
    A1: ['a1-01', 'a1-02'],
    A2: ['a2-01'],
    B1: [],
    B2: [],
    C1: [],
    C2: [],
  });
  const exams = new FakeExams();
  const eligibility = new GetExamEligibilityUseCase(exams, courses);
  return {
    progress,
    exams,
    eligibility,
    submitQuiz: new SubmitLessonQuizUseCase(progress),
    startExam: new StartExamUseCase(exams, progress, eligibility),
    submitExam: new SubmitExamUseCase(exams, progress),
    record: new RecordStudyTimeUseCase(progress),
    dashboard: new GetDashboardUseCase(progress, courses, eligibility),
  };
}

describe('lesson completion', () => {
  it('completes a lesson only at ≥ 60 % and keeps the best score', async () => {
    const { submitQuiz, progress } = setup();
    expect((await submitQuiz.execute('a1-01', 11, 21)).completed).toBe(false);
    expect((await submitQuiz.execute('a1-01', 13, 21)).completed).toBe(true);
    await submitQuiz.execute('a1-01', 2, 21);
    const lp = await progress.getLessonProgress('a1-01');
    expect(lp?.completed).toBe(true);
    expect(lp?.attempts).toBe(3);
    expect(lp?.bestScore).toBeCloseTo(13 / 21);
  });
});

describe('level exams', () => {
  it('stays locked until every lesson of the level is completed', async () => {
    const { eligibility, startExam, submitQuiz } = setup();
    expect((await eligibility.execute('A1')).lessonsRemaining).toBe(2);
    await expect(startExam.execute('exam-A1-A2')).rejects.toBeInstanceOf(ExamNotAvailableError);

    await submitQuiz.execute('a1-01', 20, 20);
    await submitQuiz.execute('a1-02', 20, 20);
    const status = await eligibility.execute('A1');
    expect(status.eligible).toBe(true);
    await expect(startExam.execute('exam-A1-A2')).resolves.toMatchObject({ toLevel: 'A2' });
  });

  it('refuses an exam that does not start from the current level', async () => {
    const { startExam } = setup();
    await expect(startExam.execute('exam-A2-B1')).rejects.toBeInstanceOf(ExamNotAvailableError);
  });

  it('promotes the learner only when the exam is passed', async () => {
    const { submitExam, exams, progress } = setup();
    const exam = exams.exams[0];

    const failed = await submitExam.execute(exam, answersWith(7));
    expect(failed.result.passed).toBe(false);
    expect(failed.promotedTo).toBeNull();
    expect(progress.level).toBe('A1');

    const passed = await submitExam.execute(exam, answersWith(8));
    expect(passed.result.passed).toBe(true);
    expect(passed.promotedTo).toBe('A2');
    expect(progress.level).toBe('A2');
    expect(exams.attempts.map((a) => a.passed)).toEqual([false, true]);
    expect(progress.scores.filter((s) => s.source === 'exam')).toHaveLength(2);
  });

  it('never re-promotes when an old exam is passed again', async () => {
    const { submitExam, exams, progress } = setup();
    progress.level = 'B1';
    const r = await submitExam.execute(exams.exams[0], answersWith(10));
    expect(r.promotedTo).toBeNull();
    expect(progress.level).toBe('B1');
  });
});

describe('fractionable 7-hour day', () => {
  it('accumulates sittings across the day into the dashboard gauge', async () => {
    const { record, dashboard } = setup();
    const morning = new Date(2026, 9, 5, 8, 0, 0).getTime();
    const evening = new Date(2026, 9, 5, 20, 0, 0).getTime();
    // Heartbeats of 15 s: 4 in the morning on vocabulary, 8 in the evening on the journal.
    for (let i = 0; i < 4; i++) await record.execute('vocabulary', morning + i * 15_000, morning + (i + 1) * 15_000);
    for (let i = 0; i < 8; i++) await record.execute('journal', evening + i * 15_000, evening + (i + 1) * 15_000);

    const data = await dashboard.execute(new Date(2026, 9, 5, 21, 0, 0));
    expect(data.today.totalSeconds).toBe(180);
    expect(data.today.breakdown.vocabulary).toBe(60);
    expect(data.today.breakdown.journal).toBe(120);
    expect(data.goal.remainingSeconds).toBe(420 * 60 - 180);
    expect(data.streak.current).toBe(1);
    expect(data.nextLesson?.id).toBe('a1-01');
  });
});
