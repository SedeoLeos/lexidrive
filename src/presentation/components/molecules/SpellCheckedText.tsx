import { Text } from 'react-native';
import type { SpellToken } from '@/domain/services';

export interface SpellCheckedTextProps {
  tokens: SpellToken[];
  onPressWord?: (token: SpellToken) => void;
  activeStart?: number | null;
}

/**
 * Renders the learner's English text with misspelled words softly underlined (dotted, muted rose).
 * Every word is tappable: misspelled ones open suggestions, others open the dictionary.
 */
export function SpellCheckedText({ tokens, onPressWord, activeStart = null }: SpellCheckedTextProps) {
  return (
    <Text className="font-light text-base leading-8 text-ink">
      {tokens.map((t) => {
        if (!t.isWord) return t.text;
        const active = activeStart === t.start;
        return (
          <Text
            key={t.start}
            onPress={onPressWord ? () => onPressWord(t) : undefined}
            suppressHighlighting
            className={`${t.misspelled ? 'text-danger underline' : ''} ${active ? 'bg-brand-mist' : ''}`}
            style={t.misspelled ? { textDecorationStyle: 'dotted', textDecorationColor: '#A65A5A' } : undefined}
          >
            {t.text}
          </Text>
        );
      })}
    </Text>
  );
}
