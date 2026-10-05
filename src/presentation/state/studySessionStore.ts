import { useSyncExternalStore } from 'react';
import type { StudyActivity } from '@/core/constants/bootcamp';

/**
 * Tiny external store exposing the live study session to any component
 * (session timer in study screens). Persistence is handled by useStudySession.
 */
export interface StudySessionSnapshot {
  /** Identifies the screen currently owning the session (screens may overlap during transitions). */
  owner: symbol | null;
  activity: StudyActivity | null;
  /** Seconds elapsed in the current sitting (UI only). */
  sessionSeconds: number;
}

let snapshot: StudySessionSnapshot = { owner: null, activity: null, sessionSeconds: 0 };
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export const studySessionStore = {
  get: (): StudySessionSnapshot => snapshot,
  set(next: Partial<StudySessionSnapshot>) {
    snapshot = { ...snapshot, ...next };
    emit();
  },
  /** Clears the session only if `owner` still holds it (the next screen may already have taken over). */
  release(owner: symbol) {
    if (snapshot.owner !== owner) return;
    snapshot = { owner: null, activity: null, sessionSeconds: 0 };
    emit();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function useStudySessionSnapshot(): StudySessionSnapshot {
  return useSyncExternalStore(studySessionStore.subscribe, studySessionStore.get, studySessionStore.get);
}
