import { Pressable, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import { AppText, Icon } from '../atoms';

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

export interface OptionButtonProps {
  label: string;
  letter: string;
  state: OptionState;
  onPress: () => void;
  disabled?: boolean;
}

const BG: Record<OptionState, string> = {
  idle: 'bg-surface',
  selected: 'bg-brand-mist',
  correct: 'bg-success-mist',
  wrong: 'bg-danger-mist',
  dimmed: 'bg-surface opacity-50',
};

export function OptionButton({ label, letter, state, onPress, disabled }: OptionButtonProps) {
  const icon = state === 'correct' ? 'check' : state === 'wrong' ? 'x' : null;
  const iconColor = state === 'correct' ? colors.success : colors.danger;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: state === 'selected', disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`flex-row items-center gap-4 rounded-3xl px-5 py-4 active:opacity-70 ${BG[state]}`}
    >
      <View
        className={`h-8 w-8 items-center justify-center rounded-full ${state === 'selected' ? 'bg-brand' : 'bg-canvas'}`}
      >
        <AppText variant="caption" tone={state === 'selected' ? 'inverse' : 'muted'}>
          {letter}
        </AppText>
      </View>
      <AppText variant="body" className="flex-1">
        {label}
      </AppText>
      {icon ? <Icon name={icon} size={18} color={iconColor} /> : null}
    </Pressable>
  );
}
