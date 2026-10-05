import { View } from 'react-native';
import { colors } from '@/core/theme/colors';
import { AppText, Icon } from '../atoms';

export interface FeedbackPanelProps {
  correct: boolean;
  expected: string;
  explanation: string;
}

/** Calm feedback: a tint, a word, the reason. No red alarms. */
export function FeedbackPanel({ correct, expected, explanation }: FeedbackPanelProps) {
  return (
    <View
      className={`gap-3 rounded-3xl px-6 py-5 ${correct ? 'bg-success-mist' : 'bg-danger-mist'}`}
      accessibilityLiveRegion="polite"
    >
      <View className="flex-row items-center gap-2">
        <Icon name={correct ? 'check-circle' : 'info'} size={18} color={correct ? colors.success : colors.danger} />
        <AppText variant="subheading" tone={correct ? 'success' : 'danger'}>
          {correct ? 'Exact.' : 'Pas tout à fait.'}
        </AppText>
      </View>
      {!correct ? (
        <AppText variant="body">
          Réponse attendue : <AppText variant="bodyStrong">{expected}</AppText>
        </AppText>
      ) : null}
      <AppText variant="caption" tone="soft">
        {explanation}
      </AppText>
    </View>
  );
}
