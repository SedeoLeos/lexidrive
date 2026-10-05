import { useEffect, useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CORRECT_MESSAGES, WRONG_MESSAGES, pickMessage } from '@/core/constants/encouragement';
import { colors } from '@/core/theme/colors';
import { hashString } from '@/core/utils/random';
import type { DictationResult, ListeningItem } from '@/domain/entities';
import { gradeDictation } from '@/domain/logic/listening';
import { useSpeech } from '../../hooks/useSpeech';
import { AppText, Button, Icon, ProgressBar, TextField } from '../atoms';
import { OptionButton } from '../molecules';

export interface ListeningRunnerProps {
  items: ListeningItem[];
  onFinish: (correct: number, total: number) => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

/**
 * Immersive listening: English is only *heard* (native offline TTS), never shown first.
 * Hear-and-choose builds comprehension; short dictations train the ear and spelling together.
 */
export function ListeningRunner({ items, onFinish }: ListeningRunnerProps) {
  const { speak, speakingKey } = useSpeech();
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [dictation, setDictation] = useState<DictationResult | null>(null);

  const item = items[index];
  const key = `listen:${item.id}`;
  const answered = item.kind === 'listen-choose' ? chosen !== null : dictation !== null;
  const wasRight = item.kind === 'listen-choose' ? chosen === item.answerIndex : !!dictation?.correct;

  // Every new item plays automatically: ears first.
  useEffect(() => {
    const t = setTimeout(() => void speak(item.audio, key, { restart: true }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const feedback = (ok: boolean) => {
    if (ok) setCorrect((c) => c + 1);
    void Haptics.notificationAsync(
      ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning,
    ).catch(() => undefined);
  };

  const choose = (i: number) => {
    if (chosen !== null || item.kind !== 'listen-choose') return;
    setChosen(i);
    feedback(i === item.answerIndex);
  };

  const checkDictation = () => {
    if (item.kind !== 'dictation' || !typed.trim()) return;
    Keyboard.dismiss();
    const result = gradeDictation(item.audio, typed);
    setDictation(result);
    feedback(result.correct);
  };

  const next = () => {
    if (index + 1 >= items.length) {
      onFinish(correct, items.length);
      return;
    }
    setChosen(null);
    setTyped('');
    setDictation(null);
    setIndex(index + 1);
  };

  return (
    <View className="gap-8">
      <View className="gap-3">
        <View className="flex-row justify-between">
          <AppText variant="overline" tone="brand">
            {item.kind === 'listen-choose' ? 'Écoute et choisis le sens' : 'Dictée : écris ce que tu entends'}
          </AppText>
          <AppText variant="caption" tone="muted">
            {index + 1} / {items.length}
          </AppText>
        </View>
        <ProgressBar value={(index + (answered ? 1 : 0)) / items.length} thickness="hairline" />
      </View>

      <View className="items-center gap-4 py-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Écouter"
          onPress={() => void speak(item.audio, key, { restart: true })}
          className="h-28 w-28 items-center justify-center rounded-full bg-brand active:opacity-80"
        >
          <Icon name={speakingKey === key ? 'volume-2' : 'play'} size={38} color={colors.white} />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => void speak(item.audio, key, { restart: true, slow: true })}
          hitSlop={10}
        >
          <AppText variant="caption" tone="brand">
            Réécouter lentement
          </AppText>
        </Pressable>
        {answered ? (
          <AppText variant="heading" className="pt-2 text-center">
            « {item.audio} »
          </AppText>
        ) : null}
      </View>

      {item.kind === 'listen-choose' ? (
        <View className="gap-3">
          {item.options.map((option, i) => {
            let state: 'idle' | 'correct' | 'wrong' | 'dimmed' = 'idle';
            if (chosen !== null) state = i === item.answerIndex ? 'correct' : i === chosen ? 'wrong' : 'dimmed';
            return (
              <OptionButton
                key={option}
                letter={LETTERS[i]}
                label={option}
                state={state}
                disabled={chosen !== null}
                onPress={() => choose(i)}
              />
            );
          })}
        </View>
      ) : (
        <View className="gap-4">
          <TextField
            value={typed}
            onChangeText={setTyped}
            editable={!dictation}
            placeholder="Écris la phrase en anglais…"
            autoCapitalize="sentences"
            returnKeyType="done"
            onSubmitEditing={checkDictation}
            accessibilityLabel="Ta dictée"
          />
          {dictation ? (
            <View className="gap-3 rounded-3xl bg-surface px-5 py-5">
              <AppText variant="body" className="leading-8">
                {dictation.words.map((w, i) => (
                  <AppText
                    key={i}
                    variant="body"
                    tone={w.ok ? 'success' : 'danger'}
                    className={w.ok ? '' : 'underline'}
                  >
                    {w.word}{' '}
                  </AppText>
                ))}
              </AppText>
              <AppText variant="caption" tone="muted">
                {Math.round(dictation.accuracy * 100)} % des mots · {item.translation}
              </AppText>
            </View>
          ) : null}
        </View>
      )}

      {answered ? (
        <View className="gap-4">
          <AppText variant="subheading" tone={wasRight ? 'success' : 'danger'} className="text-center">
            {pickMessage(wasRight ? CORRECT_MESSAGES : WRONG_MESSAGES, hashString(item.id))}
          </AppText>
          <Button
            label={index + 1 >= items.length ? 'Voir mon résultat' : 'Suivant'}
            icon="arrow-right"
            fullWidth
            onPress={next}
          />
        </View>
      ) : item.kind === 'dictation' ? (
        <Button label="Vérifier" fullWidth disabled={!typed.trim()} onPress={checkDictation} />
      ) : null}
    </View>
  );
}
