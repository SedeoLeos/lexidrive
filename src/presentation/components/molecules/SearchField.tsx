import { forwardRef } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { colors } from '@/core/theme/colors';
import { Icon } from '../atoms';

export interface SearchFieldProps extends TextInputProps {
  onClear?: () => void;
}

export const SearchField = forwardRef<TextInput, SearchFieldProps>(function SearchField(
  { value, onClear, ...props },
  ref,
) {
  return (
    <View className="flex-row items-center gap-3 rounded-full bg-surface px-5">
      <Icon name="search" size={18} color={colors.inkMuted} />
      <TextInput
        ref={ref}
        value={value}
        placeholderTextColor={colors.inkFaint}
        selectionColor={colors.brand}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        className="flex-1 py-4 font-light text-base text-ink"
        {...props}
      />
      {value && onClear ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Effacer" onPress={onClear} hitSlop={10}>
          <Icon name="x" size={18} color={colors.inkMuted} />
        </Pressable>
      ) : null}
    </View>
  );
});
