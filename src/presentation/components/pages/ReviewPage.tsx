import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { scoreMessage } from '@/core/constants/encouragement';
import type { Flashcard } from '@/domain/entities';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { useStudySession } from '../../hooks/useStudySession';
import { useRewards } from '../../state/RewardProvider';
import { useSettings } from '../../state/SettingsProvider';
import { AppText, Button, ProgressBar } from '../atoms';
import { EmptyState, ErrorState, LoadingState, StatBlock } from '../molecules';
import { FlashcardView } from '../organisms';
import { FocusTemplate } from '../templates';

/**
 * Spaced-repetition review: recall → reveal → be honest. Known cards come back later and
 * later; forgotten ones come back today. Five quiet minutes that anchor vocabulary for good.
 */
export function ReviewPage() {
  const router = useRouter();
  const { getReviewSession, reviewFlashcard, finishReviewSession, getDailyPath } = useUseCases();
  const { settings } = useSettings();
  const { celebrate } = useRewards();
  const { data, error, loading, reload } = useAsync(() => getReviewSession.execute(20), [getReviewSession]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [known, setKnown] = useState(0);
  /** Session queue: due cards, plus forgotten ones appended once for a second chance. */
  const [queue, setQueue] = useState<Flashcard[]>([]);
  const [finished, setFinished] = useState(false);
  useStudySession('vocabulary');

  useEffect(() => {
    if (!data) return;
    setQueue(data.cards);
    setIndex(0);
    setKnown(0);
    setFinished(false);
  }, [data]);

  if (loading)
    return (
      <FocusTemplate closeIcon="x">
        <LoadingState />
      </FocusTemplate>
    );
  if (error || !data)
    return (
      <FocusTemplate closeIcon="x">
        <ErrorState error={error ?? new Error('Révisions indisponibles')} onRetry={reload} />
      </FocusTemplate>
    );

  if (data.cards.length === 0) {
    return (
      <FocusTemplate title="Révisions" closeIcon="x" showSession={false}>
        <EmptyState
          icon="layers"
          title={data.deckSize === 0 ? 'Ton paquet de cartes est vide' : 'Rien à réviser aujourd’hui'}
          message={
            data.deckSize === 0
              ? 'Chaque leçon que tu ouvres ajoute ses 20 mots à tes cartes mémoire.'
              : 'Tes mots sont bien ancrés. Reviens demain, ou apprends de nouveaux mots.'
          }
          actionLabel="Ouvrir ma leçon du jour"
          onAction={async () => {
            const path = await getDailyPath.execute();
            const lesson = path.steps.find((s) => s.id === 'lesson');
            router.replace(lesson?.href ?? '/courses');
          }}
        />
      </FocusTemplate>
    );
  }

  const reviewedUnique = data.cards.length;

  if (finished) {
    const ratio = reviewedUnique === 0 ? 0 : known / reviewedUnique;
    return (
      <FocusTemplate title="Révisions" closeIcon="x">
        <View className="items-center gap-3 pt-8">
          <AppText variant="overline" tone="muted">
            Session terminée
          </AppText>
          <AppText variant="display" tone="brand" className="text-[88px] leading-[92px]">
            {known}
            <AppText variant="title" tone="faint">
              {' '}
              / {reviewedUnique}
            </AppText>
          </AppText>
          <AppText variant="body" tone="soft" className="text-center">
            {scoreMessage(ratio)}
          </AppText>
        </View>
        <View className="flex-row justify-center gap-12">
          <StatBlock value={String(known)} label="mots su du premier coup" />
          <StatBlock value={String(Math.max(0, data.dueTotal - reviewedUnique))} label="encore à revoir" />
        </View>
        <View className="gap-3">
          {data.dueTotal > reviewedUnique ? (
            <Button label="Encore une série" icon="rotate-ccw" fullWidth onPress={() => void reload()} />
          ) : null}
          <Button label="Retour à l'accueil" variant="ghost" fullWidth onPress={() => router.dismissTo('/')} />
        </View>
      </FocusTemplate>
    );
  }

  const card = queue[index];
  if (!card)
    return (
      <FocusTemplate closeIcon="x">
        <LoadingState />
      </FocusTemplate>
    );
  const isRetry = index >= reviewedUnique;

  const answer = async (knew: boolean) => {
    await reviewFlashcard.execute(card, knew);
    const nextKnown = known + (knew && !isRetry ? 1 : 0);
    const nextQueue = !knew && !isRetry ? [...queue, card] : queue;
    setKnown(nextKnown);
    setQueue(nextQueue);
    setRevealed(false);
    if (index + 1 >= nextQueue.length) {
      setFinished(true);
      celebrate(await finishReviewSession.execute(nextKnown, reviewedUnique));
      return;
    }
    setIndex(index + 1);
  };

  return (
    <FocusTemplate title={isRetry ? 'Révisions · seconde chance' : 'Révisions'} closeIcon="x">
      <View className="gap-2">
        <ProgressBar value={index / Math.max(1, queue.length)} thickness="hairline" />
        <AppText variant="caption" tone="faint">
          Carte {index + 1} sur {queue.length}
          {data.dueTotal > data.cards.length ? ` · ${data.dueTotal} dues au total` : ''}
        </AppText>
      </View>

      <FlashcardView
        card={card}
        revealed={revealed}
        onReveal={() => setRevealed(true)}
        autoPlay={settings.immersionMode}
      />

      {revealed ? (
        <View className="flex-row gap-3">
          <Button
            label="À revoir"
            variant="secondary"
            icon="rotate-ccw"
            onPress={() => void answer(false)}
            className="flex-1"
          />
          <Button label="Je savais" icon="check" onPress={() => void answer(true)} className="flex-1" />
        </View>
      ) : (
        <Button label="Voir la réponse" variant="secondary" fullWidth onPress={() => setRevealed(true)} />
      )}
    </FocusTemplate>
  );
}
