import { View } from 'react-native';
import { formatDuration } from '@/core/utils/date';
import type { GoalProgress, ModuleProgress } from '@/domain/logic/studyTime';
import { AppText } from '../atoms';
import { ModuleProgressRow } from '../molecules';

export interface DailyGaugeProps {
  goal: GoalProgress;
  modules: ModuleProgress[];
  showModules?: boolean;
}

/**
 * The 7-hour Bootcamp gauge: seven hour-segments that fill continuously.
 * Time accumulates across every sitting of the day, even after the app was closed.
 */
export function DailyGauge({ goal, modules, showModules = true }: DailyGaugeProps) {
  const totalHours = Math.round(goal.goalSeconds / 3600);
  const studiedHours = goal.totalSeconds / 3600;

  return (
    <View className="gap-6">
      <View className="flex-row items-end justify-between">
        <View className="gap-1">
          <AppText variant="overline" tone="muted">
            Bootcamp du jour
          </AppText>
          <View className="flex-row items-baseline gap-2">
            <AppText variant="display" tone="brand" className="text-5xl leading-[56px]">
              {formatDuration(goal.totalSeconds)}
            </AppText>
            <AppText variant="heading" tone="faint">
              / {totalHours} h
            </AppText>
          </View>
        </View>
        <AppText variant="caption" tone="muted" className="mb-2">
          {Math.round(goal.ratio * 100)} %
        </AppText>
      </View>

      <View
        className="flex-row gap-1.5"
        accessibilityLabel={`${formatDuration(goal.totalSeconds)} étudiées sur ${totalHours} heures`}
      >
        {Array.from({ length: totalHours }, (_, i) => {
          const fill = Math.min(1, Math.max(0, studiedHours - i));
          return (
            <View key={i} className="h-2 flex-1 overflow-hidden rounded-full bg-brand-mist">
              <View className="h-full rounded-full bg-brand" style={{ width: `${Math.round(fill * 100)}%` }} />
            </View>
          );
        })}
      </View>

      <AppText variant="caption" tone="soft">
        {goal.remainingSeconds === 0
          ? 'Objectif atteint. Tout ce que tu fais maintenant est du bonus.'
          : `Encore ${formatDuration(goal.remainingSeconds)}, en autant de sessions que tu veux.`}
      </AppText>

      {showModules ? (
        <View className="gap-5 pt-2">
          {modules.map((m) => (
            <ModuleProgressRow key={m.activity} module={m} />
          ))}
        </View>
      ) : null}
    </View>
  );
}
