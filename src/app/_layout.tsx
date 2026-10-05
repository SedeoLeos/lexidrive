import '../../global.css';
import { Suspense, useEffect } from 'react';
import { View } from 'react-native';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
// Per-weight imports so only the five cuts we use are bundled.
import { Inter_200ExtraLight } from '@expo-google-fonts/inter/200ExtraLight';
import { Inter_300Light } from '@expo-google-fonts/inter/300Light';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { colors } from '@/core/theme/colors';
import { DATABASE_NAME, initializeDatabase } from '@/data/database/database';
import { ExpoNotificationService } from '@/data/services/ExpoNotificationService';
import { DependenciesProvider } from '@/presentation/di/DependenciesProvider';
import { SettingsProvider } from '@/presentation/state/SettingsProvider';
import { RewardProvider } from '@/presentation/state/RewardProvider';
import { LoadingState } from '@/presentation/components/molecules';

void SplashScreen.preventAutoHideAsync();
ExpoNotificationService.configureForegroundHandling();

/** Root: fonts → SQLite (migrations + offline content seed) → DI container → navigation. */
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Suspense
        fallback={
          <View className="flex-1 bg-canvas">
            <LoadingState label="Préparation de ton Bootcamp…" />
          </View>
        }
      >
        <SQLiteProvider databaseName={DATABASE_NAME} onInit={initializeDatabase} useSuspense>
          <DependenciesProvider>
            <SettingsProvider>
              <RewardProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.canvas },
                    animation: 'fade_from_bottom',
                  }}
                >
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="level-up/[level]" options={{ animation: 'fade', gestureEnabled: false }} />
                  <Stack.Screen name="welcome" options={{ animation: 'fade', gestureEnabled: false }} />
                </Stack>
              </RewardProvider>
            </SettingsProvider>
          </DependenciesProvider>
        </SQLiteProvider>
      </Suspense>
    </SafeAreaProvider>
  );
}
