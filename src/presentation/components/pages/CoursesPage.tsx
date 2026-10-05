import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LEVEL_META } from '@/core/constants/levels';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { AppText, Pill } from '../atoms';
import { ErrorState, LoadingState, QuickActionTile } from '../molecules';
import { LessonListItem } from '../organisms';
import { ScreenTemplate } from '../templates';

/** The whole curriculum A1 → C2; levels above the learner's stay locked until the exam is passed. */
export function CoursesPage() {
  const router = useRouter();
  const { getCourseCatalog } = useUseCases();
  const { data, error, loading, reload } = useAsync(() => getCourseCatalog.execute(), [getCourseCatalog], {
    refreshOnFocus: true,
  });

  const header = (
    <View className="gap-2">
      <AppText variant="overline" tone="muted">
        Parcours complet
      </AppText>
      <AppText variant="title">Du Zéro au C2</AppText>
      <AppText variant="body" tone="muted">
        Chaque niveau se débloque en réussissant l'examen de passage du précédent.
      </AppText>
    </View>
  );

  return (
    <ScreenTemplate header={header}>
      {loading && !data ? <LoadingState /> : null}
      {error ? <ErrorState error={error} onRetry={reload} /> : null}
      {data?.map((section) => {
        const meta = LEVEL_META[section.level];
        const done = section.lessons.filter((l) => l.completed).length;
        return (
          <View key={section.level} className="gap-5">
            <View className="flex-row items-end justify-between">
              <View className="gap-1">
                <AppText variant="overline" tone="muted">
                  {meta.stage}
                </AppText>
                <View className="flex-row items-baseline gap-3">
                  <AppText
                    variant="title"
                    tone={section.unlocked ? 'brand' : 'faint'}
                    className="font-thin text-4xl leading-[44px]"
                  >
                    {section.level}
                  </AppText>
                  <AppText variant="heading" tone={section.unlocked ? 'ink' : 'faint'}>
                    {meta.title}
                  </AppText>
                </View>
              </View>
              {section.current ? (
                <Pill label="En cours" tone="solid" />
              ) : section.unlocked ? (
                <Pill label={`${done}/${section.lessons.length}`} />
              ) : (
                <Pill label="Verrouillé" tone="neutral" />
              )}
            </View>
            <View className="gap-3">
              {section.lessons.map((lesson) => (
                <LessonListItem
                  key={lesson.id}
                  lesson={lesson}
                  locked={!section.unlocked}
                  onPress={() => router.push(`/lesson/${lesson.id}`)}
                />
              ))}
            </View>
            {section.current && section.examId ? (
              <QuickActionTile
                icon="award"
                label={`Examen de passage ${section.level} ➔ ${section.nextLevel}`}
                caption="Déjà ce niveau ? Teste-toi sans faire les leçons."
                onPress={() => router.push(`/exam/${section.examId}`)}
              />
            ) : null}
          </View>
        );
      })}
    </ScreenTemplate>
  );
}
