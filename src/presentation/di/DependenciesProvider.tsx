import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { createContainer, type Container } from './container';

const DependenciesContext = createContext<Container | null>(null);

/** Builds the dependency container once the SQLite database is open and migrated. */
export function DependenciesProvider({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const container = useMemo(() => createContainer(db), [db]);
  return <DependenciesContext.Provider value={container}>{children}</DependenciesContext.Provider>;
}

export function useDependencies(): Container {
  const value = useContext(DependenciesContext);
  if (!value) throw new Error('useDependencies must be used inside <DependenciesProvider>.');
  return value;
}

export function useUseCases(): Container['useCases'] {
  return useDependencies().useCases;
}
