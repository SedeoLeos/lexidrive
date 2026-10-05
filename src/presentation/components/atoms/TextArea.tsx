import { forwardRef } from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { colors } from '@/core/theme/colors';

export interface TextAreaProps extends TextInputProps {
  className?: string;
  minHeight?: number;
}

/** Borderless writing field floating on a soft tint. */
export const TextArea = forwardRef<TextInput, TextAreaProps>(function TextArea(
  { className = '', minHeight = 140, style, ...props },
  ref,
) {
  return (
    <TextInput
      ref={ref}
      multiline
      textAlignVertical="top"
      placeholderTextColor={colors.inkFaint}
      selectionColor={colors.brand}
      className={`rounded-3xl bg-surface px-6 py-5 font-light text-base leading-7 text-ink ${className}`}
      style={[{ minHeight }, style]}
      {...props}
    />
  );
});
