import { Pressable, type PressableProps } from 'react-native';
import { colors } from '@/core/theme/colors';
import { Icon, type IconName } from './Icon';

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  icon: IconName;
  label: string;
  tone?: 'surface' | 'brand' | 'plain';
  size?: 'sm' | 'md';
  active?: boolean;
  className?: string;
}

/** Circular icon control; background tint only, no border, no shadow. */
export function IconButton({
  icon,
  label,
  tone = 'surface',
  size = 'md',
  active = false,
  className = '',
  ...props
}: IconButtonProps) {
  const dimension = size === 'sm' ? 'h-9 w-9' : 'h-12 w-12';
  const bg = active || tone === 'brand' ? 'bg-brand' : tone === 'surface' ? 'bg-surface' : 'bg-transparent';
  const color = active || tone === 'brand' ? colors.white : colors.brand;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      className={`items-center justify-center rounded-full active:opacity-70 ${dimension} ${bg} ${className}`}
      {...props}
    >
      <Icon name={icon} size={size === 'sm' ? 16 : 20} color={color} />
    </Pressable>
  );
}
