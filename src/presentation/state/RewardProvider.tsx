import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '@/core/theme/colors';
import type { Reward } from '@/domain/entities';
import { AppText, Icon } from '../components/atoms';

interface RewardContextValue {
  /** Shows a discreet celebration for a reward (no-op for null or empty rewards). */
  celebrate: (reward: Reward | null | undefined) => void;
}

const RewardContext = createContext<RewardContextValue | null>(null);

const VISIBLE_MS = 3400;

/**
 * Global, quiet celebration layer: "+50 XP", experience level-ups and unlocked achievements
 * slide in from the top, one after the other. Tap to dismiss early.
 */
export function RewardProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [queue, setQueue] = useState<Reward[]>([]);
  const current = queue[0] ?? null;
  const anim = useRef(new Animated.Value(0)).current;

  const celebrate = useCallback((reward: Reward | null | undefined) => {
    if (!reward || (reward.points <= 0 && !reward.levelUp && reward.achievements.length === 0)) return;
    setQueue((q) => [...q, reward]);
  }, []);

  const dismiss = useCallback(() => {
    Animated.timing(anim, { toValue: 0, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(
      () => setQueue((q) => q.slice(1)),
    );
  }, [anim]);

  useEffect(() => {
    if (!current) return;
    const strong = current.levelUp || current.achievements.length > 0;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    const timer = setTimeout(dismiss, strong ? VISIBLE_MS + 1200 : VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [current, anim, dismiss]);

  const value = useMemo(() => ({ celebrate }), [celebrate]);

  return (
    <RewardContext.Provider value={value}>
      {children}
      {current ? (
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            top: insets.top + 10,
            opacity: anim,
            transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
          }}
        >
          <Pressable accessibilityRole="alert" accessibilityLabel="Récompense" onPress={dismiss}>
            <View className="gap-3 rounded-3xl bg-brand px-6 py-5">
              {current.points > 0 ? (
                <View className="flex-row items-center gap-3">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-brand-deep">
                    <Icon name="star" size={16} color={colors.white} />
                  </View>
                  <View className="flex-1">
                    <AppText variant="heading" tone="inverse" className="font-medium">
                      +{current.points} XP
                    </AppText>
                    <AppText variant="caption" tone="inverse" className="opacity-80">
                      {current.reason}
                    </AppText>
                  </View>
                </View>
              ) : null}
              {current.levelUp ? (
                <View className="flex-row items-center gap-3">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-brand-deep">
                    <Icon name="trending-up" size={16} color={colors.white} />
                  </View>
                  <AppText variant="subheading" tone="inverse" className="flex-1">
                    Niveau {current.levelUp.level} atteint · {current.levelUp.title}
                  </AppText>
                </View>
              ) : null}
              {current.achievements.map((a) => (
                <View key={a.id} className="flex-row items-center gap-3">
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-white">
                    <Icon name={a.icon} size={16} color={colors.brand} />
                  </View>
                  <View className="flex-1">
                    <AppText variant="subheading" tone="inverse">
                      Succès débloqué : {a.title}
                    </AppText>
                    <AppText variant="caption" tone="inverse" className="opacity-80">
                      {a.description}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>
          </Pressable>
        </Animated.View>
      ) : null}
    </RewardContext.Provider>
  );
}

export function useRewards(): RewardContextValue {
  const value = useContext(RewardContext);
  if (!value) throw new Error('useRewards must be used inside <RewardProvider>.');
  return value;
}
