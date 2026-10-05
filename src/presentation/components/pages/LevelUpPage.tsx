import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LEVEL_META, type Level } from '@/core/constants/levels';
import { AppText, Button } from '../atoms';

/** Quiet, luxurious celebration once a level exam is passed. */
export function LevelUpPage({ level, score, maxScore }: { level: Level; score?: number; maxScore?: number }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const meta = LEVEL_META[level];
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    Animated.timing(fade, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <View className="flex-1 bg-canvas px-8" style={{ paddingTop: insets.top + 48, paddingBottom: insets.bottom + 32 }}>
      {/* Animated.View is not className-aware: layout lives on the inner View. */}
      <Animated.View
        style={{
          flex: 1,
          opacity: fade,
          transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
        }}
      >
        <View className="flex-1 justify-center gap-8">
          <AppText variant="overline" tone="muted">
            {meta.stage} · {meta.title}
          </AppText>
          <AppText variant="display" tone="brand" className="text-[140px] leading-[148px]">
            {level}
          </AppText>
          <View className="h-px w-16 bg-brand" />
          <AppText variant="title" className="leading-10" accessibilityRole="header">
            Félicitations, tu as atteint le niveau {level} !
          </AppText>
          <AppText variant="body" tone="muted">
            {meta.tagline}
          </AppText>
          {score !== undefined && maxScore ? (
            <AppText variant="caption" tone="soft">
              Examen réussi avec {score} / {maxScore}.
            </AppText>
          ) : null}
        </View>
      </Animated.View>
      <View className="gap-3">
        <Button label={`Découvrir le niveau ${level}`} fullWidth onPress={() => router.replace('/courses')} />
        <Button label="Retour à l'accueil" variant="ghost" fullWidth onPress={() => router.replace('/')} />
      </View>
    </View>
  );
}
