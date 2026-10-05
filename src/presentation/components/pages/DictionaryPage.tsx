import { useState } from 'react';
import { Pressable, View } from 'react-native';
import type { DictionaryCategory, DictionaryEntry } from '@/domain/entities';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { useStudySession } from '../../hooks/useStudySession';
import { AppText, IconButton } from '../atoms';
import { LoadingState, SegmentedControl } from '../molecules';
import { DictionaryEntryDetail, DictionarySearch, StudySessionBar } from '../organisms';
import { ScreenTemplate } from '../templates';

type Browse = Extract<DictionaryCategory, 'pillar' | 'connector' | 'idiom'>;

const BROWSE_SEGMENTS = [
  { value: 'pillar', label: 'Mots piliers' },
  { value: 'connector', label: 'Connecteurs' },
  { value: 'idiom', label: 'Idiomes' },
] as const;

const BROWSE_HINT: Record<Browse, string> = {
  pillar: 'Les mots les plus souvent mal traduits par les francophones.',
  connector: 'Pour structurer un écrit fluide, du B1 au C2.',
  idiom: 'Les expressions qui font sonner ton anglais naturel.',
};

/** Full-screen offline dictionary: search EN ⇄ FR, or browse the curated lists. */
export function DictionaryPage() {
  const { browseDictionary } = useUseCases();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<DictionaryEntry | null>(null);
  const [browse, setBrowse] = useState<Browse>('pillar');
  const { data: list, loading } = useAsync(() => browseDictionary.execute(browse, 200), [browseDictionary, browse]);
  useStudySession('dictionary');

  const header = (
    <View className="gap-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-2">
          <AppText variant="overline" tone="muted">
            100 % hors ligne
          </AppText>
          <AppText variant="title">Lexique</AppText>
        </View>
        {selected ? <IconButton icon="arrow-left" label="Retour" onPress={() => setSelected(null)} /> : null}
      </View>
      <StudySessionBar />
    </View>
  );

  if (selected) {
    return (
      <ScreenTemplate header={header}>
        <DictionaryEntryDetail entry={selected} />
      </ScreenTemplate>
    );
  }

  return (
    <ScreenTemplate header={header}>
      <DictionarySearch query={query} onQueryChange={setQuery} onSelect={setSelected} />

      {query.trim().length < 2 ? (
        <View className="gap-5">
          <SegmentedControl segments={BROWSE_SEGMENTS} value={browse} onChange={setBrowse} />
          <AppText variant="caption" tone="muted" className="px-1">
            {BROWSE_HINT[browse]}
          </AppText>
          {loading && !list ? <LoadingState /> : null}
          <View className="gap-1">
            {list?.map((entry, i) => {
              const showLevel = browse !== 'pillar' && entry.level && entry.level !== list[i - 1]?.level;
              return (
                <View key={entry.id}>
                  {showLevel ? (
                    <AppText variant="overline" tone="brand" className="px-4 pb-2 pt-6">
                      Niveau {entry.level}
                    </AppText>
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setSelected(entry)}
                    className="gap-0.5 rounded-3xl px-4 py-3.5 active:bg-surface"
                  >
                    <AppText variant="subheading">{entry.word}</AppText>
                    <AppText variant="caption" tone="muted" numberOfLines={1}>
                      {entry.translation}
                    </AppText>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}
    </ScreenTemplate>
  );
}
