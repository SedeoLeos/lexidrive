import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { colors } from '@/core/theme/colors';
import { AppText, Icon, type IconName } from '../atoms';

/** Visual config for each tab route (file name in src/app/(tabs)). */
export const TAB_CONFIG: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Accueil', icon: 'home' },
  courses: { label: 'Cours', icon: 'book-open' },
  journal: { label: 'Journal', icon: 'feather' },
  dictionary: { label: 'Lexique', icon: 'search' },
  profile: { label: 'Profil', icon: 'user' },
};

/** Distance between the bar and the screen edges — also used by templates to pad content. */
export const TAB_BAR_HEIGHT = 68;
export const TAB_BAR_SIDE_GAP = 24;
export const TAB_BAR_BOTTOM_GAP = 16;

/**
 * Floating, fully rounded, centred bottom navigation.
 * Detached from the left, right and bottom edges; depth by tint (a cool veil over the warm canvas and white cards), no shadow.
 * The active tab becomes a brand capsule revealing its label.
 */
export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 items-center"
      style={{ bottom: Math.max(insets.bottom, 8) + TAB_BAR_BOTTOM_GAP, paddingHorizontal: TAB_BAR_SIDE_GAP }}
    >
      <View
        accessibilityRole="tablist"
        className="w-full max-w-[440px] flex-row items-center justify-between rounded-full bg-brand-veil px-2.5"
        style={{ height: TAB_BAR_HEIGHT }}
      >
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name];
          if (!config) return null;
          const focused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? config.label}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              className={`h-12 flex-row items-center justify-center rounded-full ${focused ? 'bg-brand px-4' : 'w-12'}`}
            >
              <Icon name={config.icon} size={19} color={focused ? colors.white : colors.inkMuted} />
              {focused ? (
                <AppText variant="caption" tone="inverse" className="ml-2 font-medium" numberOfLines={1}>
                  {config.label}
                </AppText>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
