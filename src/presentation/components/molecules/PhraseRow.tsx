import { View } from 'react-native';
import { AppText } from '../atoms';
import { SpeakerButton } from './SpeakerButton';

export interface PhraseRowProps {
  english: string;
  french?: string;
}

export function PhraseRow({ english, french }: PhraseRowProps) {
  return (
    <View className="flex-row items-center gap-4 rounded-3xl bg-surface px-5 py-5">
      <View className="flex-1 gap-1">
        <AppText variant="bodyStrong" className="font-sans">
          {english}
        </AppText>
        {french ? (
          <AppText variant="caption" tone="muted">
            {french}
          </AppText>
        ) : null}
      </View>
      <SpeakerButton text={english} tone="plain" size="md" />
    </View>
  );
}
