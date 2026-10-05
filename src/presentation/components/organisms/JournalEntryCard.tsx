import { Pressable, View } from 'react-native';
import { formatShortFrenchDate, fromLocalDateKey } from '@/core/utils/date';
import type { JournalEntry } from '@/domain/entities';
import { AppText, Pill } from '../atoms';
import { SpeakerButton } from '../molecules';

export function JournalEntryCard({ entry, onPress }: { entry: JournalEntry; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="gap-3 rounded-3xl bg-surface px-6 py-5 active:opacity-70"
    >
      <View className="flex-row items-center justify-between">
        <AppText variant="overline" tone="muted">
          {formatShortFrenchDate(fromLocalDateKey(entry.dateKey))}
        </AppText>
        <Pill label={entry.kind === 'debate' ? 'Débat' : 'Vie'} tone="neutral" />
      </View>
      <AppText variant="caption" tone="soft" numberOfLines={2}>
        {entry.prompt}
      </AppText>
      <View className="flex-row items-start gap-3">
        <AppText variant="body" className="flex-1" numberOfLines={4}>
          {entry.englishText || entry.frenchText}
        </AppText>
        {entry.englishText ? <SpeakerButton text={entry.englishText} speechKey={`j:${entry.id}`} /> : null}
      </View>
      <AppText variant="caption" tone="faint" className="text-xs">
        {entry.wordCount} mots en anglais
      </AppText>
    </Pressable>
  );
}
