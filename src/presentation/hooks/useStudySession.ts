import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { STUDY_HEARTBEAT_MS, type StudyActivity } from '@/core/constants/bootcamp';
import { useUseCases } from '../di/DependenciesProvider';
import { studySessionStore } from '../state/studySessionStore';

/**
 * Tracks real study time for the 7-hour daily gauge.
 *
 * - Counts only while the screen is focused AND the app is in the foreground.
 * - Flushes elapsed time to SQLite every STUDY_HEARTBEAT_MS, on blur, on background and when
 *   the activity changes — so closing/killing the app loses at most one heartbeat.
 * - Time is split per local day (midnight-safe) by RecordStudyTimeUseCase.
 */
export function useStudySession(activity: StudyActivity): void {
  const { recordStudyTime } = useUseCases();
  const lastTick = useRef<number | null>(null);
  const sessionStart = useRef<number | null>(null);
  const activityRef = useRef(activity);
  const focused = useRef(false);
  const owner = useRef(Symbol('study-session')).current;

  const flush = useCallback(async () => {
    const from = lastTick.current;
    if (from === null) return;
    const now = Date.now();
    lastTick.current = now;
    try {
      await recordStudyTime.execute(activityRef.current, from, now);
    } catch {
      // A failed write must never break the study screen; the next heartbeat retries from `now`.
    }
  }, [recordStudyTime]);

  const start = useCallback(() => {
    if (lastTick.current !== null) return;
    const now = Date.now();
    lastTick.current = now;
    sessionStart.current = sessionStart.current ?? now;
    studySessionStore.set({ owner, activity: activityRef.current, sessionSeconds: 0 });
  }, [owner]);

  const pause = useCallback(async () => {
    await flush();
    lastTick.current = null;
  }, [flush]);

  // Activity switch inside the same screen (e.g. lesson tabs): credit the previous one first.
  // flush() reads activityRef synchronously before its first await, so the elapsed time is
  // credited to the previous activity even though the ref is updated right after.
  useEffect(() => {
    if (activityRef.current === activity) return;
    void flush();
    activityRef.current = activity;
    if (lastTick.current !== null && studySessionStore.get().owner === owner) studySessionStore.set({ activity });
  }, [activity, flush, owner]);

  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      if (AppState.currentState === 'active') start();

      const heartbeat = setInterval(() => void flush(), STUDY_HEARTBEAT_MS);
      const uiTimer = setInterval(() => {
        if (lastTick.current !== null && sessionStart.current !== null && studySessionStore.get().owner === owner) {
          studySessionStore.set({ sessionSeconds: Math.floor((Date.now() - sessionStart.current) / 1000) });
        }
      }, 1000);

      const onAppState = (state: AppStateStatus) => {
        if (state === 'active') {
          if (focused.current) start();
        } else {
          void pause();
        }
      };
      const sub = AppState.addEventListener('change', onAppState);

      return () => {
        focused.current = false;
        clearInterval(heartbeat);
        clearInterval(uiTimer);
        sub.remove();
        void pause();
        sessionStart.current = null;
        studySessionStore.release(owner);
      };
    }, [flush, owner, pause, start]),
  );
}
