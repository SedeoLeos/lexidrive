import { STREAK_MIN_SECONDS } from '@/core/constants/bootcamp';
import { dayNumber, toLocalDateKey } from '@/core/utils/date';
import type {
  Achievement,
  AchievementDefinition,
  AchievementStats,
  DailyPath,
  DictionaryEntry,
  Reward,
  XpSource,
  XpSummary,
} from '../entities';
import { ACHIEVEMENTS, evaluateAchievements } from '../logic/achievements';
import { buildDailyPath } from '../logic/dailyPath';
import { LEARNED_BOX } from '../logic/srs';
import { computeStreak } from '../logic/streak';
import { levelForXp, summarizeXp, XP_POINTS, XP_REASON } from '../logic/xp';
import type {
  ICourseRepository,
  IDictionaryRepository,
  IExamRepository,
  IFlashcardRepository,
  IJournalRepository,
  IMotivationRepository,
  IProgressRepository,
} from '../repositories';

/** Collects the learner statistics achievements are evaluated against. */
export class GetAchievementStatsUseCase {
  constructor(
    private readonly motivation: IMotivationRepository,
    private readonly progress: IProgressRepository,
    private readonly journal: IJournalRepository,
    private readonly exams: IExamRepository,
    private readonly flashcards: IFlashcardRepository,
  ) {}

  async execute(now: Date = new Date()): Promise<AchievementStats> {
    const [
      lessonsCompleted,
      wordsLearned,
      flashcardReviews,
      listeningSessions,
      journalEntries,
      examsPassed,
      totalStudySeconds,
      activeDays,
      totalXp,
    ] = await Promise.all([
      this.progress.countCompletedLessons(),
      this.flashcards.countLearned(LEARNED_BOX),
      this.flashcards.countReviews(),
      this.motivation.countBySource('listening'),
      this.journal.count(),
      this.exams.countPassed(),
      this.progress.getTotalStudySeconds(),
      this.progress.getActiveDays(STREAK_MIN_SECONDS),
      this.motivation.getTotalXp(),
    ]);
    return {
      lessonsCompleted,
      wordsLearned,
      flashcardReviews,
      listeningSessions,
      journalEntries,
      examsPassed,
      totalStudySeconds,
      streak: computeStreak(activeDays, toLocalDateKey(now)).current,
      totalXp,
    };
  }
}

/**
 * Single entry point for rewards: records XP, detects an experience level-up and unlocks
 * any newly earned achievement, returning everything the UI needs to celebrate.
 */
export class AwardXpUseCase {
  constructor(
    private readonly motivation: IMotivationRepository,
    private readonly stats: GetAchievementStatsUseCase,
  ) {}

  async execute(
    source: XpSource,
    refId: string,
    points: number = XP_POINTS[source],
    reason: string = XP_REASON[source],
  ): Promise<Reward> {
    const before = await this.motivation.getTotalXp();
    const gained = Math.max(0, Math.round(points));
    if (gained > 0) await this.motivation.addXp(toLocalDateKey(), source, refId, gained);
    const total = before + gained;
    const levelBefore = levelForXp(before);
    const levelAfter = levelForXp(total);
    return {
      points: gained,
      reason,
      totalXp: total,
      levelUp: levelAfter.level > levelBefore.level ? levelAfter : null,
      achievements: await this.unlockNew(),
    };
  }

  /** Unlocks achievements whose condition is now met; returns only the new ones. */
  async unlockNew(): Promise<AchievementDefinition[]> {
    const [stats, unlocked] = await Promise.all([this.stats.execute(), this.motivation.getUnlockedAchievements()]);
    const now = new Date().toISOString();
    const fresh = evaluateAchievements(stats).filter((id) => !unlocked[id]);
    for (const id of fresh) await this.motivation.unlockAchievement(id, now);
    return ACHIEVEMENTS.filter((a) => fresh.includes(a.id));
  }
}

export interface MotivationOverview {
  xp: XpSummary;
  achievements: Achievement[];
  unlockedCount: number;
  wordsLearned: number;
}

export class GetMotivationOverviewUseCase {
  constructor(
    private readonly motivation: IMotivationRepository,
    private readonly flashcards: IFlashcardRepository,
  ) {}

  async execute(now: Date = new Date()): Promise<MotivationOverview> {
    const [total, today, unlocked, wordsLearned] = await Promise.all([
      this.motivation.getTotalXp(),
      this.motivation.getXpForDate(toLocalDateKey(now)),
      this.motivation.getUnlockedAchievements(),
      this.flashcards.countLearned(LEARNED_BOX),
    ]);
    const achievements = ACHIEVEMENTS.map((a) => ({ ...a, unlockedAt: unlocked[a.id] ?? null }));
    return {
      xp: summarizeXp(total, today),
      achievements,
      unlockedCount: achievements.filter((a) => a.unlockedAt).length,
      wordsLearned,
    };
  }
}

/** The guided "Parcours du jour" with today's completion state. */
export class GetDailyPathUseCase {
  constructor(
    private readonly motivation: IMotivationRepository,
    private readonly flashcards: IFlashcardRepository,
    private readonly journal: IJournalRepository,
    private readonly courses: ICourseRepository,
    private readonly progress: IProgressRepository,
  ) {}

  async execute(now: Date = new Date()): Promise<DailyPath> {
    const todayKey = toLocalDateKey(now);
    const user = await this.progress.getUserProgress();
    const [sources, dueFlashcards, journalToday, nextLesson] = await Promise.all([
      this.motivation.getSourcesForDate(todayKey),
      this.flashcards.countDue(todayKey),
      this.journal.getByDate(todayKey),
      this.courses.getNextLesson(user.currentLevel),
    ]);
    return buildDailyPath({
      dueFlashcards,
      reviewedToday: sources.includes('flashcard'),
      lessonDoneToday: sources.includes('quiz_correct') || sources.includes('lesson_completed'),
      listeningDoneToday: sources.includes('listening'),
      journalDoneToday: journalToday.length > 0,
      nextLessonId: nextLesson?.id ?? null,
      nextLessonTitle: nextLesson?.title ?? null,
    });
  }
}

/** A different "pillar" word every day, to hear and remember. */
export class GetWordOfTheDayUseCase {
  constructor(private readonly dictionary: IDictionaryRepository) {}

  async execute(now: Date = new Date()): Promise<DictionaryEntry | null> {
    const pool = await this.dictionary.listByCategory('pillar', 200);
    if (pool.length === 0) return null;
    return pool[dayNumber(now) % pool.length];
  }
}
