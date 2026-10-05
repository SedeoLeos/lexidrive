import { View, type ViewProps } from 'react-native';

export interface SurfaceProps extends ViewProps {
  tone?: 'surface' | 'raised' | 'brand' | 'white';
  padded?: boolean;
  className?: string;
}

const TONES = {
  surface: 'bg-surface',
  raised: 'bg-surface-raised',
  brand: 'bg-brand-haze',
  white: 'bg-white',
} as const;

/**
 * A "card" without borders or shadows: depth is a whisper of tint over the canvas.
 */
export function Surface({ tone = 'surface', padded = true, className = '', ...props }: SurfaceProps) {
  return <View className={`rounded-3xl ${TONES[tone]} ${padded ? 'p-6' : ''} ${className}`} {...props} />;
}
