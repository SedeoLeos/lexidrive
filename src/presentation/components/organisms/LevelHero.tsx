import { View } from 'react-native';
import { LEVELS, type Level, type LevelMeta } from '@/core/constants/levels';
import { AppText, Pill, ProgressBar } from '../atoms';

export interface LevelHeroProps {
  level: Level;
  meta: LevelMeta;
  lessonsCompleted: number;
  lessonsTotal: number;
  /** Every lesson of the level is completed. */
  examReady: boolean;
  isFinal: boolean;
}

/** The unlocked level, displayed as a large hairline monogram with the A1 → C2 path beneath. */
export function LevelHero({ level, meta, lessonsCompleted, lessonsTotal, examReady, isFinal }: LevelHeroProps) {
  const reached = LEVELS.indexOf(level);
  return (
    <View className="gap-5">
      <View className="flex-row items-end justify-between">
        <View className="gap-1">
          <AppText variant="overline" tone="muted">
            Niveau débloqué · {meta.stage}
          </AppText>
          <AppText variant="display" tone="brand" className="text-[88px] leading-[92px]">
            {level}
          </AppText>
        </View>
        {examReady ? (
          <Pill label="Prêt pour l'examen" tone="solid" className="mb-4" />
        ) : isFinal ? (
          <Pill label="Maîtrise" className="mb-4" />
        ) : null}
      </View>
      <View className="gap-1">
        <AppText variant="heading">{meta.title}</AppText>
        <AppText variant="body" tone="muted">
          {meta.tagline}
        </AppText>
      </View>

      <View className="flex-row gap-2">
        {LEVELS.map((l, i) => (
          <View key={l} className="flex-1 gap-2">
            <View className={`h-[3px] rounded-full ${i <= reached ? 'bg-brand' : 'bg-brand-mist'}`} />
            <AppText
              variant="caption"
              tone={i === reached ? 'brand' : i < reached ? 'soft' : 'faint'}
              className="text-[11px]"
            >
              {l}
            </AppText>
          </View>
        ))}
      </View>

      <View className="gap-2">
        <View className="flex-row justify-between">
          <AppText variant="caption" tone="soft">
            Leçons du niveau
          </AppText>
          <AppText variant="caption" tone="muted">
            {lessonsCompleted} / {lessonsTotal}
          </AppText>
        </View>
        <ProgressBar value={lessonsTotal === 0 ? 0 : lessonsCompleted / lessonsTotal} thickness="hairline" />
      </View>
    </View>
  );
}
