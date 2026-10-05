import { View } from 'react-native';
import { AppText } from '../atoms';

export interface StatBlockProps {
  value: string;
  label: string;
  className?: string;
}

export function StatBlock({ value, label, className = '' }: StatBlockProps) {
  return (
    <View className={`gap-1 ${className}`}>
      <AppText variant="title" className="font-thin">
        {value}
      </AppText>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
    </View>
  );
}
