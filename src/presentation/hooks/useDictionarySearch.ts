import { useEffect, useState } from 'react';
import type { DictionaryEntry } from '@/domain/entities';
import { useUseCases } from '../di/DependenciesProvider';

/** Debounced local dictionary search (EN ⇄ FR). */
export function useDictionarySearch(query: string, delayMs = 160) {
  const { searchDictionary } = useUseCases();
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let alive = true;
    if (query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      const found = await searchDictionary.execute(query);
      if (alive) {
        setResults(found);
        setSearching(false);
      }
    }, delayMs);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [query, delayMs, searchDictionary]);

  return { results, searching };
}
