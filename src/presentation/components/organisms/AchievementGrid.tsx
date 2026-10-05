import { View } from 'react-native';
import { colors } from '@/core/theme/colors';
import type { Achievement } from '@/domain/entities';
import { AppText, Icon } from '../atoms';

/** Badges: unlocked ones in signature blue, locked ones as faint goals to aim for. */
export function AchievementGrid({ achievements }: { achievements: Achievement[] }) {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      {achievements.map((a) => {
        const unlocked = a.unlockedAt !== null;
        return (
          <View
            key={a.id}
            accessibilityLabel={`${a.title}${unlocked ? ', débloqué' : ', à débloquer'} : ${a.description}`}
            className={`w-[48.5%] gap-2 rounded-3xl px-4 py-4 ${unlocked ? 'bg-brand-haze' : 'bg-surface'}`}
          >
            <View className={`h-9 w-9 items-center justify-center rounded-full ${unlocked ? 'bg-brand' : 'bg-canvas'}`}>
              <Icon name={unlocked ? a.icon : 'lock'} size={15} color={unlocked ? colors.white : colors.inkFaint} />
            </View>
            <AppText variant="subheading" tone={unlocked ? 'ink' : 'muted'} className="text-sm">
              {a.title}
            </AppText>
            <AppText variant="caption" tone={unlocked ? 'soft' : 'faint'} className="text-xs leading-4">
              {a.description}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}
