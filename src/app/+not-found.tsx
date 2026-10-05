import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { EmptyState } from '@/presentation/components/molecules';

export default function NotFound() {
  const router = useRouter();
  return (
    <View className="flex-1 justify-center bg-canvas">
      <EmptyState
        icon="compass"
        title="Page introuvable"
        actionLabel="Retour à l'accueil"
        onAction={() => router.replace('/')}
      />
    </View>
  );
}
