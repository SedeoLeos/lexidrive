import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { colors } from '@/core/theme/colors';

export interface TextFieldProps extends TextInputProps {
  className?: string;
}

/** Single-line input, pill-shaped, used for typed quiz answers. */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField({ className = '', ...props }, ref) {
  return (
    <TextInput
      ref={ref}
      placeholderTextColor={colors.inkFaint}
      selectionColor={colors.brand}
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      className={`rounded-full bg-surface px-6 py-4 font-light text-lg text-ink ${className}`}
      {...props}
    />
  );
});
