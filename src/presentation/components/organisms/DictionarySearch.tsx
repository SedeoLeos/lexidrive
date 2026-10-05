import { ActivityIndicator, Pressable, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import type { DictionaryEntry } from '@/domain/entities';
import { useDictionarySearch } from '../../hooks/useDictionarySearch';
import { AppText, Icon } from '../atoms';
import { SearchField, SpeakerButton } from '../molecules';

export interface DictionarySearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSelect: (entry: DictionaryEntry) => void;
  autoFocus?: boolean;
}

/** Search box + ranked results; searches English headwords and French translations offline. */
export function DictionarySearch({ query, onQueryChange, onSelect, autoFocus }: DictionarySearchProps) {
  const { results, searching } = useDictionarySearch(query);
  const hasQuery = query.trim().length >= 2;

  return (
    <View className="gap-5">
      <SearchField
        value={query}
        onChangeText={onQueryChange}
        onClear={() => onQueryChange('')}
        placeholder="Un mot en anglais ou en français…"
        autoFocus={autoFocus}
        accessibilityLabel="Rechercher dans le dictionnaire"
      />

      {searching ? <ActivityIndicator color={colors.brand} /> : null}

      {hasQuery && !searching && results.length === 0 ? (
        <AppText variant="caption" tone="muted" className="px-2">
          Aucun résultat pour « {query.trim()} ». Essaie la forme de base (ex. « payer » plutôt que « payé »).
        </AppText>
      ) : null}

      {results.length > 0 ? (
        <View className="gap-2">
          {results.map((entry) => (
            <Pressable
              key={entry.id}
              accessibilityRole="button"
              onPress={() => onSelect(entry)}
              className="flex-row items-center gap-4 rounded-3xl px-4 py-4 active:bg-surface"
            >
              <View className="flex-1 gap-0.5">
                <AppText variant="subheading">{entry.word}</AppText>
                <AppText variant="caption" tone="muted" numberOfLines={1}>
                  {entry.translation}
                </AppText>
              </View>
              {entry.category === 'pillar' ? <Icon name="alert-triangle" size={14} color={colors.brandSoft} /> : null}
              <SpeakerButton text={entry.word} speechKey={`r:${entry.id}`} tone="plain" />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
