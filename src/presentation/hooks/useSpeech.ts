import { useCallback, useEffect, useState } from 'react';
import { useUseCases } from '../di/DependenciesProvider';

let activeKey: string | null = null;
const listeners = new Set<(key: string | null) => void>();

function setActive(key: string | null) {
  activeKey = key;
  for (const l of listeners) l(key);
}

/**
 * Speaks text with the learner's accent preference. Only one utterance plays at a time;
 * `speakingKey` lets every speaker button know whether it is the one currently reading.
 */
export function useSpeech() {
  const { speakText } = useUseCases();
  const [speakingKey, setSpeakingKey] = useState<string | null>(activeKey);

  useEffect(() => {
    listeners.add(setSpeakingKey);
    return () => {
      listeners.delete(setSpeakingKey);
    };
  }, []);

  const speak = useCallback(
    async (text: string, key: string = text) => {
      if (activeKey === key) {
        await speakText.stop();
        setActive(null);
        return;
      }
      setActive(key);
      await speakText.execute(text, () => {
        if (activeKey === key) setActive(null);
      });
    },
    [speakText],
  );

  const stop = useCallback(async () => {
    await speakText.stop();
    setActive(null);
  }, [speakText]);

  return { speak, stop, speakingKey };
}
