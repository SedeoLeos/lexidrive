import { View } from 'react-native';
import { formatDuration } from '@/core/utils/date';
import type { ModuleProgress } from '@/domain/logic/studyTime';
import { AppText, ProgressBar } from '../atoms';

export function ModuleProgressRow({ module }: { module: ModuleProgress }) {
  return (
    <View className="gap-2">
      <View className="flex-row items-baseline justify-between">
        <AppText variant="caption" tone="soft">
          {module.label}
        </AppText>
        <AppText variant="caption" tone="muted">
          {formatDuration(module.seconds)} / {formatDuration(module.targetSeconds)}
        </AppText>
      </View>
      <ProgressBar value={module.ratio} thickness="hairline" tone={module.ratio >= 1 ? 'success' : 'brand'} />
    </View>
  );
}
