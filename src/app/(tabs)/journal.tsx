import { useLocalSearchParams } from 'expo-router';
import { JournalPage } from '@/presentation/components/pages';

export default function JournalRoute() {
  const { lesson } = useLocalSearchParams<{ lesson?: string }>();
  return <JournalPage lessonId={lesson || undefined} />;
}
