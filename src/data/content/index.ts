import type { DictionarySeed, ExamSeed, JournalPromptSeed, LessonSeed } from './types';
import { A1_LESSONS } from './lessons/a1';
import { A2_LESSONS } from './lessons/a2';
import { B1_LESSONS } from './lessons/b1';
import { B2_LESSONS } from './lessons/b2';
import { C1_LESSONS } from './lessons/c1';
import { C2_LESSONS } from './lessons/c2';
import { MATHS_LESSONS } from './lessons/maths';
import { TECHNICAL_LESSONS } from './lessons/technical';
import { levelIndex } from '@/core/constants/levels';
import { EXAM_A1_A2 } from './exams/a1-a2';
import { EXAM_A2_B1 } from './exams/a2-b1';
import { EXAM_B1_B2 } from './exams/b1-b2';
import { EXAM_B2_C1 } from './exams/b2-c1';
import { EXAM_C1_C2 } from './exams/c1-c2';
import { PILLAR_WORDS } from './dictionary/pillars';
import { IDIOMS_AND_CONNECTORS } from './dictionary/idioms';
import { CORE_WORDS } from './dictionary/core';
import { GENERAL_JOURNAL_PROMPTS } from './journal/prompts';

/**
 * Bump whenever any content file changes: the app re-seeds content tables on next launch
 * (learner data is preserved).
 */
export const CONTENT_VERSION = 2;

/** All lessons, general + maths/numbers + technical tracks, ordered by level then position. */
export const LESSONS: readonly LessonSeed[] = [
  ...A1_LESSONS,
  ...A2_LESSONS,
  ...B1_LESSONS,
  ...B2_LESSONS,
  ...C1_LESSONS,
  ...C2_LESSONS,
  ...MATHS_LESSONS,
  ...TECHNICAL_LESSONS,
].sort((a, b) => levelIndex(a.level) - levelIndex(b.level) || a.order - b.order);

export const EXAMS: readonly ExamSeed[] = [EXAM_A1_A2, EXAM_A2_B1, EXAM_B1_B2, EXAM_B2_C1, EXAM_C1_C2];

export const DICTIONARY: readonly DictionarySeed[] = [...PILLAR_WORDS, ...IDIOMS_AND_CONNECTORS, ...CORE_WORDS];

export const JOURNAL_PROMPTS: readonly JournalPromptSeed[] = GENERAL_JOURNAL_PROMPTS;
