import { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { useRouter } from 'expo-router';
import { toLocalDateKey } from '@/core/utils/date';
import type { JournalPrompt } from '@/domain/entities';
import { EmptyJournalError } from '@/domain/usecases';
import { useRewards } from '../../state/RewardProvider';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { useStudySession } from '../../hooks/useStudySession';
import { AppText, IconButton } from '../atoms';
import { ErrorState, LoadingState, SegmentedControl } from '../molecules';
import { JournalEditor, StudySessionBar, type JournalDraftValue } from '../organisms';
import { ScreenTemplate } from '../templates';

type PromptChoice = 'daily' | 'lesson';

const EMPTY: JournalDraftValue = { frenchText: '', englishText: '' };

function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/**
 * "Journal de Vie & Débat": write about your own life in French, translate it yourself,
 * proofread with the local spell checker, save to the vault. Reopening the same prompt
 * on the same day continues the existing entry.
 */
export function JournalPage({ lessonId }: { lessonId?: string }) {
  const preferLesson = !!lessonId;
  const router = useRouter();
  const { getDailyPrompt, getJournalHistory, saveJournalEntry } = useUseCases();
  const { celebrate } = useRewards();
  const {
    data: prompts,
    error,
    loading,
    reload,
  } = useAsync(() => getDailyPrompt.execute(new Date(), lessonId), [getDailyPrompt, lessonId], {
    refreshOnFocus: true,
  });
  const [choice, setChoice] = useState<PromptChoice>(preferLesson ? 'lesson' : 'daily');
  const [draft, setDraft] = useState<JournalDraftValue>(EMPTY);
  const [entryId, setEntryId] = useState<number | undefined>();
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  useStudySession('journal');

  useEffect(() => {
    if (preferLesson) setChoice('lesson');
  }, [preferLesson]);

  const prompt: JournalPrompt | null = prompts
    ? choice === 'lesson' && prompts.lessonPrompt
      ? prompts.lessonPrompt
      : prompts.dailyPrompt
    : null;

  // Resume today's entry for this prompt, if any.
  const loadExisting = useCallback(
    async (p: JournalPrompt) => {
      const today = toLocalDateKey();
      const { entries } = await getJournalHistory.execute(20, 0);
      const existing = entries.find((e) => e.dateKey === today && e.prompt === p.text);
      setEntryId(existing?.id);
      setDraft(existing ? { frenchText: existing.frenchText, englishText: existing.englishText } : EMPTY);
      setSavedAt(null);
    },
    [getJournalHistory],
  );

  useEffect(() => {
    if (prompt) void loadExisting(prompt);
    // Only when the selected prompt changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt?.text]);

  const save = async () => {
    if (!prompt) return;
    setSaving(true);
    try {
      const { entry: saved, reward } = await saveJournalEntry.execute({
        id: entryId,
        prompt: prompt.text,
        kind: prompt.kind,
        ...draft,
      });
      setEntryId(saved.id);
      celebrate(reward);
      setSavedAt(formatTime(new Date()));
    } catch (e) {
      Alert.alert('Journal', e instanceof EmptyJournalError ? e.message : "La sauvegarde n'a pas abouti.");
    } finally {
      setSaving(false);
    }
  };

  const header = (
    <View className="gap-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-2">
          <AppText variant="overline" tone="muted">
            Production active
          </AppText>
          <AppText variant="title">Journal de Vie & Débat</AppText>
        </View>
        <IconButton icon="archive" label="Ouvrir le coffre-fort" onPress={() => router.push('/journal/history')} />
      </View>
      <StudySessionBar />
    </View>
  );

  if (loading && !prompts)
    return (
      <ScreenTemplate header={header}>
        <LoadingState />
      </ScreenTemplate>
    );
  if (error || !prompts || !prompt)
    return (
      <ScreenTemplate header={header}>
        <ErrorState error={error ?? new Error('Consigne indisponible')} onRetry={reload} />
      </ScreenTemplate>
    );

  return (
    <ScreenTemplate header={header}>
      {prompts.lessonPrompt ? (
        <SegmentedControl
          segments={[
            { value: 'daily', label: 'Consigne du jour' },
            { value: 'lesson', label: 'Consigne de la leçon' },
          ]}
          value={choice}
          onChange={setChoice}
        />
      ) : null}
      <JournalEditor
        prompt={prompt.text}
        kind={prompt.kind}
        value={draft}
        onChange={(v) => {
          setDraft(v);
          setSavedAt(null);
        }}
        onSave={() => void save()}
        saving={saving}
        savedAt={savedAt}
        speechKey={`journal:${prompt.id}`}
      />
    </ScreenTemplate>
  );
}
