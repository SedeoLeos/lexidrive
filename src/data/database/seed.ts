import type { SQLiteDatabase } from 'expo-sqlite';
import { normalizeSearch } from '@/core/utils/text';
import type { DictionarySeed, LessonSeed } from '../content/types';
import { quizId, examQuestionId } from '../mappers/ids';

/** Higher wins when the same headword appears in several sources. */
const CATEGORY_PRIORITY: Record<DictionarySeed['category'], number> = {
  pillar: 5,
  connector: 4,
  idiom: 4,
  core: 3,
  lesson: 1,
};

/**
 * Merges the curated dictionary with every lesson vocabulary item into one entry per headword.
 * The richest source keeps the entry; missing fields (example, level) are filled from the others.
 */
export function buildDictionarySeeds(
  curated: readonly DictionarySeed[],
  lessons: readonly LessonSeed[],
): DictionarySeed[] {
  const fromLessons: DictionarySeed[] = lessons.flatMap((lesson) =>
    lesson.vocabulary.map((v) => ({
      word: v.english,
      translation: v.french,
      example: v.example,
      level: lesson.level,
      category: 'lesson' as const,
    })),
  );

  const byKey = new Map<string, DictionarySeed>();
  for (const entry of [...curated, ...fromLessons]) {
    const key = normalizeSearch(entry.word);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, { ...entry });
      continue;
    }
    const [winner, loser] =
      CATEGORY_PRIORITY[entry.category] > CATEGORY_PRIORITY[existing.category] ? [entry, existing] : [existing, entry];
    byKey.set(key, {
      ...loser,
      ...winner,
      example: winner.example ?? loser.example,
      definition: winner.definition ?? loser.definition,
      partOfSpeech: winner.partOfSpeech ?? loser.partOfSpeech,
      level: winner.level ?? loser.level,
      collocations: winner.collocations?.length ? winner.collocations : loser.collocations,
      alternatives: winner.alternatives?.length ? winner.alternatives : loser.alternatives,
      note: winner.note ?? loser.note,
    });
  }
  return [...byKey.values()];
}

/** Wipes and re-inserts every content table. Must run inside a transaction. */
export async function seedContent(db: SQLiteDatabase): Promise<void> {
  // Loaded on demand: the full curriculum is only needed when (re)seeding.
  const { DICTIONARY, EXAMS, JOURNAL_PROMPTS, LESSONS } = await import('../content');
  await db.execAsync(`
    DELETE FROM course_quizzes;
    DELETE FROM courses;
    DELETE FROM exam_questions;
    DELETE FROM exams;
    DELETE FROM dictionary;
    DELETE FROM journal_prompts;
  `);

  // ── Courses & quiz bank ──
  const courseStmt = await db.prepareAsync(
    `INSERT INTO courses (id, level, position, title, theme, vocabulary_json, grammar_json, phrases_json, journal_prompt)
     VALUES ($id, $level, $position, $title, $theme, $vocabulary, $grammar, $phrases, $journal)`,
  );
  const quizStmt = await db.prepareAsync(
    `INSERT INTO course_quizzes (id, course_id, position, category, kind, payload_json)
     VALUES ($id, $course, $position, $category, $kind, $payload)`,
  );
  try {
    for (const lesson of LESSONS) {
      await courseStmt.executeAsync({
        $id: lesson.id,
        $level: lesson.level,
        $position: lesson.order,
        $title: lesson.title,
        $theme: lesson.theme,
        $vocabulary: JSON.stringify(lesson.vocabulary),
        $grammar: JSON.stringify(lesson.grammarTip),
        $phrases: JSON.stringify(lesson.keyPhrases),
        $journal: lesson.journalPrompt,
      });
      let position = 0;
      for (const quiz of lesson.quizzes) {
        position += 1;
        const { category, kind, ...payload } = quiz;
        await quizStmt.executeAsync({
          $id: quizId(lesson.id, position),
          $course: lesson.id,
          $position: position,
          $category: category,
          $kind: kind,
          $payload: JSON.stringify(payload),
        });
      }
    }
  } finally {
    await courseStmt.finalizeAsync();
    await quizStmt.finalizeAsync();
  }

  // ── Exams ──
  const examStmt = await db.prepareAsync(
    `INSERT INTO exams (id, from_level, to_level, title, description, pass_ratio)
     VALUES ($id, $from, $to, $title, $description, $pass)`,
  );
  const questionStmt = await db.prepareAsync(
    `INSERT INTO exam_questions (id, exam_id, position, section, kind, prompt, payload_json, explanation, points)
     VALUES ($id, $exam, $position, $section, $kind, $prompt, $payload, $explanation, $points)`,
  );
  try {
    for (const exam of EXAMS) {
      await examStmt.executeAsync({
        $id: exam.id,
        $from: exam.fromLevel,
        $to: exam.toLevel,
        $title: exam.title,
        $description: exam.description,
        $pass: exam.passRatio,
      });
      let position = 0;
      for (const q of exam.questions) {
        position += 1;
        const payload =
          q.kind === 'mcq' ? { options: q.options, answerIndex: q.answerIndex } : { text: q.text, answers: q.answers };
        await questionStmt.executeAsync({
          $id: examQuestionId(exam.id, position),
          $exam: exam.id,
          $position: position,
          $section: q.section,
          $kind: q.kind,
          $prompt: q.prompt,
          $payload: JSON.stringify(payload),
          $explanation: q.explanation,
          $points: q.points ?? 1,
        });
      }
    }
  } finally {
    await examStmt.finalizeAsync();
    await questionStmt.finalizeAsync();
  }

  // ── Dictionary ──
  const dictStmt = await db.prepareAsync(
    `INSERT INTO dictionary (word, word_key, translation, translation_key, part_of_speech, definition, example,
                             collocations_json, alternatives_json, note, level, category)
     VALUES ($word, $wordKey, $translation, $translationKey, $pos, $definition, $example,
             $collocations, $alternatives, $note, $level, $category)`,
  );
  try {
    for (const entry of buildDictionarySeeds(DICTIONARY, LESSONS)) {
      await dictStmt.executeAsync({
        $word: entry.word,
        $wordKey: normalizeSearch(entry.word),
        $translation: entry.translation,
        $translationKey: normalizeSearch(entry.translation),
        $pos: entry.partOfSpeech ?? null,
        $definition: entry.definition ?? null,
        $example: entry.example ?? null,
        $collocations: JSON.stringify(entry.collocations ?? []),
        $alternatives: JSON.stringify(entry.alternatives ?? []),
        $note: entry.note ?? null,
        $level: entry.level ?? null,
        $category: entry.category,
      });
    }
  } finally {
    await dictStmt.finalizeAsync();
  }

  // ── Journal prompts ──
  const promptStmt = await db.prepareAsync(
    `INSERT INTO journal_prompts (id, kind, text, position) VALUES ($id, $kind, $text, $position)`,
  );
  try {
    let position = 0;
    for (const prompt of JOURNAL_PROMPTS) {
      position += 1;
      await promptStmt.executeAsync({ $id: prompt.id, $kind: prompt.kind, $text: prompt.text, $position: position });
    }
  } finally {
    await promptStmt.finalizeAsync();
  }
}
