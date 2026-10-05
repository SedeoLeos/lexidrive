import { Redirect, useLocalSearchParams } from 'expo-router';
import { isLevel } from '@/core/constants/levels';
import { LevelUpPage } from '@/presentation/components/pages';

export default function LevelUpRoute() {
  const { level, score, max } = useLocalSearchParams<{ level: string; score?: string; max?: string }>();
  if (!isLevel(level)) return <Redirect href="/" />;
  return (
    <LevelUpPage level={level} score={score ? Number(score) : undefined} maxScore={max ? Number(max) : undefined} />
  );
}
