import { useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Exam, ExamAnswer, ExamResult } from '@/domain/entities';
import { ExamNotAvailableError } from '@/domain/usecases';
import { useUseCases } from '../../di/DependenciesProvider';
import { useAsync } from '../../hooks/useAsync';
import { useStudySession } from '../../hooks/useStudySession';
import { AppText, Button, ProgressBar, Surface } from '../atoms';
import { EmptyState, ErrorState, LoadingState, StatBlock } from '../molecules';
import { ExamQuestionCard } from '../organisms';
import { FocusTemplate } from '../templates';

function isAnswered(answer: ExamAnswer | undefined): boolean {
  if (!answer) return false;
  return answer.kind === 'mcq' ? answer.index !== null : answer.text.trim().length > 0;
}

/**
 * Level-transition exam. Strict: no feedback during the test, 80 % to pass.
 * Passing promotes the learner and opens the congratulation screen.
 */
export function ExamPage({ examId }: { examId: string }) {
  const router = useRouter();
  const { startExam, submitExam } = useUseCases();
  const { data: exam, error, loading, reload } = useAsync(() => startExam.execute(examId), [startExam, examId]);
  const [phase, setPhase] = useState<'intro' | 'running' | 'result'>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ExamAnswer>>({});
  const [result, setResult] = useState<ExamResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  useStudySession('exam');

  if (loading)
    return (
      <FocusTemplate closeIcon="x">
        <LoadingState />
      </FocusTemplate>
    );
  if (error instanceof ExamNotAvailableError) {
    return (
      <FocusTemplate closeIcon="x" showSession={false}>
        <EmptyState
          icon="lock"
          title="Examen non disponible"
          message={error.message}
          actionLabel="Retour"
          onAction={() => router.back()}
        />
      </FocusTemplate>
    );
  }
  if (error || !exam)
    return (
      <FocusTemplate closeIcon="x">
        <ErrorState error={error ?? new Error('Examen introuvable')} onRetry={reload} />
      </FocusTemplate>
    );

  const submit = async (current: Exam) => {
    setSubmitting(true);
    try {
      const { result: graded, promotedTo } = await submitExam.execute(current, answers);
      if (promotedTo) {
        router.replace(`/level-up/${promotedTo}?score=${graded.score}&max=${graded.maxScore}`);
        return;
      }
      setResult(graded);
      setPhase('result');
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    } finally {
      setSubmitting(false);
    }
  };

  const handIn = () => {
    const missing = exam.questions.filter((q) => !isAnswered(answers[q.id])).length;
    if (missing === 0) {
      void submit(exam);
      return;
    }
    Alert.alert('Remettre ta copie ?', `${missing} question(s) sans réponse compteront comme fausses.`, [
      { text: 'Continuer', style: 'cancel' },
      { text: 'Remettre', style: 'destructive', onPress: () => void submit(exam) },
    ]);
  };

  if (phase === 'intro') {
    return (
      <FocusTemplate title="Examen de passage" closeIcon="x">
        <View className="gap-4 pt-4">
          <AppText variant="overline" tone="muted">
            {exam.fromLevel} ➔ {exam.toLevel}
          </AppText>
          <AppText variant="title">{exam.title}</AppText>
          <AppText variant="body" tone="soft">
            {exam.description}
          </AppText>
        </View>
        <View className="flex-row gap-10">
          <StatBlock value={String(exam.questions.length)} label="questions" />
          <StatBlock value={`${Math.round(exam.passRatio * 100)} %`} label="pour réussir" />
          <StatBlock value="0" label="aide pendant l'épreuve" />
        </View>
        <Surface className="gap-2">
          <AppText variant="subheading">Les règles</AppText>
          <AppText variant="caption" tone="soft">
            Accès direct : pas besoin d'avoir suivi les leçons si tu as déjà le niveau. QCM et textes à trous
            orthographiques, avec une partie nombres et maths et, dès B1, de l'anglais technique. Aucune correction
            n'est affichée avant la remise de la copie ; tu peux naviguer entre les questions et modifier tes réponses.
          </AppText>
        </Surface>
        <Button label="Commencer l'examen" icon="arrow-right" fullWidth onPress={() => setPhase('running')} />
      </FocusTemplate>
    );
  }

  if (phase === 'result' && result) {
    return (
      <FocusTemplate title={exam.title} closeIcon="x" scrollRef={scrollRef}>
        <View className="items-center gap-3 pt-6">
          <AppText variant="overline" tone="muted">
            {result.passed ? 'Examen réussi' : 'Pas encore'}
          </AppText>
          <AppText variant="display" tone={result.passed ? 'brand' : 'ink'} className="text-[88px] leading-[92px]">
            {result.score}
            <AppText variant="title" tone="faint">
              {' '}
              / {result.maxScore}
            </AppText>
          </AppText>
          <AppText variant="body" tone="soft" className="text-center">
            {result.passed
              ? 'Tu avais déjà atteint ce niveau : ce résultat est enregistré dans ton historique.'
              : `Il faut ${Math.ceil(exam.passRatio * result.maxScore)} points pour passer en ${exam.toLevel}. Étudie les corrections, puis retente ta chance.`}
          </AppText>
        </View>

        <View className="gap-4">
          <AppText variant="overline" tone="muted">
            Corrigé
          </AppText>
          {exam.questions.map((q, i) => {
            const detail = result.details[i];
            return (
              <View
                key={q.id}
                className={`gap-2 rounded-3xl px-5 py-5 ${detail.correct ? 'bg-surface' : 'bg-danger-mist'}`}
              >
                <AppText variant="caption" tone="muted">
                  {i + 1}. {q.prompt}
                </AppText>
                <AppText variant="bodyStrong" tone={detail.correct ? 'success' : 'ink'}>
                  {detail.expected}
                </AppText>
                <AppText variant="caption" tone="soft">
                  {q.explanation}
                </AppText>
              </View>
            );
          })}
        </View>

        <View className="gap-3">
          <Button
            label="Retenter l'examen"
            icon="rotate-ccw"
            fullWidth
            onPress={() => {
              setAnswers({});
              setIndex(0);
              setResult(null);
              setPhase('intro');
            }}
          />
          <Button label="Retour à l'accueil" variant="ghost" fullWidth onPress={() => router.dismissTo('/')} />
        </View>
      </FocusTemplate>
    );
  }

  const question = exam.questions[index];
  const answeredCount = exam.questions.filter((q) => isAnswered(answers[q.id])).length;
  const isLast = index === exam.questions.length - 1;

  return (
    <FocusTemplate title={exam.title} closeIcon="x" scrollRef={scrollRef}>
      <View className="gap-2">
        <ProgressBar value={answeredCount / exam.questions.length} thickness="hairline" />
        <AppText variant="caption" tone="faint">
          {answeredCount} réponse(s) sur {exam.questions.length}
        </AppText>
      </View>

      <ExamQuestionCard
        question={question}
        number={index + 1}
        total={exam.questions.length}
        answer={answers[question.id]}
        onAnswer={(a) => setAnswers((prev) => ({ ...prev, [question.id]: a }))}
      />

      <View className="flex-row gap-3">
        <Button
          label="Précédente"
          variant="secondary"
          disabled={index === 0}
          onPress={() => setIndex(index - 1)}
          className="flex-1"
        />
        {isLast ? (
          <Button label="Remettre" icon="send" loading={submitting} onPress={handIn} className="flex-1" />
        ) : (
          <Button
            label="Suivante"
            onPress={() => {
              setIndex(index + 1);
              scrollRef.current?.scrollTo({ y: 0, animated: true });
            }}
            className="flex-1"
          />
        )}
      </View>
      {!isLast ? <Button label="Remettre ma copie maintenant" variant="ghost" fullWidth onPress={handIn} /> : null}
    </FocusTemplate>
  );
}
