import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { formatLongFrenchDate } from '@/core/utils/date';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { AppText, Surface } from '../atoms';
import { ErrorState, LoadingState, QuickActionTile, SectionHeader, StatBlock, XpBadge } from '../molecules';
import { DailyGauge, DailyPathCard, LevelHero, WordOfTheDayCard } from '../organisms';
import { ScreenTemplate } from '../templates';

function greeting(date: Date): string {
  const h = date.getHours();
  if (h < 5) return 'Bonne nuit.';
  if (h < 18) return 'Bonjour.';
  return 'Bonsoir.';
}

/**
 * Home: experience level, the guided daily path (one obvious next step), word of the day,
 * unlocked CEFR level, the fractionable 7-hour gauge and quick access to every module.
 */
export function DashboardPage() {
  const router = useRouter();
  const { getDashboard, getDailyPath, getMotivationOverview, getWordOfTheDay } = useUseCases();
  const { data, error, loading, reload } = useAsync(
    async () => {
      const [dashboard, path, motivation, word] = await Promise.all([
        getDashboard.execute(),
        getDailyPath.execute(),
        getMotivationOverview.execute(),
        getWordOfTheDay.execute(),
      ]);
      return { ...dashboard, path, motivation, word };
    },
    [getDashboard, getDailyPath, getMotivationOverview, getWordOfTheDay],
    { refreshOnFocus: true },
  );
  const now = new Date();

  const header = (
    <View className="gap-2">
      <AppText variant="overline" tone="muted">
        {formatLongFrenchDate(now)}
      </AppText>
      <AppText variant="display" className="text-5xl leading-[56px]">
        {greeting(now)}
      </AppText>
    </View>
  );

  if (loading && !data)
    return (
      <ScreenTemplate header={header}>
        <LoadingState />
      </ScreenTemplate>
    );
  if (error || !data)
    return (
      <ScreenTemplate header={header}>
        <ErrorState error={error ?? new Error('Données indisponibles')} onRetry={reload} />
      </ScreenTemplate>
    );

  const { exam, nextLesson, streak } = data;
  const examCaption = !exam.exam
    ? ''
    : exam.prepared
      ? `Leçons validées, tu es prêt · ${exam.questionCount} questions`
      : `Déjà ce niveau ? Teste-toi directement · ${exam.questionCount} questions`;

  return (
    <ScreenTemplate header={header}>
      <XpBadge xp={data.motivation.xp} />

      <DailyPathCard path={data.path} onOpen={(href) => router.push(href as never)} />

      {data.word ? <WordOfTheDayCard entry={data.word} onPress={() => router.push('/dictionary')} /> : null}

      <LevelHero
        level={data.level}
        meta={data.levelMeta}
        lessonsCompleted={data.lessonsCompleted}
        lessonsTotal={data.lessonsTotal}
        examReady={exam.prepared}
        isFinal={data.nextLevel === null}
      />

      <Surface tone="white" className="px-6 py-7">
        <DailyGauge goal={data.goal} modules={data.modules} />
      </Surface>

      <View className="flex-row gap-10 px-1">
        <StatBlock value={String(streak.current)} label={streak.current > 1 ? 'jours d’affilée' : 'jour d’affilée'} />
        <StatBlock value={String(streak.longest)} label="meilleure série" />
        <StatBlock value={streak.todayCounted ? '✓' : '—'} label="aujourd’hui" />
      </View>

      <View className="gap-4">
        <SectionHeader overline="Accès rapide" title="Reprendre là où tu t'es arrêté" />
        {nextLesson ? (
          <QuickActionTile
            icon="play"
            label={nextLesson.completed ? 'Réviser la leçon' : 'Continuer la leçon'}
            caption={`${nextLesson.level} · ${nextLesson.title}`}
            onPress={() => router.push(`/lesson/${nextLesson.id}`)}
          />
        ) : null}
        {nextLesson ? (
          <QuickActionTile
            icon="zap"
            label="Quiz intensifs"
            caption={`${nextLesson.quizCount} questions de mémorisation active`}
            onPress={() => router.push(`/quiz/${nextLesson.id}`)}
          />
        ) : null}
        <QuickActionTile
          icon="layers"
          label="Révisions"
          caption="Cartes mémoire à répétition espacée"
          onPress={() => router.push('/review')}
        />
        <QuickActionTile
          icon="headphones"
          label="Écoute active"
          caption="Entendre, comprendre, écrire sous la dictée"
          onPress={() => router.push('/listening')}
        />
        <QuickActionTile
          icon="feather"
          label="Journal & Débat"
          caption="La consigne du jour t'attend"
          onPress={() => router.push('/journal')}
        />
        <QuickActionTile
          icon="search"
          label="Dictionnaire"
          caption="Chercher, écouter, retenir"
          onPress={() => router.push('/dictionary')}
        />
        {exam.exam ? (
          <QuickActionTile
            icon="award"
            label={exam.exam.title}
            caption={examCaption}
            onPress={() => exam.exam && router.push(`/exam/${exam.exam.id}`)}
          />
        ) : null}
      </View>
    </ScreenTemplate>
  );
}
