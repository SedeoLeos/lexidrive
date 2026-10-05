import { Redirect } from 'expo-router';
import { NavigationTemplate } from '@/presentation/components/templates';
import { useSettings } from '@/presentation/state/SettingsProvider';

export default function TabsLayout() {
  const { settings, loaded } = useSettings();
  // First launch: a short welcome flow before the main app.
  if (loaded && !settings.onboarded) return <Redirect href="/welcome" />;
  return <NavigationTemplate />;
}
