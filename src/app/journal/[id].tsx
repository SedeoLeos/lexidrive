import { Redirect, useLocalSearchParams } from 'expo-router';
import { JournalEntryPage } from '@/presentation/components/pages';

export default function JournalEntryRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) return <Redirect href="/journal" />;
  return <JournalEntryPage id={numericId} />;
}
