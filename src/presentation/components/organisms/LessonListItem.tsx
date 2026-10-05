import { Pressable, View } from 'react-native';
import { colors } from '@/core/theme/colors';
import type { LessonSummary } from '@/domain/entities';
import { AppText, Icon } from '../atoms';

export interface LessonListItemProps {
  lesson: LessonSummary;
  locked: boolean;
  onPress: () => void;
}

export function LessonListItem({ lesson, locked, onPress }: LessonListItemProps) {
  const score = lesson.bestScore !== null ? `${Math.round(lesson.bestScore * 100)} %` : null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      accessibilityLabel={`${lesson.title}${locked ? ', verrouillée' : ''}`}
      disabled={locked}
      onPress={onPress}
      className={`flex-row items-center gap-5 rounded-3xl bg-surface px-5 py-5 active:opacity-70 ${locked ? 'opacity-45' : ''}`}
    >
      <View
        className={`h-11 w-11 items-center justify-center rounded-full ${lesson.completed ? 'bg-brand' : 'bg-canvas'}`}
      >
        {lesson.completed ? (
          <Icon name="check" size={18} color={colors.white} />
        ) : locked ? (
          <Icon name="lock" size={16} color={colors.inkFaint} />
        ) : (
          <AppText variant="caption" tone="brand">
            {String(lesson.order).padStart(2, '0')}
          </AppText>
        )}
      </View>
      <View className="flex-1 gap-0.5">
        <AppText variant="subheading">{lesson.title}</AppText>
        <AppText variant="caption" tone="muted" numberOfLines={2}>
          {lesson.theme}
        </AppText>
        <AppText variant="caption" tone="faint" className="mt-1 text-xs">
          20 mots · {lesson.quizCount} quiz{score ? ` · meilleur score ${score}` : ''}
        </AppText>
      </View>
    </Pressable>
  );
}
