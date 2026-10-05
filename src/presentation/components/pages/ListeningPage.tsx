import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { scoreMessage } from '@/core/constants/encouragement';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { useStudySession } from '../../hooks/useStudySession';
import { useRewards } from '../../state/RewardProvider';
import { AppText, Button, Surface } from '../atoms';
import { EmptyState, ErrorState, LoadingState } from '../molecules';
import { ListeningRunner } from '../organisms';
import { FocusTemplate } from '../templates';

/** "Écoute active": ears first, text later — about five minutes of real immersion. */
export function ListeningPage({ lessonId }: { lessonId?: string }) {
  const router = useRouter();
  const { getListeningSession, finishListening } = useUseCases();
  const { celebrate } = useRewards();
  const [attempt, setAttempt] = useState(() => Date.now() % 1_000_000);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);
  const [started, setStarted] = useState(false);
  const {
    data: session,
    error,
    loading,
    reload,
  } = useAsync(() => getListeningSession.execute(lessonId, attempt), [getListeningSession, lessonId, attempt]);
  useStudySession('pronunciation');

  if (loading)
    return (
      <FocusTemplate closeIcon="x">
        <LoadingState />
      </FocusTemplate>
    );
  if (error)
    return (
      <FocusTemplate closeIcon="x">
        <ErrorState error={error} onRetry={reload} />
      </FocusTemplate>
    );
  if (!session)
    return (
      <FocusTemplate closeIcon="x">
        <EmptyState icon="headphones" title="Aucune leçon disponible" />
      </FocusTemplate>
    );

  if (score) {
    return (
      <FocusTemplate title="Écoute active" closeIcon="x">
        <View className="items-center gap-3 pt-8">
          <AppText variant="overline" tone="muted">
            {session.lessonTitle}
          </AppText>
          <AppText variant="display" tone="brand" className="text-[88px] leading-[92px]">
            {score.correct}
            <AppText variant="title" tone="faint">
              {' '}
              / {score.total}
            </AppText>
          </AppText>
          <AppText variant="body" tone="soft" className="text-center">
            {scoreMessage(score.correct / score.total)}
          </AppText>
        </View>
        <View className="gap-3">
          <Button
            label="Nouvelle écoute"
            icon="headphones"
            fullWidth
            onPress={() => {
              setScore(null);
              setAttempt((a) => a + 1);
            }}
          />
          <Button label="Retour à l'accueil" variant="ghost" fullWidth onPress={() => router.dismissTo('/')} />
        </View>
      </FocusTemplate>
    );
  }

  if (!started) {
    return (
      <FocusTemplate title="Écoute active" closeIcon="x">
        <View className="gap-4 pt-4">
          <AppText variant="overline" tone="muted">
            {session.lessonTitle}
          </AppText>
          <AppText variant="title">Tes oreilles d’abord.</AppText>
          <AppText variant="body" tone="soft">
            Tu vas entendre des mots et des phrases sans les voir. Choisis leur sens, puis écris quelques phrases sous
            la dictée. Pas de stress : tu peux réécouter autant de fois que tu veux, même lentement.
          </AppText>
        </View>
        <Surface className="gap-2">
          <AppText variant="subheading">Conseil d’immersion</AppText>
          <AppText variant="caption" tone="soft">
            Mets des écouteurs, ferme les yeux à la première écoute et répète chaque phrase à voix haute.
          </AppText>
        </Surface>
        <Button label="Commencer l'écoute" icon="headphones" fullWidth onPress={() => setStarted(true)} />
      </FocusTemplate>
    );
  }

  return (
    <FocusTemplate title={`Écoute active · ${session.lessonTitle}`} closeIcon="x">
      <ListeningRunner
        key={attempt}
        items={session.items}
        onFinish={async (correct, total) => {
          setScore({ correct, total });
          celebrate(await finishListening.execute(session.lessonId, correct, total));
        }}
      />
    </FocusTemplate>
  );
}
