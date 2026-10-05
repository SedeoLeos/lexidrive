import { useMemo, useState } from 'react';
import { Keyboard, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { createRng, hashString, shuffle } from '@/core/utils/random';
import type { Quiz, QuizCategory, QuizEvaluation, QuizResponse } from '@/domain/entities';
import { evaluateQuiz } from '@/domain/logic/quizGrading';
import { AppText, Button, ProgressBar, TextField } from '../atoms';
import { FeedbackPanel, OptionButton, WordTile } from '../molecules';

export interface QuizOutcome {
  quiz: Quiz;
  correct: boolean;
  expected: string;
}

export interface QuizRunnerProps {
  quizzes: Quiz[];
  /** Changes on each attempt so option order differs between attempts. */
  seed: number;
  onFinish: (outcomes: QuizOutcome[]) => void;
}

const CATEGORY_LABEL: Record<QuizCategory, string> = {
  vocabulary: 'A · Vocabulaire',
  grammar: 'B · Grammaire & syntaxe',
  spelling: 'C · Orthographe & textes à trous',
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Renders "text with ___ gap", highlighting the gap. */
function GapText({ text }: { text: string }) {
  const [before, after] = text.split('___');
  return (
    <AppText variant="heading" className="leading-9">
      {before}
      <AppText variant="heading" tone="brand">
        {' ______ '}
      </AppText>
      {after}
    </AppText>
  );
}

/**
 * Runs a quiz bank one item at a time: answer → instant feedback with explanation → next.
 * Supports MCQ, word re-ordering, gap-fill typing and spelling correction.
 */
export function QuizRunner({ quizzes, seed, onFinish }: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [outcomes, setOutcomes] = useState<QuizOutcome[]>([]);
  const [evaluation, setEvaluation] = useState<QuizEvaluation | null>(null);

  // Per-item drafts
  const [selected, setSelected] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [placed, setPlaced] = useState<number[]>([]);

  const quiz = quizzes[index];

  const shuffled = useMemo(() => {
    const rng = createRng(seed ^ hashString(quiz.id));
    if (quiz.kind === 'mcq')
      return shuffle(
        quiz.options.map((_, i) => i),
        rng,
      );
    if (quiz.kind === 'reorder') {
      let order = shuffle(
        quiz.words.map((_, i) => i),
        rng,
      );
      // Never present the sentence already in the right order.
      if (order.every((v, i) => v === i) && order.length > 1) order = [...order.slice(1), order[0]];
      return order;
    }
    return [];
  }, [quiz, seed]);

  const response: QuizResponse | null = (() => {
    switch (quiz.kind) {
      case 'mcq':
        return selected === null ? null : { kind: 'mcq', index: selected };
      case 'reorder':
        return placed.length === quiz.words.length
          ? { kind: 'reorder', words: placed.map((i) => quiz.words[i]) }
          : null;
      case 'fill':
        return typed.trim() ? { kind: 'fill', text: typed } : null;
      case 'correct':
        return typed.trim() ? { kind: 'correct', text: typed } : null;
    }
  })();

  const validate = () => {
    if (!response) return;
    Keyboard.dismiss();
    const result = evaluateQuiz(quiz, response);
    setEvaluation(result);
    void Haptics.notificationAsync(
      result.correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
    ).catch(() => undefined);
  };

  const next = () => {
    if (!evaluation) return;
    const updated = [...outcomes, { quiz, correct: evaluation.correct, expected: evaluation.expected }];
    if (index + 1 >= quizzes.length) {
      onFinish(updated);
      return;
    }
    setOutcomes(updated);
    setSelected(null);
    setTyped('');
    setPlaced([]);
    setEvaluation(null);
    setIndex(index + 1);
  };

  const locked = evaluation !== null;
  const correctSoFar = outcomes.filter((o) => o.correct).length;

  return (
    <View className="gap-8">
      <View className="gap-3">
        <View className="flex-row justify-between">
          <AppText variant="overline" tone="brand">
            {CATEGORY_LABEL[quiz.category]}
          </AppText>
          <AppText variant="caption" tone="muted">
            {index + 1} / {quizzes.length} · {correctSoFar} ✓
          </AppText>
        </View>
        <ProgressBar value={(index + (locked ? 1 : 0)) / quizzes.length} thickness="hairline" />
      </View>

      <View className="gap-5">
        <AppText variant="title" className="text-2xl leading-9">
          {quiz.prompt}
        </AppText>

        {quiz.kind === 'mcq' ? (
          <View className="gap-3" accessibilityRole="radiogroup">
            {shuffled.map((optionIndex, position) => {
              let state: 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed' =
                selected === optionIndex ? 'selected' : 'idle';
              if (locked) {
                if (optionIndex === quiz.answerIndex) state = 'correct';
                else if (optionIndex === selected) state = 'wrong';
                else state = 'dimmed';
              }
              return (
                <OptionButton
                  key={optionIndex}
                  letter={LETTERS[position]}
                  label={quiz.options[optionIndex]}
                  state={state}
                  disabled={locked}
                  onPress={() => setSelected(optionIndex)}
                />
              );
            })}
          </View>
        ) : null}

        {quiz.kind === 'reorder' ? (
          <View className="gap-6">
            <View className="min-h-[96px] flex-row flex-wrap gap-2 rounded-3xl bg-brand-haze p-4">
              {placed.length === 0 ? (
                <AppText variant="caption" tone="muted" className="p-2">
                  Touche les mots dans le bon ordre.
                </AppText>
              ) : (
                placed.map((wordIndex, pos) => (
                  <WordTile
                    key={`p-${wordIndex}`}
                    word={quiz.words[wordIndex]}
                    placed
                    disabled={locked}
                    onPress={() => setPlaced(placed.filter((_, i) => i !== pos))}
                  />
                ))
              )}
            </View>
            <View className="flex-row flex-wrap gap-2">
              {shuffled
                .filter((wordIndex) => !placed.includes(wordIndex))
                .map((wordIndex) => (
                  <WordTile
                    key={`w-${wordIndex}`}
                    word={quiz.words[wordIndex]}
                    disabled={locked}
                    onPress={() => setPlaced([...placed, wordIndex])}
                  />
                ))}
            </View>
          </View>
        ) : null}

        {quiz.kind === 'fill' ? (
          <View className="gap-5">
            <GapText text={quiz.text} />
            <TextField
              value={typed}
              onChangeText={setTyped}
              editable={!locked}
              placeholder="Écris le mot manquant"
              returnKeyType="done"
              onSubmitEditing={validate}
              accessibilityLabel="Mot manquant"
            />
          </View>
        ) : null}

        {quiz.kind === 'correct' ? (
          <View className="gap-5">
            <View className="rounded-3xl bg-surface px-6 py-5">
              <AppText variant="heading" className="leading-9">
                {quiz.text}
              </AppText>
            </View>
            <TextField
              value={typed}
              onChangeText={setTyped}
              editable={!locked}
              placeholder="Le mot corrigé"
              returnKeyType="done"
              onSubmitEditing={validate}
              accessibilityLabel="Mot corrigé"
            />
          </View>
        ) : null}
      </View>

      {evaluation ? (
        <FeedbackPanel correct={evaluation.correct} expected={evaluation.expected} explanation={quiz.explanation} />
      ) : null}

      {locked ? (
        <Button
          label={index + 1 >= quizzes.length ? 'Voir mon score' : 'Question suivante'}
          icon="arrow-right"
          fullWidth
          onPress={next}
        />
      ) : (
        <Button label="Valider" fullWidth disabled={!response} onPress={validate} />
      )}
    </View>
  );
}
