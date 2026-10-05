import type { AchievementStats, Flashcard, XpSource } from '@/domain/entities';
import { ACHIEVEMENTS, evaluateAchievements } from '@/domain/logic/achievements';
import { buildDailyPath } from '@/domain/logic/dailyPath';
import { buildListeningItems, gradeDictation } from '@/domain/logic/listening';
import { scheduleReview } from '@/domain/logic/srs';
import { levelForXp, quizPoints, summarizeXp } from '@/domain/logic/xp';
import type { IMotivationRepository } from '@/domain/repositories';
import { AwardXpUseCase, GetAchievementStatsUseCase } from '@/domain/usecases';
import { LESSONS } from '@/data/content';

describe('experience levels', () => {
  it('starts at level 1 and grows on a gentle curve', () => {
    expect(levelForXp(0)).toMatchObject({ level: 1, title: 'Curieux', floor: 0, ceiling: 150 });
    expect(levelForXp(150).level).toBe(2);
    expect(levelForXp(449).level).toBe(2);
    expect(levelForXp(450).level).toBe(3);
    expect(summarizeXp(300, 40).progress).toBeCloseTo(0.5);
  });

  it('halves quiz points when a hint was used', () => {
    expect(quizPoints(10, 0)).toBe(100);
    expect(quizPoints(8, 2)).toBe(90);
  });
});

describe('spaced repetition (Leitner)', () => {
  const card = { box: 1 } as Pick<Flashcard, 'box'>;
  it('moves a known card up with a longer interval', () => {
    expect(scheduleReview(card, true, '2026-10-05')).toEqual({ box: 2, dueDate: '2026-10-07' });
    expect(scheduleReview({ box: 4 }, true, '2026-10-05')).toEqual({ box: 5, dueDate: '2026-10-21' });
    expect(scheduleReview({ box: 5 }, true, '2026-10-05').box).toBe(5);
  });
  it('sends a forgotten card back to box 1, due today', () => {
    expect(scheduleReview({ box: 4 }, false, '2026-10-05')).toEqual({ box: 1, dueDate: '2026-10-05' });
  });
});

describe('achievements', () => {
  const empty: AchievementStats = {
    lessonsCompleted: 0,
    wordsLearned: 0,
    flashcardReviews: 0,
    listeningSessions: 0,
    journalEntries: 0,
    examsPassed: 0,
    totalStudySeconds: 0,
    streak: 0,
    totalXp: 0,
  };
  it('unlocks nothing at the start and unique ids', () => {
    expect(evaluateAchievements(empty)).toEqual([]);
    expect(new Set(ACHIEVEMENTS.map((a) => a.id)).size).toBe(ACHIEVEMENTS.length);
  });
  it('unlocks according to stats', () => {
    const ids = evaluateAchievements({ ...empty, lessonsCompleted: 1, streak: 7, journalEntries: 1 });
    expect(ids).toEqual(expect.arrayContaining(['first-steps', 'streak-3', 'streak-7', 'first-page']));
    expect(ids).not.toContain('five-lessons');
  });
});

describe('daily path', () => {
  const base = {
    dueFlashcards: 5,
    reviewedToday: false,
    lessonDoneToday: false,
    listeningDoneToday: false,
    journalDoneToday: false,
    nextLessonId: 'a1-01',
    nextLessonTitle: 'Se présenter',
  };
  it('always points to the first unfinished step', () => {
    const path = buildDailyPath(base);
    expect(path.next?.id).toBe('review');
    expect(buildDailyPath({ ...base, reviewedToday: true }).next?.id).toBe('lesson');
    expect(buildDailyPath({ ...base, reviewedToday: true }).next?.href).toBe('/lesson/a1-01');
  });
  it('treats an empty deck as nothing to review and completes', () => {
    const path = buildDailyPath({
      ...base,
      dueFlashcards: 0,
      lessonDoneToday: true,
      listeningDoneToday: true,
      journalDoneToday: true,
    });
    expect(path.completed).toBe(4);
    expect(path.next).toBeNull();
  });
});

