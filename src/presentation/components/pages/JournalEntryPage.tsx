import { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { formatLongFrenchDate, fromLocalDateKey } from '@/core/utils/date';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { useStudySession } from '../../hooks/useStudySession';
import { AppText, IconButton } from '../atoms';
import { EmptyState, ErrorState, LoadingState } from '../molecules';
import { JournalEditor, type JournalDraftValue } from '../organisms';
import { FocusTemplate } from '../templates';

/** Re-open a past entry from the vault to re-read, complete or delete it. */
export function JournalEntryPage({ id }: { id: number }) {
  const router = useRouter();
  const { getJournalEntry, saveJournalEntry, deleteJournalEntry } = useUseCases();
  const { data: entry, error, loading, reload } = useAsync(() => getJournalEntry.execute(id), [getJournalEntry, id]);
  const [draft, setDraft] = useState<JournalDraftValue>({ frenchText: '', englishText: '' });
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  useStudySession('journal');

  useEffect(() => {
    if (entry) setDraft({ frenchText: entry.frenchText, englishText: entry.englishText });
  }, [entry]);

  if (loading)
    return (
      <FocusTemplate>
        <LoadingState />
      </FocusTemplate>
    );
  if (error)
    return (
      <FocusTemplate>
        <ErrorState error={error} onRetry={reload} />
      </FocusTemplate>
    );
  if (!entry)
    return (
      <FocusTemplate>
        <EmptyState title="Texte introuvable" />
      </FocusTemplate>
    );

  const save = async () => {
    setSaving(true);
    try {
      await saveJournalEntry.execute({
        id: entry.id,
        dateKey: entry.dateKey,
        prompt: entry.prompt,
        kind: entry.kind,
        ...draft,
      });
      const now = new Date();
      setSavedAt(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    } catch (e) {
      Alert.alert('Journal', e instanceof Error ? e.message : "La sauvegarde n'a pas abouti.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () =>
    Alert.alert('Supprimer ce texte ?', 'Cette action est définitive.', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteJournalEntry.execute(entry.id);
          router.back();
        },
      },
    ]);

  return (
    <FocusTemplate
      title="Coffre-fort"
      right={<IconButton icon="trash-2" label="Supprimer" size="sm" onPress={confirmDelete} />}
    >
      <View className="gap-1">
        <AppText variant="overline" tone="muted">
          {formatLongFrenchDate(fromLocalDateKey(entry.dateKey))}
        </AppText>
      </View>
      <JournalEditor
        prompt={entry.prompt}
        kind={entry.kind}
        value={draft}
        onChange={(v) => {
          setDraft(v);
          setSavedAt(null);
        }}
        onSave={() => void save()}
        saving={saving}
        savedAt={savedAt}
        speechKey={`j:${entry.id}`}
      />
    </FocusTemplate>
  );
}
