import type { SQLiteDatabase } from 'expo-sqlite';
import { LEVELS } from '@/core/constants/levels';
import { DAILY_GOAL_MINUTES } from '@/core/constants/bootcamp';
import { CONTENT_VERSION } from '../content';
import { seedContent } from './seed';

/**
 * LexiDrive local database (100 % offline).
 *
 * Two families of tables:
 *  - CONTENT  (courses, course_quizzes, dictionary, exams, exam_questions, journal_prompts):
 *    read-only curriculum shipped with the app, re-seeded whenever CONTENT_VERSION changes.
 *  - LEARNER  (user_progress, study_time_log, lesson_progress, score_history, user_journal,
 *    exam_attempts, settings): never touched by a re-seed.
 *
 * Schema changes are applied through ordered migrations tracked by `PRAGMA user_version`.
 */

export const DATABASE_NAME = 'lexidrive.db';

const LEVEL_CHECK = `(${LEVELS.map((l) => `'${l}'`).join(', ')})`;

/** Migration n brings the schema from user_version n to n + 1. */
const MIGRATIONS: readonly string[] = [
  // ── v1 ─ initial schema ──────────────────────────────────────────────────────────
  `
  CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );

  -- Curriculum: one row per daily lesson. Vocabulary, grammar tip and key phrases are
  -- stored as JSON documents because they are always read together with the lesson.
  CREATE TABLE IF NOT EXISTS courses (
    id               TEXT PRIMARY KEY NOT NULL,
    level            TEXT NOT NULL CHECK (level IN ${LEVEL_CHECK}),
    position         INTEGER NOT NULL,
    title            TEXT NOT NULL,
    theme            TEXT NOT NULL,
    vocabulary_json  TEXT NOT NULL,
    grammar_json     TEXT NOT NULL,
    phrases_json     TEXT NOT NULL,
    journal_prompt   TEXT NOT NULL,
    UNIQUE (level, position)
  );
  CREATE INDEX IF NOT EXISTS idx_courses_level ON courses (level, position);

  -- Quiz bank: 20+ items per lesson (categories vocabulary / grammar / spelling).
  CREATE TABLE IF NOT EXISTS course_quizzes (
    id            TEXT PRIMARY KEY NOT NULL,
    course_id     TEXT NOT NULL REFERENCES courses (id) ON DELETE CASCADE,
    position      INTEGER NOT NULL,
    category      TEXT NOT NULL CHECK (category IN ('vocabulary', 'grammar', 'spelling')),
    kind          TEXT NOT NULL CHECK (kind IN ('mcq', 'reorder', 'fill', 'correct')),
    payload_json  TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_quizzes_course ON course_quizzes (course_id, position);

  -- Local dictionary for the search pop-up (EN ⇄ FR, accent-insensitive keys).
  CREATE TABLE IF NOT EXISTS dictionary (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    word               TEXT NOT NULL,
    word_key           TEXT NOT NULL,
    translation        TEXT NOT NULL,
    translation_key    TEXT NOT NULL,
    part_of_speech     TEXT,
    definition         TEXT,
    example            TEXT,
    collocations_json  TEXT NOT NULL DEFAULT '[]',
    alternatives_json  TEXT NOT NULL DEFAULT '[]',
    note               TEXT,
    level              TEXT CHECK (level IS NULL OR level IN ${LEVEL_CHECK}),
    category           TEXT NOT NULL CHECK (category IN ('core', 'lesson', 'pillar', 'idiom', 'connector')),
    UNIQUE (word_key)
  );
  CREATE INDEX IF NOT EXISTS idx_dictionary_translation ON dictionary (translation_key);
  CREATE INDEX IF NOT EXISTS idx_dictionary_category ON dictionary (category, word_key);

  -- Level-transition exams and their questions.
  CREATE TABLE IF NOT EXISTS exams (
    id           TEXT PRIMARY KEY NOT NULL,
    from_level   TEXT NOT NULL UNIQUE CHECK (from_level IN ${LEVEL_CHECK}),
    to_level     TEXT NOT NULL CHECK (to_level IN ${LEVEL_CHECK}),
    title        TEXT NOT NULL,
    description  TEXT NOT NULL,
    pass_ratio   REAL NOT NULL CHECK (pass_ratio > 0 AND pass_ratio <= 1)
  );

  CREATE TABLE IF NOT EXISTS exam_questions (
    id            TEXT PRIMARY KEY NOT NULL,
    exam_id       TEXT NOT NULL REFERENCES exams (id) ON DELETE CASCADE,
    position      INTEGER NOT NULL,
    section       TEXT NOT NULL,
    kind          TEXT NOT NULL CHECK (kind IN ('mcq', 'fill')),
    prompt        TEXT NOT NULL,
    payload_json  TEXT NOT NULL,
    explanation   TEXT NOT NULL,
    points        INTEGER NOT NULL DEFAULT 1
  );
  CREATE INDEX IF NOT EXISTS idx_exam_questions ON exam_questions (exam_id, position);

  CREATE TABLE IF NOT EXISTS journal_prompts (
    id         TEXT PRIMARY KEY NOT NULL,
    kind       TEXT NOT NULL CHECK (kind IN ('life', 'debate')),
    text       TEXT NOT NULL,
    position   INTEGER NOT NULL
  );

  -- ── Learner data ──

  -- Single-row learner state.
  CREATE TABLE IF NOT EXISTS user_progress (
    id                  INTEGER PRIMARY KEY CHECK (id = 1),
    current_level       TEXT NOT NULL DEFAULT 'A1' CHECK (current_level IN ${LEVEL_CHECK}),
    daily_goal_minutes  INTEGER NOT NULL DEFAULT ${DAILY_GOAL_MINUTES},
    created_at          TEXT NOT NULL,
    updated_at          TEXT NOT NULL
  );

  -- Real-time 7-hour gauge: seconds studied per local day and Bootcamp module.
  -- Incremented by heartbeats, so time survives the app being closed and reopened.
  CREATE TABLE IF NOT EXISTS study_time_log (
    date_key    TEXT NOT NULL,
    activity    TEXT NOT NULL,
    seconds     INTEGER NOT NULL DEFAULT 0 CHECK (seconds >= 0),
    updated_at  TEXT NOT NULL,
    PRIMARY KEY (date_key, activity)
  );

  CREATE TABLE IF NOT EXISTS lesson_progress (
    lesson_id        TEXT PRIMARY KEY NOT NULL,
    best_score       REAL NOT NULL DEFAULT 0,
    attempts         INTEGER NOT NULL DEFAULT 0,
    completed        INTEGER NOT NULL DEFAULT 0,
    last_studied_at  TEXT NOT NULL
  );

  -- Score history (lesson quiz banks and exams).
  CREATE TABLE IF NOT EXISTS score_history (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    source     TEXT NOT NULL CHECK (source IN ('lesson', 'exam')),
    ref_id     TEXT NOT NULL,
    score      INTEGER NOT NULL,
    max_score  INTEGER NOT NULL,
    taken_at   TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_score_history_date ON score_history (taken_at DESC);

  CREATE TABLE IF NOT EXISTS exam_attempts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id    TEXT NOT NULL,
    score      INTEGER NOT NULL,
    max_score  INTEGER NOT NULL,
    passed     INTEGER NOT NULL,
    taken_at   TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_exam_attempts ON exam_attempts (exam_id, taken_at DESC);

  -- Life journal & debates: the learner's French text and their own English translation.
  CREATE TABLE IF NOT EXISTS user_journal (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    date_key      TEXT NOT NULL,
    prompt        TEXT NOT NULL,
    kind          TEXT NOT NULL CHECK (kind IN ('life', 'debate')),
    french_text   TEXT NOT NULL DEFAULT '',
    english_text  TEXT NOT NULL DEFAULT '',
    word_count    INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL,
    updated_at    TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_journal_date ON user_journal (date_key DESC, updated_at DESC);

  CREATE TABLE IF NOT EXISTS settings (
    key    TEXT PRIMARY KEY NOT NULL,
    value  TEXT NOT NULL
  );
  `,
  // ── v2 ─ motivation (XP, achievements) and spaced-repetition flashcards ──────────
  `
  CREATE TABLE IF NOT EXISTS xp_log (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    date_key    TEXT NOT NULL,
    source      TEXT NOT NULL,
    ref_id      TEXT NOT NULL,
    points      INTEGER NOT NULL CHECK (points >= 0),
    created_at  TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_xp_date ON xp_log (date_key);
  CREATE INDEX IF NOT EXISTS idx_xp_source ON xp_log (source, ref_id);

  CREATE TABLE IF NOT EXISTS achievements (
    id           TEXT PRIMARY KEY NOT NULL,
    unlocked_at  TEXT NOT NULL
  );

  -- Leitner deck: one card per English headword, filled as lessons are opened.
  CREATE TABLE IF NOT EXISTS flashcards (
    word_key          TEXT PRIMARY KEY NOT NULL,
    english           TEXT NOT NULL,
    french            TEXT NOT NULL,
    example           TEXT NOT NULL,
    lesson_id         TEXT NOT NULL,
    level             TEXT NOT NULL CHECK (level IN ${LEVEL_CHECK}),
    box               INTEGER NOT NULL DEFAULT 1 CHECK (box BETWEEN 1 AND 5),
    due_date          TEXT NOT NULL,
    reviews           INTEGER NOT NULL DEFAULT 0,
    lapses            INTEGER NOT NULL DEFAULT 0,
    last_reviewed_at  TEXT,
    created_at        TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_flashcards_due ON flashcards (due_date, box);
  `,
];

