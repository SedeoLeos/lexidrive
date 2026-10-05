import { View } from 'react-native';
import { AppText } from '../atoms';
import { RevealText } from './RevealText';
import { SpeakerButton } from './SpeakerButton';

export interface PhraseRowProps {
  english: string;
  french?: string;
  hideTranslation?: boolean;
}

export function PhraseRow({ english, french, hideTranslation = false }: PhraseRowProps) {
  return (
    <View className="flex-row items-center gap-4 rounded-3xl bg-surface px-5 py-5">
      <View className="flex-1 gap-1">
        <AppText variant="bodyStrong" className="font-sans">
          {english}
        </AppText>
        {french ? <RevealText variant="caption" tone="muted" text={french} hidden={hideTranslation} /> : null}
      </View>
      <SpeakerButton text={english} tone="plain" size="md" />
    </View>
  );
}
