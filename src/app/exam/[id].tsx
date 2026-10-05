import { useLocalSearchParams } from 'expo-router';
import { ExamPage } from '@/presentation/components/pages';

export default function ExamRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ExamPage examId={id} />;
}
