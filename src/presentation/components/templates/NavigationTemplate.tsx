import { Tabs } from 'expo-router/tabs';
import { colors } from '@/core/theme/colors';
import { FloatingTabBar, TAB_CONFIG } from '../organisms';

/**
 * Global navigation template: the five main sections behind a floating, rounded,
 * centred bottom bar detached from the screen edges.
 */
export function NavigationTemplate() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        sceneStyle: { backgroundColor: colors.canvas },
      }}
    >
      {Object.entries(TAB_CONFIG).map(([name, { label }]) => (
        <Tabs.Screen key={name} name={name} options={{ title: label }} />
      ))}
    </Tabs>
  );
}
