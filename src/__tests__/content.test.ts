import { LEVELS } from '@/core/constants/levels';
import { CORE_WORDS } from '@/data/content/dictionary/core';
import { PILLAR_WORDS } from '@/data/content/dictionary/pillars';
import { IDIOMS_AND_CONNECTORS } from '@/data/content/dictionary/idioms';
import { DICTIONARY, EXAMS, JOURNAL_PROMPTS, LESSONS } from '@/data/content';
import { buildDictionarySeeds } from '@/data/database/seed';

/**
 * Guards the pedagogical contract of the embedded curriculum.
 */
describe('curriculum content', () => {
  it('covers every level from A1 to C2', () => {
    for (const level of LEVELS) {
      expect(LESSONS.filter((l) => l.level === level).length).toBeGreaterThanOrEqual(2);
    }
  });

  it('includes the numbers/maths and technical English tracks', () => {
    for (const id of ['a1-03', 'a2-03', 'b1-04', 'b2-05', 'c2-03', 'b1-05', 'b2-04', 'c1-03']) {
      expect(LESSONS.some((l) => l.id === id)).toBe(true);
    }
  });

  it('has unique lesson ids and contiguous order per level', () => {
    const ids = LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const level of LEVELS) {
      const orders = LESSONS.filter((l) => l.level === level)
        .map((l) => l.order)
        .sort((a, b) => a - b);
      orders.forEach((o, i) => expect(o).toBe(i + 1));
    }
  });

  describe.each(LESSONS.map((l) => [l.id, l] as const))('lesson %s', (_id, lesson) => {
    it('has exactly 20 vocabulary items with example sentences', () => {
      expect(lesson.vocabulary).toHaveLength(20);
      for (const v of lesson.vocabulary) {
        expect(v.english.trim()).not.toBe('');
        expect(v.french.trim()).not.toBe('');
        expect(v.example.trim().length).toBeGreaterThan(5);
      }
    });

    it('has a grammar tip and 5 key phrases', () => {
      expect(lesson.grammarTip.explanation.length).toBeGreaterThan(50);
      expect(lesson.grammarTip.shortcut.length).toBeGreaterThan(10);
      expect(lesson.grammarTip.examples.length).toBeGreaterThanOrEqual(3);
      expect(lesson.keyPhrases).toHaveLength(5);
    });

    it('has at least 20 quizzes spread over the 3 categories', () => {
      expect(lesson.quizzes.length).toBeGreaterThanOrEqual(20);
      for (const category of ['vocabulary', 'grammar', 'spelling'] as const) {
        expect(lesson.quizzes.filter((q) => q.category === category).length).toBeGreaterThanOrEqual(6);
      }
    });

    it('has well-formed quizzes', () => {
      for (const q of lesson.quizzes) {
        expect(q.explanation.length).toBeGreaterThan(10);
        switch (q.kind) {
          case 'mcq':
            expect(q.options).toHaveLength(4);
            expect(new Set(q.options).size).toBe(4);
            expect(q.answerIndex).toBeGreaterThanOrEqual(0);
            expect(q.answerIndex).toBeLessThan(q.options.length);
            break;
          case 'reorder':
            expect(q.words.length).toBeGreaterThanOrEqual(4);
            break;
          case 'fill':
            expect(q.text).toContain('___');
            expect(q.answers.length).toBeGreaterThan(0);
            break;
          case 'correct':
            expect(q.text).toContain(q.wrong);
            expect(q.answers.map((a) => a.toLowerCase())).not.toContain(q.wrong.toLowerCase());
            break;
        }
      }
    });

    it('has a journal prompt', () => {
      expect(lesson.journalPrompt.length).toBeGreaterThan(40);
    });
  });

  it('defines a passing exam for every level transition', () => {
    for (let i = 0; i < LEVELS.length - 1; i++) {
      const exam = EXAMS.find((e) => e.fromLevel === LEVELS[i]);
      expect(exam).toBeDefined();
      expect(exam!.toLevel).toBe(LEVELS[i + 1]);
      expect(exam!.questions).toHaveLength(25);
      expect(exam!.questions.some((q) => /Nombres|Math/.test(q.section))).toBe(true);
      expect(exam!.passRatio).toBeGreaterThanOrEqual(0.7);
      expect(exam!.questions.some((q) => q.kind === 'fill')).toBe(true);
      for (const q of exam!.questions) {
        if (q.kind === 'mcq') {
          expect(q.answerIndex).toBeGreaterThanOrEqual(0);
          expect(q.answerIndex).toBeLessThan(q.options.length);
        } else {
          expect(q.text).toContain('___');
        }
      }
    }
  });

  it('ships at least 50 pillar words with pitfalls and collocations', () => {
    expect(PILLAR_WORDS.length).toBeGreaterThanOrEqual(50);
    for (const p of PILLAR_WORDS) {
      expect(p.note).toBeTruthy();
      expect(p.collocations?.length).toBeGreaterThan(0);
    }
  });

  it('classifies idioms and connectors from B1 to C2', () => {
    for (const level of ['B1', 'B2', 'C1', 'C2'] as const) {
      expect(
        IDIOMS_AND_CONNECTORS.filter((e) => e.level === level && e.category === 'connector').length,
      ).toBeGreaterThanOrEqual(8);
      expect(
        IDIOMS_AND_CONNECTORS.filter((e) => e.level === level && e.category === 'idiom').length,
      ).toBeGreaterThanOrEqual(5);
    }
  });

  it('builds a de-duplicated dictionary that keeps the richest entry', () => {
    expect(CORE_WORDS.length).toBeGreaterThan(300);
    const merged = buildDictionarySeeds(DICTIONARY, LESSONS);
    const keys = merged.map((e) => e.word.toLowerCase());
    expect(new Set(keys).size).toBe(keys.length);
    const actually = merged.find((e) => e.word === 'actually');
    expect(actually?.category).toBe('pillar');
    // A lesson-only word still gets in.
    expect(merged.some((e) => e.word === 'haggle')).toBe(true);
  });

  it('rotates through both life and debate prompts', () => {
    expect(JOURNAL_PROMPTS.some((p) => p.kind === 'life')).toBe(true);
    expect(JOURNAL_PROMPTS.some((p) => p.kind === 'debate')).toBe(true);
    expect(new Set(JOURNAL_PROMPTS.map((p) => p.id)).size).toBe(JOURNAL_PROMPTS.length);
  });
});

