import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DictionaryEntry } from '@/domain/entities';
import { useUseCases } from '../../di/DependenciesProvider';
import { AppText, IconButton } from '../atoms';
import { DictionaryEntryDetail } from './DictionaryEntryDetail';
import { DictionarySearch } from './DictionarySearch';

export interface DictionaryPopupProps {
  visible: boolean;
  onClose: () => void;
  /** Pre-filled search (e.g. a word tapped in the journal). Opens the entry directly on an exact hit. */
  initialQuery?: string;
}

/**
 * Contextual dictionary sheet available over any writing screen.
 * 100 % local search, pronunciation on every word, example and collocation.
 */
export function DictionaryPopup({ visible, onClose, initialQuery = '' }: DictionaryPopupProps) {
  const insets = useSafeAreaInsets();
  const { lookupWord } = useUseCases();
  const [query, setQuery] = useState(initialQuery);
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);

  useEffect(() => {
    if (!visible) return;
    setQuery(initialQuery);
    setEntry(null);
    if (initialQuery.trim()) {
      let alive = true;
      lookupWord.execute(initialQuery).then((hit) => {
        if (alive && hit && hit.word.toLowerCase() === initialQuery.trim().toLowerCase()) setEntry(hit);
      });
      return () => {
        alive = false;
      };
    }
  }, [visible, initialQuery, lookupWord]);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-canvas">
        <View
          className="flex-row items-center justify-between px-6 pb-2"
          style={{ paddingTop: Platform.OS === 'ios' ? 20 : insets.top + 12 }}
        >
          {entry ? (
            <IconButton icon="arrow-left" label="Retour aux résultats" size="sm" onPress={() => setEntry(null)} />
          ) : (
            <AppText variant="overline" tone="muted">
              Dictionnaire hors ligne
            </AppText>
          )}
          <IconButton icon="x" label="Fermer le dictionnaire" size="sm" onPress={onClose} />
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="px-6 pt-4"
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        >
          {entry ? (
            <DictionaryEntryDetail entry={entry} />
          ) : (
            <DictionarySearch query={query} onQueryChange={setQuery} onSelect={setEntry} autoFocus={!initialQuery} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
