import { useLocalSearchParams } from 'expo-router';
import { LessonPage } from '@/presentation/components/pages';

export default function LessonRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <LessonPage id={id} />;
}
