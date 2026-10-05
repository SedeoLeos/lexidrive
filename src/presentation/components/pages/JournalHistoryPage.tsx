import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import type { JournalEntry } from '@/domain/entities';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { AppText, Button } from '../atoms';
import { EmptyState, ErrorState, LoadingState, StatBlock } from '../molecules';
import { JournalEntryCard } from '../organisms';
import { FocusTemplate } from '../templates';

const PAGE = 20;

/** The debate vault: every past production, newest first, to re-read and measure progress. */
export function JournalHistoryPage() {
  const router = useRouter();
  const { getJournalHistory } = useUseCases();
  const [extra, setExtra] = useState<JournalEntry[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const { data, error, loading, reload } = useAsync(
    async () => {
      setExtra([]);
      return getJournalHistory.execute(PAGE, 0);
    },
    [getJournalHistory],
    { refreshOnFocus: true },
  );

  if (loading && !data)
    return (
      <FocusTemplate showSession={false}>
        <LoadingState />
      </FocusTemplate>
    );
  if (error || !data)
    return (
      <FocusTemplate showSession={false}>
        <ErrorState error={error ?? new Error('Historique indisponible')} onRetry={reload} />
      </FocusTemplate>
    );

  const entries = [...data.entries, ...extra];
  const totalWords = entries.reduce((s, e) => s + e.wordCount, 0);

  const loadMore = async () => {
    setLoadingMore(true);
    const next = await getJournalHistory.execute(PAGE, entries.length);
    setExtra((prev) => [...prev, ...next.entries]);
    setLoadingMore(false);
  };

  return (
    <FocusTemplate title="Coffre-fort des débats" showSession={false}>
      <View className="gap-2">
        <AppText variant="title">Tes écrits</AppText>
        <AppText variant="body" tone="muted">
          Relis tes anciennes journées, complète-les et mesure tes progrès.
        </AppText>
      </View>
      <View className="flex-row gap-10">
        <StatBlock value={String(data.total)} label="textes" />
        <StatBlock value={String(totalWords)} label="mots écrits en anglais" />
      </View>
      {entries.length === 0 ? (
        <EmptyState
          icon="archive"
          title="Le coffre-fort est vide"
          message="Ton premier texte t'attend dans l'onglet Journal."
          actionLabel="Écrire"
          onAction={() => router.replace('/journal')}
        />
      ) : (
        <View className="gap-4">
          {entries.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} onPress={() => router.push(`/journal/${entry.id}`)} />
          ))}
        </View>
      )}
      {entries.length < data.total ? (
        <Button
          label="Afficher plus"
          variant="secondary"
          fullWidth
          loading={loadingMore}
          onPress={() => void loadMore()}
        />
      ) : null}
    </FocusTemplate>
  );
}
