import { Pressable } from 'react-native';
import { AppText } from '../atoms';

export interface WordTileProps {
  word: string;
  placed?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

/** Tap-to-place word chip for sentence re-ordering quizzes. */
export function WordTile({ word, placed = false, onPress, disabled }: WordTileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={word}
      disabled={disabled}
      onPress={onPress}
      className={`rounded-full px-4 py-2.5 active:opacity-70 ${placed ? 'bg-brand' : 'bg-surface'}`}
    >
      <AppText variant="body" tone={placed ? 'inverse' : 'ink'} className="font-sans">
        {word}
      </AppText>
    </Pressable>
  );
}
