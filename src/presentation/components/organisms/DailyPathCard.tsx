import { Pressable, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import type { DailyPath } from '@/domain/entities';
import { AppText, Button, Icon } from '../atoms';

export interface DailyPathCardProps {
  path: DailyPath;
  onOpen: (href: string) => void;
}

/**
 * "Ton parcours du jour": four short steps and a single obvious next action.
 * The learner never has to decide what to do — just press Continue.
 */
export function DailyPathCard({ path, onOpen }: DailyPathCardProps) {
  const done = path.next === null;
  return (
    <View className="gap-6 rounded-3xl bg-white px-6 py-7">
      <View className="flex-row items-end justify-between">
        <View className="gap-1">
          <AppText variant="overline" tone="muted">
            Ton parcours du jour
          </AppText>
          <AppText variant="heading">{done ? 'Parcours terminé, bravo !' : 'Une étape à la fois.'}</AppText>
        </View>
        <AppText variant="caption" tone="brand">
          {path.completed} / {path.steps.length}
        </AppText>
      </View>

      <View className="gap-1">
        {path.steps.map((step) => {
          const isNext = path.next?.id === step.id;
          return (
            <Pressable
              key={step.id}
              accessibilityRole="button"
              accessibilityLabel={`${step.title}${step.done ? ', terminé' : ''}`}
              onPress={() => onOpen(step.href)}
              className={`flex-row items-center gap-4 rounded-3xl px-3 py-3 active:bg-surface ${isNext ? 'bg-brand-haze' : ''}`}
            >
              <View
                className={`h-10 w-10 items-center justify-center rounded-full ${
                  step.done ? 'bg-brand' : isNext ? 'bg-white' : 'bg-surface'
                }`}
              >
                {step.done ? (
                  <Icon name="check" size={16} color={colors.white} />
                ) : (
                  <Icon name={step.icon} size={16} color={isNext ? colors.brand : colors.inkMuted} />
                )}
              </View>
              <View className="flex-1">
                <AppText variant="subheading" tone={step.done ? 'muted' : 'ink'}>
                  {step.title}
                </AppText>
                <AppText variant="caption" tone="muted" numberOfLines={1}>
                  {step.done ? 'Fait' : `≈ ${step.minutes} min`} · {step.subtitle}
                </AppText>
              </View>
            </Pressable>
          );
        })}
      </View>

      {path.next ? (
        <Button
          label={path.completed === 0 ? 'Commencer' : 'Continuer'}
          icon="arrow-right"
          fullWidth
          onPress={() => onOpen(path.next!.href)}
        />
      ) : (
        <AppText variant="caption" tone="success" className="text-center">
          Tout est fait pour aujourd’hui. Chaque minute de plus compte pour ta jauge des 7 heures.
        </AppText>
      )}
    </View>
  );
}
