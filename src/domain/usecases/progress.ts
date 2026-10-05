import { STREAK_MIN_SECONDS, type StudyActivity } from '@/core/constants/bootcamp';
import { LEVEL_META, nextLevel, type Level, type LevelMeta } from '@/core/constants/levels';
import { toLocalDateKey } from '@/core/utils/date';
import type { DailyStudy, LessonSummary, ScoreRecord, StreakInfo } from '../entities';
import {
  computeGoalProgress,
  computeModuleProgress,
  splitByLocalDay,
  type GoalProgress,
  type ModuleProgress,
} from '../logic/studyTime';
import { computeStreak } from '../logic/streak';
import type { ICourseRepository, IProgressRepository } from '../repositories';
import type { ExamEligibility, GetExamEligibilityUseCase } from './exams';

/**
 * Credits the wall-clock interval [fromMs, toMs] to an activity, split per local day.
 * Returns the number of seconds actually credited.
 */
export class RecordStudyTimeUseCase {
  constructor(private readonly progress: IProgressRepository) {}

  async execute(activity: StudyActivity, fromMs: number, toMs: number): Promise<number> {
    const slices = splitByLocalDay(fromMs, toMs);
    let credited = 0;
    for (const slice of slices) {
      await this.progress.addStudyTime(slice.dateKey, activity, slice.seconds);
      credited += slice.seconds;
    }
    return credited;
  }
}

export interface DashboardData {
  level: Level;
  levelMeta: LevelMeta;
  nextLevel: Level | null;
  today: DailyStudy;
  goal: GoalProgress;
  modules: ModuleProgress[];
  streak: StreakInfo;
  nextLesson: LessonSummary | null;
  lessonsCompleted: number;
  lessonsTotal: number;
  exam: ExamEligibility;
}

export class GetDashboardUseCase {
  constructor(
    private readonly progress: IProgressRepository,
    private readonly courses: ICourseRepository,
    private readonly examEligibility: GetExamEligibilityUseCase,
  ) {}

  async execute(now: Date = new Date()): Promise<DashboardData> {
    const todayKey = toLocalDateKey(now);
    const user = await this.progress.getUserProgress();
    const [today, activeDays, nextLesson, summaries, exam] = await Promise.all([
      this.progress.getDailyStudy(todayKey),
      this.progress.getActiveDays(STREAK_MIN_SECONDS),
      this.courses.getNextLesson(user.currentLevel),
      this.courses.getLessonSummaries(user.currentLevel),
      this.examEligibility.execute(user.currentLevel),
    ]);

    return {
      level: user.currentLevel,
      levelMeta: LEVEL_META[user.currentLevel],
      nextLevel: nextLevel(user.currentLevel),
      today,
      goal: computeGoalProgress(today.totalSeconds, user.dailyGoalMinutes),
      modules: computeModuleProgress(today.breakdown),
      streak: computeStreak(activeDays, todayKey),
      nextLesson,
      lessonsCompleted: summaries.filter((s) => s.completed).length,
      lessonsTotal: summaries.length,
      exam,
    };
  }
}

export interface ProgressOverview {
  level: Level;
  streak: StreakInfo;
  history: DailyStudy[];
  scores: ScoreRecord[];
  totalSecondsAllTime: number;
}

export class GetProgressOverviewUseCase {
  constructor(private readonly progress: IProgressRepository) {}

  async execute(now: Date = new Date()): Promise<ProgressOverview> {
    const todayKey = toLocalDateKey(now);
    const [user, activeDays, history, scores] = await Promise.all([
      this.progress.getUserProgress(),
      this.progress.getActiveDays(STREAK_MIN_SECONDS),
      this.progress.getStudyHistory(7, todayKey),
      this.progress.getScoreHistory(30),
    ]);
    return {
      level: user.currentLevel,
      streak: computeStreak(activeDays, todayKey),
      history,
      scores,
      totalSecondsAllTime: history.reduce((s, d) => s + d.totalSeconds, 0),
    };
  }
}

