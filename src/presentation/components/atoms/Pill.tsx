import { View } from 'react-native';
import { AppText } from './AppText';

export interface PillProps {
  label: string;
  tone?: 'brand' | 'neutral' | 'success' | 'danger' | 'solid';
  className?: string;
}

const BG = {
  brand: 'bg-brand-mist',
  neutral: 'bg-surface',
  success: 'bg-success-mist',
  danger: 'bg-danger-mist',
  solid: 'bg-brand',
} as const;

const TEXT = { brand: 'brand', neutral: 'soft', success: 'success', danger: 'danger', solid: 'inverse' } as const;

export function Pill({ label, tone = 'brand', className = '' }: PillProps) {
  return (
    <View className={`self-start rounded-full px-3.5 py-1.5 ${BG[tone]} ${className}`}>
      <AppText variant="overline" tone={TEXT[tone]}>
        {label}
      </AppText>
    </View>
  );
}
