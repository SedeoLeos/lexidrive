import { View } from 'react-native';
import type { VocabularyItem } from '@/domain/entities';
import { AppText } from '../atoms';
import { RevealText } from './RevealText';
import { SpeakerButton } from './SpeakerButton';

export interface VocabularyRowProps {
  item: VocabularyItem;
  index: number;
  /** Immersion mode: translation hidden until tapped. */
  hideTranslation?: boolean;
}

/** Word | traduction | exemple — with pronunciation for both the word and the sentence. */
export function VocabularyRow({ item, index, hideTranslation = false }: VocabularyRowProps) {
  return (
    <View className="gap-3 py-5">
      <View className="flex-row items-center gap-4">
        <AppText variant="caption" tone="faint" className="w-6">
          {String(index + 1).padStart(2, '0')}
        </AppText>
        <View className="flex-1">
          <AppText variant="heading" className="font-sans">
            {item.english}
          </AppText>
          <RevealText variant="caption" tone="muted" text={item.french} hidden={hideTranslation} />
        </View>
        <SpeakerButton text={item.english} speechKey={`w:${item.english}`} />
      </View>
      <View className="ml-10 flex-row items-center gap-3 rounded-2xl bg-surface px-4 py-3">
        <AppText variant="caption" tone="soft" className="flex-1 italic">
          {item.example}
        </AppText>
        <SpeakerButton text={item.example} speechKey={`e:${item.example}`} tone="plain" />
      </View>
    </View>
  );
}
