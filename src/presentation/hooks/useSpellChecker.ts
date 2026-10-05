import { useEffect, useState } from 'react';
import { useDependencies } from '../di/DependenciesProvider';
import { useSettings } from '../state/SettingsProvider';

let dictionaryMerged = false;

/**
 * Loads the offline lexicon (lazily), merges every dictionary headword and the learner's
 * custom words, and exposes the spell checker once ready.
 */
export function useSpellChecker() {
  const { services, repositories } = useDependencies();
  const { settings } = useSettings();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      await services.spellChecker.ready();
      if (!dictionaryMerged) {
        services.spellChecker.addWords(await repositories.dictionary.getAllHeadwordTokens());
        dictionaryMerged = true;
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, [services, repositories]);

  useEffect(() => {
    services.spellChecker.addWords(settings.customWords);
  }, [services, settings.customWords]);

  return { ready, checker: services.spellChecker };
}