export const SCHEMA_VERSION = MIGRATIONS.length;

async function migrate(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;

  while (version < MIGRATIONS.length) {
    const sql = MIGRATIONS[version];
    await db.withTransactionAsync(async () => {
      await db.execAsync(sql);
    });
    version += 1;
    // PRAGMA cannot be parameterised; `version` is an internal integer.
    await db.execAsync(`PRAGMA user_version = ${version}`);
  }
}

async function ensureUserProgress(db: SQLiteDatabase): Promise<void> {
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR IGNORE INTO user_progress (id, current_level, daily_goal_minutes, created_at, updated_at)
     VALUES (1, 'A1', ?, ?, ?)`,
    DAILY_GOAL_MINUTES,
    now,
    now,
  );
}

async function ensureContent(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ value: string }>(`SELECT value FROM meta WHERE key = 'content_version'`);
  if (row?.value === String(CONTENT_VERSION)) return;

  await db.withTransactionAsync(async () => {
    await seedContent(db);
    await db.runAsync(
      `INSERT INTO meta (key, value) VALUES ('content_version', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      String(CONTENT_VERSION),
    );
  });
}

/**
 * Entry point used by <SQLiteProvider onInit={initializeDatabase}>.
 * Idempotent: safe to run on every launch.
 */
export async function initializeDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  await migrate(db);
  await ensureUserProgress(db);
  await ensureContent(db);
}
