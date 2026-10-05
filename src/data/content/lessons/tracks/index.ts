import type { LessonSeed } from '../../types';
import { buildTrack } from '../../generator';
import { GRAMMAR_LIBRARY } from '../../grammar';
import { A1_PART1 } from './a1-part1';
import { A1_PART2 } from './a1-part2';
import { A1_PART3 } from './a1-part3';
import { A2_PART1 } from './a2-part1';
import { A2_PART2 } from './a2-part2';
import { A2_PART3 } from './a2-part3';
import { B1_PART1 } from './b1-part1';
import { B1_PART2 } from './b1-part2';
import { B1_PART3 } from './b1-part3';

/**
 * Generated tracks: authored specs (words, phrases, prompts) + grammar library → full lessons.
 * Orders continue after the hand-written lessons of each level.
 */
export const GENERATED_LESSONS: LessonSeed[] = [
  ...buildTrack('A1', 4, [...A1_PART1, ...A1_PART2, ...A1_PART3], GRAMMAR_LIBRARY),
  ...buildTrack('A2', 4, [...A2_PART1, ...A2_PART2, ...A2_PART3], GRAMMAR_LIBRARY),
  ...buildTrack('B1', 6, [...B1_PART1, ...B1_PART2, ...B1_PART3], GRAMMAR_LIBRARY),
];
