import { ActivityIndicator, Pressable, View, type PressableProps } from 'react-native';
import { colors } from '@/core/theme/colors';
import { AppText } from './AppText';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: ButtonVariant;
  icon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const CONTAINER: Record<ButtonVariant, string> = {
  primary: 'bg-brand',
  secondary: 'bg-brand-haze',
  ghost: 'bg-transparent',
};

/** Generous, fully rounded, flat (no shadow) call-to-action. */
export function Button({
  label,
  variant = 'primary',
  icon,
  loading = false,
  fullWidth = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const tone = variant === 'primary' ? 'inverse' : 'brand';
  const iconColor = variant === 'primary' ? colors.white : colors.brand;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      className={`flex-row items-center justify-center rounded-full px-7 py-4 active:opacity-80 ${CONTAINER[variant]} ${
        fullWidth ? 'self-stretch' : 'self-start'
      } ${isDisabled ? 'opacity-40' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <View className="flex-row items-center gap-3">
          {icon ? <Icon name={icon} size={18} color={iconColor} /> : null}
          <AppText variant="subheading" tone={tone}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}
