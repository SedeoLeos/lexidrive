import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AppText, IconButton } from '../atoms';
import { StudySessionBar } from '../organisms';

export interface FocusTemplateProps {
  title?: string;
  children: ReactNode;
  /** Shows the live study timer (study screens). */
  showSession?: boolean;
  onClose?: () => void;
  closeIcon?: 'arrow-left' | 'x';
  right?: ReactNode;
  scrollRef?: React.RefObject<ScrollView | null>;
}

/** Distraction-free layout for lessons, quizzes and exams (no tab bar). */
export function FocusTemplate({
  title,
  children,
  showSession = true,
  onClose,
  closeIcon = 'arrow-left',
  right,
  scrollRef,
}: FocusTemplateProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const close = onClose ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-canvas">
      <View className="flex-row items-center gap-4 px-6 pb-3" style={{ paddingTop: insets.top + 12 }}>
        <IconButton icon={closeIcon} label={closeIcon === 'x' ? 'Fermer' : 'Retour'} size="sm" onPress={close} />
        <View className="flex-1 gap-1">
          {title ? (
            <AppText variant="overline" tone="muted" numberOfLines={1}>
              {title}
            </AppText>
          ) : null}
          {showSession ? <StudySessionBar /> : null}
        </View>
        {right}
      </View>
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: insets.bottom + 48 }}
      >
        <View className="gap-10 px-6">{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
