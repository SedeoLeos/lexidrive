import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import type { Flashcard } from '@/domain/entities';
import { useSpeech } from '../../hooks/useSpeech';
import { AppText, Pill } from '../atoms';
import { SpeakerButton } from '../molecules';

export interface FlashcardViewProps {
  card: Flashcard;
  revealed: boolean;
  onReveal: () => void;
  autoPlay: boolean;
}

/**
 * Memory card: English first (heard aloud in immersion mode), tap to reveal the meaning and
 * the example. Recalling before revealing is what makes the word stick.
 */
export function FlashcardView({ card, revealed, onReveal, autoPlay }: FlashcardViewProps) {
  const { speak } = useSpeech();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoPlay) void speak(card.english, `fc:${card.wordKey}`, { restart: true });
    // Only when a new card appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.wordKey]);

  useEffect(() => {
    fade.setValue(0);
    if (revealed)
      Animated.timing(fade, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
  }, [revealed, fade]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={revealed ? undefined : 'Touche pour voir la traduction'}
      onPress={onReveal}
      disabled={revealed}
      className="min-h-[340px] justify-between rounded-3xl bg-white px-7 py-8"
    >
      <View className="flex-row items-center justify-between">
        <Pill label={`${card.level} · boîte ${card.box}/5`} tone="neutral" />
        <SpeakerButton text={card.english} speechKey={`fc:${card.wordKey}`} size="md" />
      </View>

      <View className="items-center gap-4 py-6">
        <AppText variant="display" className="text-center text-5xl leading-[60px]">
          {card.english}
        </AppText>
        {revealed ? (
          <Animated.View style={{ opacity: fade, alignItems: 'center', gap: 12 }}>
            <AppText variant="heading" tone="brand" className="text-center">
              {card.french}
            </AppText>
            <AppText variant="body" tone="soft" className="text-center italic">
              {card.example}
            </AppText>
          </Animated.View>
        ) : (
          <AppText variant="caption" tone="faint">
            Essaie de te souvenir, puis touche la carte.
          </AppText>
        )}
      </View>
      <View />
    </Pressable>
  );
}
