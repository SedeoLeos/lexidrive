import { useLocalSearchParams } from 'expo-router';
import { QuizPage } from '@/presentation/components/pages';

export default function QuizRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <QuizPage lessonId={id} />;
}
