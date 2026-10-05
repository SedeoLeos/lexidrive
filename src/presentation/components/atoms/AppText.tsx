import { Text, type TextProps } from 'react-native';

/**
 * Typography scale — thin, airy, premium. Weight comes from the font family (Inter 200 → 600),
 * never from fontWeight, so Android renders the exact cut.
 */
export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'subheading'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'overline';
export type TextTone = 'ink' | 'soft' | 'muted' | 'faint' | 'brand' | 'inverse' | 'success' | 'danger';

const VARIANTS: Record<TextVariant, string> = {
  display: 'font-thin text-6xl leading-[68px] tracking-tight',
  title: 'font-light text-3xl leading-10 tracking-tight',
  heading: 'font-light text-xl leading-7',
  subheading: 'font-medium text-base leading-6',
  body: 'font-light text-base leading-7',
  bodyStrong: 'font-medium text-base leading-7',
  caption: 'font-sans text-sm leading-5',
  overline: 'font-medium text-[11px] uppercase tracking-luxe',
};

const TONES: Record<TextTone, string> = {
  ink: 'text-ink',
  soft: 'text-ink-soft',
  muted: 'text-ink-muted',
  faint: 'text-ink-faint',
  brand: 'text-brand',
  inverse: 'text-white',
  success: 'text-success',
  danger: 'text-danger',
};

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
}

export function AppText({ variant = 'body', tone = 'ink', className = '', ...props }: AppTextProps) {
  return <Text className={`${VARIANTS[variant]} ${TONES[tone]} ${className}`} {...props} />;
}
