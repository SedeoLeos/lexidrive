import type { Level } from '@/core/constants/levels';
import type { Lesson, LessonSummary } from '../entities';

export interface ICourseRepository {
  getLessonSummaries(level: Level): Promise<LessonSummary[]>;
  getLesson(id: string): Promise<Lesson | null>;
  countLessons(level: Level): Promise<number>;
  /** Returns the first lesson of `level` not yet completed, or the last one if all are done. */
  getNextLesson(level: Level): Promise<LessonSummary | null>;
}
