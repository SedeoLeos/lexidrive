import { View } from 'react-native';
import type { XpSummary } from '@/domain/entities';
import { AppText, ProgressBar } from '../atoms';

/** Experience level at a glance: number, title, progress towards the next level. */
export function XpBadge({ xp, compact = false }: { xp: XpSummary; compact?: boolean }) {
  return (
    <View className={`flex-row items-center gap-4 ${compact ? '' : 'rounded-3xl bg-surface px-5 py-4'}`}>
      <View className="h-12 w-12 items-center justify-center rounded-full bg-brand">
        <AppText variant="subheading" tone="inverse">
          {xp.level.level}
        </AppText>
      </View>
      <View className="flex-1 gap-1.5">
        <View className="flex-row items-baseline justify-between">
          <AppText variant="subheading">{xp.level.title}</AppText>
          <AppText variant="caption" tone="muted">
            {xp.total.toLocaleString('fr-FR')} XP
          </AppText>
        </View>
        <ProgressBar value={xp.progress} thickness="hairline" />
        <AppText variant="caption" tone="faint" className="text-xs">
          {xp.today > 0 ? `+${xp.today} XP aujourd’hui · ` : ''}
          encore {Math.max(0, xp.level.ceiling - xp.total)} XP pour le niveau {xp.level.level + 1}
        </AppText>
      </View>
    </View>
  );
}
