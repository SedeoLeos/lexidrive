import {
  BOOTCAMP_MODULES,
  MAX_HEARTBEAT_DELTA_SECONDS,
  STUDY_ACTIVITIES,
  type StudyActivity,
} from '@/core/constants/bootcamp';
import { toLocalDateKey } from '@/core/utils/date';
import type { ActivityBreakdown } from '../entities';

export function emptyBreakdown(): ActivityBreakdown {
  return STUDY_ACTIVITIES.reduce((acc, a) => {
    acc[a] = 0;
    return acc;
  }, {} as ActivityBreakdown);
}

/**
 * Converts the wall-clock time elapsed since the last heartbeat into creditable study seconds.
 * Negative (clock moved back) → 0; huge gaps (frozen JS thread, device sleep) → capped.
 */
export function creditableSeconds(lastTickMs: number, nowMs: number): number {
  const delta = Math.floor((nowMs - lastTickMs) / 1000);
  if (!Number.isFinite(delta) || delta <= 0) return 0;
  return Math.min(delta, MAX_HEARTBEAT_DELTA_SECONDS);
}

export interface StudySlice {
  dateKey: string;
  seconds: number;
}

/**
 * Splits the interval [fromMs, toMs] into per-local-day slices, so a sitting that spans
 * midnight credits each day with its own share. The total is capped by `creditableSeconds`.
 */
export function splitByLocalDay(fromMs: number, toMs: number): StudySlice[] {
  const total = creditableSeconds(fromMs, toMs);
  if (total === 0) return [];

  const start = toMs - total * 1000;
  const slices: StudySlice[] = [];
  let cursor = start;
  while (cursor < toMs) {
    const d = new Date(cursor);
    const nextMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
    const end = Math.min(nextMidnight, toMs);
    const seconds = Math.round((end - cursor) / 1000);
    if (seconds > 0) slices.push({ dateKey: toLocalDateKey(d), seconds });
    cursor = end;
  }
  return slices;
}

export interface GoalProgress {
  totalSeconds: number;
  goalSeconds: number;
  /** Clamped to [0, 1]. */
  ratio: number;
  remainingSeconds: number;
  /** Whole hours completed out of the daily goal (for the 7-segment gauge). */
  hoursCompleted: number;
}

export function computeGoalProgress(totalSeconds: number, goalMinutes: number): GoalProgress {
  const goalSeconds = Math.max(60, goalMinutes * 60);
  const safeTotal = Math.max(0, totalSeconds);
  return {
    totalSeconds: safeTotal,
    goalSeconds,
    ratio: Math.min(1, safeTotal / goalSeconds),
    remainingSeconds: Math.max(0, goalSeconds - safeTotal),
    hoursCompleted: Math.floor(Math.min(safeTotal, goalSeconds) / 3600),
  };
}

export interface ModuleProgress {
  activity: StudyActivity;
  label: string;
  seconds: number;
  targetSeconds: number;
  ratio: number;
}

export function computeModuleProgress(breakdown: ActivityBreakdown): ModuleProgress[] {
  return BOOTCAMP_MODULES.map((m) => {
    const seconds = breakdown[m.activity] ?? 0;
    const targetSeconds = m.targetMinutes * 60;
    return {
      activity: m.activity,
      label: m.label,
      seconds,
      targetSeconds,
      ratio: Math.min(1, seconds / targetSeconds),
    };
  });
}
