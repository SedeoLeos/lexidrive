import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LESSON_PASS_RATIO } from '@/core/constants/bootcamp';
import { LessonLockedError, type LessonQuizOutcome } from '@/domain/usecases';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { useStudySession } from '../../hooks/useStudySession';
import { AppText, Button, Surface } from '../atoms';
import { EmptyState, ErrorState, LoadingState } from '../molecules';
import { QuizRunner, type QuizOutcome } from '../organisms';
import { FocusTemplate } from '../templates';

interface Result {
  outcome: LessonQuizOutcome;
  details: QuizOutcome[];
  examUnlocked: boolean;
}

/** The daily quiz bank (20+ items): answer, learn from each explanation, get a score. */
export function QuizPage({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const { getLesson, submitLessonQuiz, getExamEligibility } = useUseCases();
  const { data: lesson, error, loading, reload } = useAsync(() => getLesson.execute(lessonId), [getLesson, lessonId]);
  const [attempt, setAttempt] = useState(() => Date.now() % 100_000);
  const [result, setResult] = useState<Result | null>(null);
  useStudySession('quiz');

  if (loading)
    return (
      <FocusTemplate closeIcon="x">
        <LoadingState />
      </FocusTemplate>
    );
  if (error instanceof LessonLockedError) {
    return (
      <FocusTemplate closeIcon="x" showSession={false}>
        <EmptyState icon="lock" title="Quiz verrouillé" message={error.message} />
      </FocusTemplate>
    );
  }
  if (error)
    return (
      <FocusTemplate closeIcon="x">
        <ErrorState error={error} onRetry={reload} />
      </FocusTemplate>
    );
  if (!lesson)
    return (
      <FocusTemplate closeIcon="x">
        <EmptyState title="Quiz introuvable" />
      </FocusTemplate>
    );
  if (lesson.quizzes.length === 0) {
    return (
      <FocusTemplate closeIcon="x" showSession={false}>
        <EmptyState title="Aucun quiz pour cette leçon" />
      </FocusTemplate>
    );
  }

  const finish = async (details: QuizOutcome[]) => {
    const correct = details.filter((d) => d.correct).length;
    const outcome = await submitLessonQuiz.execute(lesson.id, correct, details.length);
    const exam = await getExamEligibility.execute(lesson.level);
    setResult({ outcome, details, examUnlocked: outcome.completed && exam.eligible && exam.exam !== null });
  };

  if (result) {
    const correct = result.details.filter((d) => d.correct).length;
    const mistakes = result.details.filter((d) => !d.correct);
    return (
      <FocusTemplate title={`${lesson.level} · ${lesson.title}`} closeIcon="x">
        <View className="items-center gap-3 pt-6">
          <AppText variant="overline" tone="muted">
            Ton score
          </AppText>
          <AppText variant="display" tone="brand" className="text-[96px] leading-[100px]">
            {Math.round(result.outcome.ratio * 100)}
            <AppText variant="title" tone="faint">
              {' '}
              %
            </AppText>
          </AppText>
          <AppText variant="body" tone="soft">
            {correct} bonnes réponses sur {result.details.length}
          </AppText>
          <AppText variant="body" tone={result.outcome.completed ? 'success' : 'muted'} className="text-center">
            {result.outcome.completed
              ? 'Leçon validée. Excellent travail.'
              : `Il faut ${Math.round(LESSON_PASS_RATIO * 100)} % pour valider la leçon. Relis les explications et recommence.`}
          </AppText>
        </View>

        {result.examUnlocked ? (
          <Surface tone="brand" className="gap-3">
            <AppText variant="subheading" tone="brand">
              L'examen de passage est ouvert.
            </AppText>
            <AppText variant="caption" tone="soft">
              Toutes les leçons du niveau {lesson.level} sont validées. Tente l'examen quand tu te sens prêt.
            </AppText>
          </Surface>
        ) : null}

        {mistakes.length > 0 ? (
          <View className="gap-4">
            <AppText variant="overline" tone="muted">
              À retenir ({mistakes.length})
            </AppText>
            {mistakes.map((m) => (
              <View key={m.quiz.id} className="gap-2 rounded-3xl bg-surface px-5 py-5">
                <AppText variant="caption" tone="soft">
                  {m.quiz.prompt}
                </AppText>
                <AppText variant="bodyStrong">{m.expected}</AppText>
                <AppText variant="caption" tone="muted">
                  {m.quiz.explanation}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}

        <View className="gap-3">
          <Button
            label="Recommencer"
            icon="rotate-ccw"
            fullWidth
            onPress={() => {
              setResult(null);
              setAttempt((a) => a + 1);
            }}
          />
          <Button
            label="Revoir la leçon"
            variant="secondary"
            fullWidth
            onPress={() => router.replace(`/lesson/${lesson.id}`)}
          />
          <Button label="Retour à l'accueil" variant="ghost" fullWidth onPress={() => router.dismissTo('/')} />
        </View>
      </FocusTemplate>
    );
  }

  return (
    <FocusTemplate title={`${lesson.level} · ${lesson.title}`} closeIcon="x">
      <QuizRunner key={attempt} quizzes={lesson.quizzes} seed={attempt} onFinish={(d) => void finish(d)} />
    </FocusTemplate>
  );
}
