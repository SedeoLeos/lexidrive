import { View } from 'react-native';
import type { ExamAnswer, ExamQuestion } from '@/domain/entities';
import { AppText, Pill, TextField } from '../atoms';
import { OptionButton } from '../molecules';

export interface ExamQuestionCardProps {
  question: ExamQuestion;
  number: number;
  total: number;
  answer: ExamAnswer | undefined;
  onAnswer: (answer: ExamAnswer) => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/** Exam item without feedback: corrections are only revealed once the paper is handed in. */
export function ExamQuestionCard({ question, number, total, answer, onAnswer }: ExamQuestionCardProps) {
  return (
    <View className="gap-6">
      <View className="flex-row items-center justify-between">
        <Pill label={question.section} tone="neutral" />
        <AppText variant="caption" tone="muted">
          Question {number} / {total}
        </AppText>
      </View>
      <AppText variant="title" className="text-2xl leading-9">
        {question.prompt}
      </AppText>

      {question.kind === 'mcq' ? (
        <View className="gap-3" accessibilityRole="radiogroup">
          {question.options.map((option, i) => (
            <OptionButton
              key={option}
              letter={LETTERS[i]}
              label={option}
              state={answer?.kind === 'mcq' && answer.index === i ? 'selected' : 'idle'}
              onPress={() => onAnswer({ kind: 'mcq', index: i })}
            />
          ))}
        </View>
      ) : (
        <View className="gap-5">
          <View className="rounded-3xl bg-surface px-6 py-5">
            <AppText variant="heading" className="leading-9">
              {question.text.split('___')[0]}
              <AppText variant="heading" tone="brand">
                {' ______ '}
              </AppText>
              {question.text.split('___')[1]}
            </AppText>
          </View>
          <TextField
            value={answer?.kind === 'fill' ? answer.text : ''}
            onChangeText={(text) => onAnswer({ kind: 'fill', text })}
            placeholder="Écris le mot exact"
            accessibilityLabel="Réponse"
          />
          <AppText variant="caption" tone="faint">
            L'orthographe doit être exacte (majuscules et accents ignorés).
          </AppText>
        </View>
      )}
    </View>
  );
}
