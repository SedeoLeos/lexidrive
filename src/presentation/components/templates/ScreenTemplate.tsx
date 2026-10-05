import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_BOTTOM_GAP, TAB_BAR_HEIGHT } from '../organisms';

export interface ScreenTemplateProps {
  children: ReactNode;
  header?: ReactNode;
  /** Reserve room for the floating tab bar (tab screens). */
  withTabBar?: boolean;
  scrollProps?: ScrollViewProps;
}

/**
 * Base layout for tab screens: airy horizontal gutters, generous vertical rhythm,
 * content scrolls beneath the floating bar.
 */
export function ScreenTemplate({ children, header, withTabBar = true, scrollProps }: ScreenTemplateProps) {
  const insets = useSafeAreaInsets();
  const bottom = withTabBar
    ? TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_GAP + Math.max(insets.bottom, 8) + 40
    : insets.bottom + 40;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-canvas">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 28, paddingBottom: bottom }}
        {...scrollProps}
      >
        <View className="gap-12 px-6">
          {header}
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
