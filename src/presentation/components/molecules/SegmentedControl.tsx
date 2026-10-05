import { Pressable, View } from 'react-native';
import { AppText } from '../atoms';

export interface Segment<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string> {
  segments: readonly Segment<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/** Pill-in-pill selector: the active segment is a solid brand capsule. */
export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  className = '',
}: SegmentedControlProps<T>) {
  return (
    <View accessibilityRole="tablist" className={`flex-row rounded-full bg-surface p-1.5 ${className}`}>
      {segments.map((s) => {
        const active = s.value === value;
        return (
          <Pressable
            key={s.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(s.value)}
            className={`flex-1 items-center rounded-full py-2.5 ${active ? 'bg-brand' : ''}`}
          >
            <AppText variant="caption" tone={active ? 'inverse' : 'soft'} className={active ? 'font-medium' : ''}>
              {s.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
