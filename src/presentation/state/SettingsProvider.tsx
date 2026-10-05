import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, type AppSettings } from '@/domain/entities';
import { useUseCases } from '../di/DependenciesProvider';

interface SettingsContextValue {
  settings: AppSettings;
  loaded: boolean;
  /** Persists a patch; rejects with a user-facing error (e.g. notification permission denied). */
  update: (patch: Partial<AppSettings>) => Promise<void>;
  addCustomWord: (word: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { getSettings, updateSettings, addCustomWord: addWordUseCase } = useUseCases();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    getSettings.execute().then((s) => {
      if (alive) {
        setSettings(s);
        setLoaded(true);
      }
    });
    return () => {
      alive = false;
    };
  }, [getSettings]);

  const update = useCallback(
    async (patch: Partial<AppSettings>) => {
      setSettings((prev) => ({ ...prev, ...patch }));
      try {
        setSettings(await updateSettings.execute(patch));
      } catch (error) {
        setSettings(await getSettings.execute());
        throw error;
      }
    },
    [getSettings, updateSettings],
  );

  const addCustomWord = useCallback(
    async (word: string) => {
      setSettings(await addWordUseCase.execute(word));
    },
    [addWordUseCase],
  );

  const value = useMemo(() => ({ settings, loaded, update, addCustomWord }), [settings, loaded, update, addCustomWord]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext);
  if (!value) throw new Error('useSettings must be used inside <SettingsProvider>.');
  return value;
}