describe('listening', () => {
  it('builds hear-and-choose items with the right answer among options, plus dictations', () => {
    const lesson = LESSONS[0];
    const items = buildListeningItems(lesson.id, lesson.vocabulary, lesson.keyPhrases, 42);
    expect(items.filter((i) => i.kind === 'listen-choose')).toHaveLength(6);
    expect(items.filter((i) => i.kind === 'dictation')).toHaveLength(3);
    for (const item of items) {
      if (item.kind !== 'listen-choose') continue;
      const word = lesson.vocabulary.find((v) => v.english === item.audio)!;
      expect(item.options[item.answerIndex]).toBe(word.french);
      expect(new Set(item.options).size).toBe(4);
    }
  });

  it('never offers a near-synonym as a wrong option', () => {
    for (const lesson of LESSONS) {
      for (let seed = 0; seed < 5; seed++) {
        for (const item of buildListeningItems(lesson.id, lesson.vocabulary, lesson.keyPhrases, seed)) {
          if (item.kind !== 'listen-choose') continue;
          const answer = item.options[item.answerIndex];
          if (answer !== 'nom de famille') continue;
          expect(item.options).not.toContain('nom / prénom');
        }
      }
    }
  });

  it('grades dictation leniently (case, punctuation, a small slip)', () => {
    expect(gradeDictation('Where are you from?', 'where are you from').correct).toBe(true);
    const slip = gradeDictation("I'd like a kilo of tomatoes, please.", "I'd like a kilo of tomatos please");
    expect(slip.accuracy).toBeCloseTo(6 / 7);
    expect(slip.correct).toBe(true);
    expect(slip.words.find((w) => w.word.startsWith('tomatoes'))?.ok).toBe(false);
    expect(gradeDictation('Can I pay by card?', 'card').correct).toBe(false);
  });
});

describe('rewards', () => {
  class FakeMotivation implements IMotivationRepository {
    log: { source: XpSource; refId: string; points: number; date: string }[] = [];
    unlocked: Record<string, string> = {};
    async addXp(date: string, source: XpSource, refId: string, points: number) {
      this.log.push({ date, source, refId, points });
    }
    async getTotalXp() {
      return this.log.reduce((s, l) => s + l.points, 0);
    }
    async getXpForDate(d: string) {
      return this.log.filter((l) => l.date === d).reduce((s, l) => s + l.points, 0);
    }
    async getSourcesForDate(d: string) {
      return [...new Set(this.log.filter((l) => l.date === d).map((l) => l.source))];
    }
    async hasXp(source: XpSource, refId: string) {
      return this.log.some((l) => l.source === source && l.refId === refId);
    }
    async countBySource(source: XpSource) {
      return this.log.filter((l) => l.source === source).length;
    }
    async getUnlockedAchievements() {
      return this.unlocked;
    }
    async unlockAchievement(id: string, at: string) {
      this.unlocked[id] = at;
    }
  }

  it('records XP, reports level-ups and unlocks each achievement only once', async () => {
    const motivation = new FakeMotivation();
    const stats = { execute: jest.fn() } as unknown as GetAchievementStatsUseCase;
    const base: AchievementStats = {
      lessonsCompleted: 1,
      wordsLearned: 0,
      flashcardReviews: 0,
      listeningSessions: 0,
      journalEntries: 0,
      examsPassed: 0,
      totalStudySeconds: 0,
      streak: 1,
      totalXp: 0,
    };
    (stats.execute as jest.Mock).mockResolvedValue(base);
    const award = new AwardXpUseCase(motivation, stats);

    const first = await award.execute('lesson_completed', 'a1-01', 160, 'Leçon validée');
    expect(first.points).toBe(160);
    expect(first.levelUp?.level).toBe(2);
    expect(first.achievements.map((a) => a.id)).toEqual(['first-steps']);

    const second = await award.execute('quiz_correct', 'a1-01', 20);
    expect(second.totalXp).toBe(180);
    expect(second.levelUp).toBeNull();
    expect(second.achievements).toEqual([]);
  });
});
