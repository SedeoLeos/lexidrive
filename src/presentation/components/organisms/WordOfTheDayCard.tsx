import { Pressable, View } from 'react-native';
import type { DictionaryEntry } from '@/domain/entities';
import { AppText } from '../atoms';
import { SpeakerButton } from '../molecules';

/** A pillar word every day — heard, understood, with the trap to avoid. */
export function WordOfTheDayCard({ entry, onPress }: { entry: DictionaryEntry; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="gap-3 rounded-3xl bg-brand-haze px-6 py-6 active:opacity-80"
    >
      <View className="flex-row items-center justify-between">
        <AppText variant="overline" tone="brand">
          Le mot du jour
        </AppText>
        <SpeakerButton text={entry.word} speechKey={`wotd:${entry.id}`} />
      </View>
      <AppText variant="title" className="text-4xl leading-[48px]">
        {entry.word}
      </AppText>
      <AppText variant="body" tone="soft">
        {entry.translation}
      </AppText>
      {entry.note ? (
        <AppText variant="caption" tone="muted">
          {entry.note}
        </AppText>
      ) : null}
    </Pressable>
  );
}
