import { Pressable, View } from 'react-native';
import { AppText } from '../atoms';

export interface SectionHeaderProps {
  overline?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({ overline, title, actionLabel, onAction, className = '' }: SectionHeaderProps) {
  return (
    <View className={`flex-row items-end justify-between ${className}`}>
      <View className="flex-1 gap-1.5">
        {overline ? (
          <AppText variant="overline" tone="muted">
            {overline}
          </AppText>
        ) : null}
        <AppText variant="heading">{title}</AppText>
      </View>
      {actionLabel && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={10} className="active:opacity-60">
          <AppText variant="caption" tone="brand">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
