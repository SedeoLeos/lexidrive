import { View } from 'react-native';
import type { DictionaryEntry } from '@/domain/entities';
import { AppText, Pill, Surface } from '../atoms';
import { SpeakerButton } from '../molecules';

const CATEGORY_LABEL: Record<DictionaryEntry['category'], string> = {
  core: 'Essentiel',
  lesson: 'Leçon',
  pillar: 'Mot pilier',
  idiom: 'Idiome',
  connector: 'Connecteur',
};

/** Full entry: pronunciation, translation, pitfall, elegant alternatives and collocations. */
export function DictionaryEntryDetail({ entry }: { entry: DictionaryEntry }) {
  return (
    <View className="gap-7">
      <View className="gap-3">
        <View className="flex-row flex-wrap gap-2">
          <Pill label={CATEGORY_LABEL[entry.category]} />
          {entry.level ? <Pill label={entry.level} tone="neutral" /> : null}
          {entry.partOfSpeech ? <Pill label={entry.partOfSpeech} tone="neutral" /> : null}
        </View>
        <View className="flex-row items-center gap-4">
          <AppText variant="title" className="flex-1 text-4xl leading-[48px]">
            {entry.word}
          </AppText>
          <SpeakerButton text={entry.word} speechKey={`d:${entry.id}`} size="md" />
        </View>
        <AppText variant="heading" tone="brand">
          {entry.translation}
        </AppText>
        {entry.definition ? (
          <AppText variant="body" tone="soft">
            {entry.definition}
          </AppText>
        ) : null}
      </View>

      {entry.example ? (
        <View className="flex-row items-center gap-3 rounded-3xl bg-surface px-5 py-4">
          <AppText variant="body" tone="soft" className="flex-1 italic">
            {entry.example}
          </AppText>
          <SpeakerButton text={entry.example} speechKey={`dx:${entry.id}`} tone="plain" />
        </View>
      ) : null}

      {entry.note ? (
        <Surface tone="brand" className="gap-2">
          <AppText variant="overline" tone="brand">
            Piège à éviter
          </AppText>
          <AppText variant="body">{entry.note}</AppText>
        </Surface>
      ) : null}

      {entry.alternatives.length > 0 ? (
        <View className="gap-3">
          <AppText variant="overline" tone="muted">
            Alternatives élégantes
          </AppText>
          <View className="flex-row flex-wrap gap-2">
            {entry.alternatives.map((a) => (
              <View key={a} className="rounded-full bg-surface px-4 py-2">
                <AppText variant="caption">{a}</AppText>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {entry.collocations.length > 0 ? (
        <View className="gap-3">
          <AppText variant="overline" tone="muted">
            Collocations
          </AppText>
          {entry.collocations.map((c) => (
            <View key={c} className="flex-row items-center gap-3">
              <View className="h-1 w-1 rounded-full bg-brand" />
              <AppText variant="body" className="flex-1">
                {c}
              </AppText>
              <SpeakerButton text={c} speechKey={`dc:${entry.id}:${c}`} tone="plain" />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
