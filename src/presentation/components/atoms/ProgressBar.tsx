import { View } from 'react-native';

export interface ProgressBarProps {
  /** 0 → 1 */
  value: number;
  tone?: 'brand' | 'success' | 'soft';
  thickness?: 'hairline' | 'thin' | 'regular';
  className?: string;
}

const FILL = { brand: 'bg-brand', success: 'bg-success', soft: 'bg-brand-soft' } as const;
const HEIGHT = { hairline: 'h-[3px]', thin: 'h-1.5', regular: 'h-2.5' } as const;

/** Ultra-thin, fully rounded progress line on a barely-visible track. */
export function ProgressBar({ value, tone = 'brand', thickness = 'thin', className = '' }: ProgressBarProps) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: pct }}
      className={`w-full overflow-hidden rounded-full bg-brand-mist ${HEIGHT[thickness]} ${className}`}
    >
      <View className={`h-full rounded-full ${FILL[tone]}`} style={{ width: `${pct}%` }} />
    </View>
  );
}
