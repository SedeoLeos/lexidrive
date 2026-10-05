import type { LessonSeed } from '../../types';
import { buildTrack } from '../../generator';
import { GRAMMAR_LIBRARY } from '../../grammar';
import { A1_PART1 } from './a1-part1';

/**
 * Generated tracks: authored specs (words, phrases, prompts) + grammar library → full lessons.
 * Orders continue after the hand-written lessons of each level.
 */
export const GENERATED_LESSONS: LessonSeed[] = [...buildTrack('A1', 4, [...A1_PART1], GRAMMAR_LIBRARY)];
