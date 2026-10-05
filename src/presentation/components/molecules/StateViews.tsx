import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import { AppText, Button, Icon, type IconName } from '../atoms';

export function LoadingState({ label = 'Chargement…' }: { label?: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-4 py-24">
      <ActivityIndicator color={colors.brand} />
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
    </View>
  );
}

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'feather', title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="items-center gap-4 px-6 py-16">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-brand-haze">
        <Icon name={icon} size={22} color={colors.brand} />
      </View>
      <AppText variant="heading" className="text-center">
        {title}
      </AppText>
      {message ? (
        <AppText variant="body" tone="muted" className="text-center">
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} variant="secondary" onPress={onAction} className="self-center" />
      ) : null}
    </View>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <EmptyState
      icon="alert-circle"
      title="Un imprévu"
      message={error.message}
      actionLabel={onRetry ? 'Réessayer' : undefined}
      onAction={onRetry}
    />
  );
}
