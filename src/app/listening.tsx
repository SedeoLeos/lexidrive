import { useLocalSearchParams } from 'expo-router';
import { ListeningPage } from '@/presentation/components/pages';

export default function ListeningRoute() {
  const { lesson } = useLocalSearchParams<{ lesson?: string }>();
  return <ListeningPage lessonId={lesson || undefined} />;
}
