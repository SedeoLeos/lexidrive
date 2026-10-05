import type { IconName } from './icons';

export type DailyStepId = 'review' | 'lesson' | 'listening' | 'journal';

/** One step of the guided "Parcours du jour". */
export interface DailyStep {
  id: DailyStepId;
  title: string;
  subtitle: string;
  icon: IconName;
  /** Rough duration shown to keep things light ("≈ 5 min"). */
  minutes: number;
  done: boolean;
  /** Route to open (expo-router href). */
  href: string;
}

export interface DailyPath {
  steps: DailyStep[];
  completed: number;
  /** First step not yet done today, or null when the path is complete. */
  next: DailyStep | null;
}
