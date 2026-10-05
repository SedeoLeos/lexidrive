import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

export interface AsyncState<T> {
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
  reload: () => Promise<void>;
}

/**
 * Runs an async loader and exposes its state. With `refreshOnFocus`, the loader re-runs each time
 * the screen regains focus (e.g. dashboard after finishing a lesson) without flashing a spinner.
 */
export function useAsync<T>(
  loader: () => Promise<T>,
  deps: readonly unknown[],
  { refreshOnFocus = false }: { refreshOnFocus?: boolean } = {},
): AsyncState<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);
  const hasLoaded = useRef(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps);

  const reload = useCallback(async () => {
    if (!hasLoaded.current) setLoading(true);
    try {
      const result = await run();
      if (!mounted.current) return;
      setData(result);
      setError(undefined);
      hasLoaded.current = true;
    } catch (e) {
      if (mounted.current) setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    mounted.current = true;
    hasLoaded.current = false;
    if (!refreshOnFocus) void reload();
    return () => {
      mounted.current = false;
    };
  }, [reload, refreshOnFocus]);

  useFocusEffect(
    useCallback(() => {
      if (refreshOnFocus) void reload();
    }, [refreshOnFocus, reload]),
  );

  return { data, error, loading, reload };
}
