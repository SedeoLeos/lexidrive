import Feather from '@expo/vector-icons/Feather';
import type { ComponentProps } from 'react';
import { colors } from '@/core/theme/colors';

export type IconName = ComponentProps<typeof Feather>['name'];

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

/** Feather's thin 1.5px line icons match the minimal typography. */
export function Icon({ name, size = 20, color = colors.ink }: IconProps) {
  return <Feather name={name} size={size} color={color} />;
}