describe('spelling quizzes agree with the offline spell checker', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { LEXICON } = require('@/data/content/spelling/lexicon') as { LEXICON: string };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { isWordCorrect } = require('@/domain/logic/spelling') as typeof import('@/domain/logic/spelling');
  const lexicon = new Set(LEXICON.split('\n'));
  const HOMOPHONE_TRAPS = ['bred', 'by', 'form', 'fare', 'draught', 'of', 'self-depreciating', 'constrain'];
  const quizzes = LESSONS.flatMap((l) => l.quizzes.map((q) => [l.id, q] as const));

  it.each(quizzes.filter(([, q]) => q.kind === 'correct').map(([id, q]) => [id, q]))(
    '%s: deliberate typo is flagged and the fix is accepted',
    (_id, q) => {
      if (q.kind !== 'correct') return;
      const flagged = q.wrong.split('-').some((part) => !isWordCorrect(part, lexicon));
      // Real words used on purpose as homophone / confusion traps (by ≠ buy, fare ≠ fair…).
      if (!flagged) expect(HOMOPHONE_TRAPS).toContain(q.wrong);
      for (const part of q.answers[0].split(/[-\s]/)) {
        expect([part, isWordCorrect(part, lexicon)]).toEqual([part, true]);
      }
    },
  );
});
