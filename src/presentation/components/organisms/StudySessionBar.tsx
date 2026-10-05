import { View } from 'react-native';
import { BOOTCAMP_MODULES } from '@/core/constants/bootcamp';
import { formatDuration } from '@/core/utils/date';
import { useStudySessionSnapshot } from '../../state/studySessionStore';
import { AppText } from '../atoms';

/** Discreet live indicator: the current module and how long this sitting has lasted. */
export function StudySessionBar() {
  const { activity, sessionSeconds } = useStudySessionSnapshot();
  if (!activity) return null;
  const label = BOOTCAMP_MODULES.find((m) => m.activity === activity)?.label ?? '';
  return (
    <View
      className="flex-row items-center gap-2 self-start rounded-full bg-brand-haze px-3.5 py-1.5"
      accessibilityLiveRegion="none"
    >
      <View className="h-1.5 w-1.5 rounded-full bg-brand" />
      <AppText variant="caption" tone="brand" className="text-xs">
        {label} · {sessionSeconds < 60 ? `${sessionSeconds} s` : formatDuration(sessionSeconds)}
      </AppText>
    </View>
  );
}
