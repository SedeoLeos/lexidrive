import { LESSONS } from '@/data/content';
import { findWord, makeTypo, parseWords } from '@/data/content/generator';
import { GRAMMAR_LIBRARY } from '@/data/content/grammar';
import { LEXICON } from '@/data/content/spelling/lexicon';

const lexicon = new Set(LEXICON.split('\n'));
const generated = LESSONS.filter((l) =>
  l.quizzes.some((q) => q.prompt.startsWith('« ') && q.prompt.endsWith('se dit :')),
);

describe('grammar library', () => {
  it('has ≥ 10 points per level, each with a full tip and ≥ 7 items', () => {
    const points = Object.values(GRAMMAR_LIBRARY);
    for (const level of ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const) {
      expect(points.filter((p) => p.level === level).length).toBeGreaterThanOrEqual(10);
    }
    for (const p of points) {
      expect(p.tip.explanation.length).toBeGreaterThan(80);
      expect(p.tip.examples.length).toBeGreaterThanOrEqual(3);
      expect(p.quizzes.length).toBeGreaterThanOrEqual(7);
      for (const q of p.quizzes) if (q.kind === 'mcq') expect(new Set(q.options).size).toBe(q.options.length);
    }
  });
});

describe('typo maker', () => {
  it('never produces a real word', () => {
    for (const w of ['market', 'really', 'friend', 'vegetable', 'colour', 'white', 'tomorrow']) {
      const typo = makeTypo(w);
      expect(typo).not.toBeNull();
      expect(lexicon.has(typo!.wrong.toLowerCase())).toBe(false);
      expect(typo!.wrong.toLowerCase()).not.toBe(w);
    }
  });

  it('finds whole words only, case-insensitively', () => {
    expect(findWord('Cats like milk.', 'cat')).toBeNull();
    expect(findWord('My cat likes milk.', 'cat')?.text).toBe('cat');
    expect(findWord('Wash your hands.', 'wash')?.index).toBe(0);
  });
});

describe('generated lessons', () => {
  it('exist for the generated tracks', () => {
    expect(generated.length).toBeGreaterThan(0);
  });

  it.each(generated.map((l) => [l.id, l] as const))(
    '%s: 21 quizzes, 7 per category, 20 unique words',
    (_id, lesson) => {
      expect(lesson.quizzes).toHaveLength(21);
      for (const c of ['vocabulary', 'grammar', 'spelling'] as const) {
        expect(lesson.quizzes.filter((q) => q.category === c)).toHaveLength(7);
      }
      const words = lesson.vocabulary.map((v) => v.english.toLowerCase());
      expect(new Set(words).size).toBe(20);
      // Authoring quality: most examples really contain their word (needed for gap-fills and typos).
      const contained = lesson.vocabulary.filter((v) => findWord(v.example, v.english)).length;
      expect([lesson.id, contained >= 14]).toEqual([lesson.id, true]);
      // No example sentence is used both as a re-ordering and as a gap-fill.
      const reorders = lesson.quizzes.flatMap((q) => (q.kind === 'reorder' ? [q.words.join(' ')] : []));
      for (const q of lesson.quizzes) {
        if (q.kind === 'fill')
          expect(reorders.some((r) => r.includes(q.text.replace('___', q.answers[0])))).toBe(false);
      }
    },
  );

  it('parses the authoring format', () => {
    expect(parseWords('cat | chat | My cat sleeps.')).toEqual([
      { english: 'cat', french: 'chat', example: 'My cat sleeps.' },
    ]);
  });
});
