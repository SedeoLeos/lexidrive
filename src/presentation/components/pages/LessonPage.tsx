import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import type { StudyActivity } from '@/core/constants/bootcamp';
import { LessonLockedError } from '@/domain/usecases';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { useStudySession } from '../../hooks/useStudySession';
import { AppText, Button, Pill, Surface } from '../atoms';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PhraseRow,
  SegmentedControl,
  SpeakerButton,
  VocabularyRow,
} from '../molecules';
import { FocusTemplate } from '../templates';

type Section = 'vocabulary' | 'grammar' | 'phrases';

const SECTIONS = [
  { value: 'vocabulary', label: 'Vocabulaire' },
  { value: 'grammar', label: 'Grammaire' },
  { value: 'phrases', label: 'Phrases' },
] as const;

/** Each tab of the lesson credits a different Bootcamp module. */
const SECTION_ACTIVITY: Record<Section, StudyActivity> = {
  vocabulary: 'vocabulary',
  grammar: 'grammar',
  phrases: 'pronunciation',
};

/** Lesson sheet: 20 words, the grammar shortcut, key phrases — then the quiz bank. */
export function LessonPage({ id }: { id: string }) {
  const router = useRouter();
  const { getLesson } = useUseCases();
  const [section, setSection] = useState<Section>('vocabulary');
  const { data: lesson, error, loading, reload } = useAsync(() => getLesson.execute(id), [getLesson, id]);
  useStudySession(SECTION_ACTIVITY[section]);

  if (loading)
    return (
      <FocusTemplate>
        <LoadingState />
      </FocusTemplate>
    );
  if (error instanceof LessonLockedError) {
    return (
      <FocusTemplate showSession={false}>
        <EmptyState
          icon="lock"
          title="Leçon verrouillée"
          message={error.message}
          actionLabel="Retour"
          onAction={() => router.back()}
        />
      </FocusTemplate>
    );
  }
  if (error)
    return (
      <FocusTemplate>
        <ErrorState error={error} onRetry={reload} />
      </FocusTemplate>
    );
  if (!lesson)
    return (
      <FocusTemplate>
        <EmptyState title="Leçon introuvable" />
      </FocusTemplate>
    );

  return (
    <FocusTemplate title={`${lesson.level} · Leçon ${lesson.order}`}>
      <View className="gap-4">
        <AppText variant="title">{lesson.title}</AppText>
        <AppText variant="body" tone="muted">
          {lesson.theme}
        </AppText>
      </View>

      <SegmentedControl segments={SECTIONS} value={section} onChange={setSection} />

      {section === 'vocabulary' ? (
        <View>
          <AppText variant="overline" tone="muted" className="mb-2">
            Les 20 mots indispensables du jour
          </AppText>
          {lesson.vocabulary.map((item, i) => (
            <VocabularyRow key={item.english} item={item} index={i} />
          ))}
        </View>
      ) : null}

      {section === 'grammar' ? (
        <View className="gap-8">
          <View className="gap-4">
            <AppText variant="overline" tone="muted">
              L'astuce du jour
            </AppText>
            <AppText variant="heading" className="text-2xl leading-9">
              {lesson.grammarTip.title}
            </AppText>
            <AppText variant="body" tone="soft">
              {lesson.grammarTip.explanation}
            </AppText>
          </View>
          <Surface tone="brand" className="gap-2">
            <Pill label="Raccourci" tone="solid" />
            <AppText variant="bodyStrong" className="pt-2">
              {lesson.grammarTip.shortcut}
            </AppText>
          </Surface>
          <View className="gap-3">
            <AppText variant="overline" tone="muted">
              Exemples
            </AppText>
            {lesson.grammarTip.examples.map((ex) => (
              <View key={ex} className="flex-row items-center gap-3 rounded-3xl bg-surface px-5 py-4">
                <AppText variant="body" className="flex-1">
                  {ex}
                </AppText>
                <SpeakerButton text={ex} tone="plain" />
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {section === 'phrases' ? (
        <View className="gap-4">
          <AppText variant="overline" tone="muted">
            5 phrases prêtes à l'emploi — écoute, puis répète à voix haute
          </AppText>
          {lesson.keyPhrases.map((ph) => (
            <PhraseRow key={ph.english} english={ph.english} french={ph.french} />
          ))}
        </View>
      ) : null}

      <View className="gap-4 pt-4">
        <Button
          label={`Lancer les ${lesson.quizzes.length} quiz`}
          icon="zap"
          fullWidth
          onPress={() => router.push(`/quiz/${lesson.id}`)}
        />
        <Button
          label="Écrire dans mon journal"
          variant="secondary"
          icon="feather"
          fullWidth
          onPress={() => router.push(`/journal?lesson=${lesson.id}`)}
        />
      </View>
    </FocusTemplate>
  );
}
