import { View } from 'react-native';
import { AppText, IconButton } from '../atoms';

export interface StepperProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  onChange: (value: number) => void;
  label: string;
  wrap?: boolean;
}

export function Stepper({ value, min, max, step = 1, format = String, onChange, label, wrap = true }: StepperProps) {
  const dec = () => onChange(value - step < min ? (wrap ? max : min) : value - step);
  const inc = () => onChange(value + step > max ? (wrap ? min : max) : value + step);
  return (
    <View className="flex-row items-center gap-3" accessibilityLabel={label}>
      <IconButton icon="minus" label={`Diminuer ${label}`} size="sm" onPress={dec} />
      <AppText variant="heading" className="w-12 text-center font-sans">
        {format(value)}
      </AppText>
      <IconButton icon="plus" label={`Augmenter ${label}`} size="sm" onPress={inc} />
    </View>
  );
}
