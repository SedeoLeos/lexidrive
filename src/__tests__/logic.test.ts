import { computeStreak } from '@/domain/logic/streak';
import { computeGoalProgress, creditableSeconds, splitByLocalDay } from '@/domain/logic/studyTime';
import { evaluateQuiz, matchesAnswer } from '@/domain/logic/quizGrading';
import { gradeExam } from '@/domain/logic/examGrading';
import { editDistance, isWordCorrect, rankSuggestions, tokenizeText } from '@/domain/logic/spelling';
import { DAILY_GOAL_MINUTES } from '@/core/constants/bootcamp';
import { nextLevel, isLevelUnlocked } from '@/core/constants/levels';
import { toLocalDateKey } from '@/core/utils/date';
import type { Exam, Quiz } from '@/domain/entities';

describe('bootcamp', () => {
  it('targets 7 hours a day', () => {
    expect(DAILY_GOAL_MINUTES).toBe(420);
  });
});

describe('study time', () => {
  it('credits elapsed seconds and caps frozen-thread gaps', () => {
    expect(creditableSeconds(0, 15_000)).toBe(15);
    expect(creditableSeconds(0, 3_600_000)).toBe(60);
    expect(creditableSeconds(10_000, 5_000)).toBe(0);
  });

  it('splits a sitting that spans midnight between both days', () => {
    const midnight = new Date(2026, 9, 6, 0, 0, 0).getTime();
    const slices = splitByLocalDay(midnight - 20_000, midnight + 30_000);
    expect(slices).toEqual([
      { dateKey: '2026-10-05', seconds: 20 },
      { dateKey: '2026-10-06', seconds: 30 },
    ]);
  });

  it('computes the 7-hour gauge', () => {
    const p = computeGoalProgress(2 * 3600 + 1800, 420);
    expect(p.hoursCompleted).toBe(2);
    expect(p.ratio).toBeCloseTo(2.5 / 7);
    expect(p.remainingSeconds).toBe(4.5 * 3600);
    expect(computeGoalProgress(99_999, 420).ratio).toBe(1);
  });
});

describe('streak', () => {
  it('counts consecutive days and keeps the streak alive until midnight', () => {
    const s = computeStreak(['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'], '2026-10-05');
    expect(s).toEqual({ current: 4, longest: 4, todayCounted: false });
  });

  it('breaks on a missing day', () => {
    const s = computeStreak(['2026-09-28', '2026-09-29', '2026-10-03', '2026-10-05'], '2026-10-05');
    expect(s.current).toBe(1);
    expect(s.longest).toBe(2);
    expect(s.todayCounted).toBe(true);
  });

  it('crosses month boundaries', () => {
    expect(computeStreak(['2026-09-30', '2026-10-01'], '2026-10-01').current).toBe(2);
  });
});

describe('levels', () => {
  it('chains A1 → C2', () => {
    expect(nextLevel('A2')).toBe('B1');
    expect(nextLevel('C2')).toBeNull();
    expect(isLevelUnlocked('B1', 'B2')).toBe(true);
    expect(isLevelUnlocked('C1', 'B2')).toBe(false);
  });
});

describe('quiz grading', () => {
  it('accepts typed answers regardless of case, accents and curly quotes', () => {
    expect(matchesAnswer('  Receipt ', ['receipt'])).toBe(true);
    expect(matchesAnswer('I’d like', ["I'd like"])).toBe(true);
    expect(matchesAnswer('', ['x'])).toBe(false);
  });

  it('grades each quiz kind', () => {
    const mcq: Quiz = { id: '1', category: 'vocabulary', kind: 'mcq', prompt: '', options: ['a', 'b'], answerIndex: 1, explanation: '' };
    expect(evaluateQuiz(mcq, { kind: 'mcq', index: 1 }).correct).toBe(true);
    expect(evaluateQuiz(mcq, { kind: 'mcq', index: 0 }).correct).toBe(false);

    const reorder: Quiz = { id: '2', category: 'grammar', kind: 'reorder', prompt: '', words: ['Where', 'are', 'you', 'from', '?'], explanation: '' };
    expect(evaluateQuiz(reorder, { kind: 'reorder', words: ['Where', 'are', 'you', 'from', '?'] }).correct).toBe(true);
    expect(evaluateQuiz(reorder, { kind: 'reorder', words: ['Where', 'you', 'are', 'from', '?'] }).correct).toBe(false);

    const fix: Quiz = { id: '3', category: 'spelling', kind: 'correct', prompt: '', text: 'freind', wrong: 'freind', answers: ['friend'], explanation: '' };
    expect(evaluateQuiz(fix, { kind: 'correct', text: 'Friend' })).toEqual({ correct: true, expected: 'friend' });
  });
});

describe('exam grading', () => {
  const exam: Exam = {
    id: 'e', fromLevel: 'A2', toLevel: 'B1', title: '', description: '', passRatio: 0.8,
    questions: Array.from({ length: 5 }, (_, i) => ({
      id: `q${i}`, section: 's', prompt: '', explanation: '', points: 1,
      kind: 'mcq' as const, options: ['a', 'b'], answerIndex: 0,
    })),
  };

  it('passes at exactly the pass ratio', () => {
    const answers = { q0: { kind: 'mcq' as const, index: 0 }, q1: { kind: 'mcq' as const, index: 0 }, q2: { kind: 'mcq' as const, index: 0 }, q3: { kind: 'mcq' as const, index: 0 } };
    const r = gradeExam(exam, answers);
    expect(r.score).toBe(4);
    expect(r.passed).toBe(true);
  });

  it('fails below the pass ratio and treats missing answers as wrong', () => {
    const r = gradeExam(exam, { q0: { kind: 'mcq', index: 0 }, q1: { kind: 'mcq', index: 1 } });
    expect(r.score).toBe(1);
    expect(r.passed).toBe(false);
    expect(r.details[4].correct).toBe(false);
  });
});

describe('spelling', () => {
  const lexicon = new Set(['i', 'am', 'a', 'student', 'friend', 'do', 'you', 'is', 'it', 'the', 'receipt', 'sarah']);

  it('handles case, contractions and possessives', () => {
    expect(isWordCorrect('Student', lexicon)).toBe(true);
    expect(isWordCorrect("don't", lexicon)).toBe(true);
    expect(isWordCorrect("won't", lexicon)).toBe(true);
    expect(isWordCorrect("I'm", lexicon)).toBe(true);
    expect(isWordCorrect('studant', lexicon)).toBe(false);
    expect(isWordCorrect('NASA', lexicon)).toBe(true);
  });

  it('tokenizes without losing characters and flags typos', () => {
    const text = 'I am a studant, my freind!';
    const tokens = tokenizeText(text, (w) => isWordCorrect(w, lexicon));
    expect(tokens.map((t) => t.text).join('')).toBe(text);
    expect(tokens.filter((t) => t.misspelled).map((t) => t.text)).toEqual(['studant', 'my', 'freind']);
  });

  it('suggests close words, transpositions first', () => {
    expect(editDistance('freind', 'friend')).toBe(1);
    expect(rankSuggestions('freind', lexicon)[0]).toBe('friend');
    expect(rankSuggestions('Reciept', lexicon)[0]).toBe('Receipt');
  });
});

describe('dates', () => {
  it('formats local date keys', () => {
    expect(toLocalDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
