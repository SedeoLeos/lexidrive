import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { AppText, type AppTextProps } from '../atoms';

export interface RevealTextProps extends Omit<AppTextProps, 'children'> {
  text: string;
  /** When true (immersion mode) the text stays hidden until tapped. */
  hidden: boolean;
  placeholder?: string;
}

/** Immersion helper: the French stays veiled so the learner thinks in English first. */
export function RevealText({ text, hidden, placeholder = 'Toucher pour traduire', ...textProps }: RevealTextProps) {
  const [shown, setShown] = useState(!hidden);
  useEffect(() => setShown(!hidden), [hidden, text]);
  if (shown) return <AppText {...textProps}>{text}</AppText>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Afficher la traduction"
      onPress={() => setShown(true)}
      hitSlop={6}
    >
      <AppText {...textProps} tone="brand" className={`${textProps.className ?? ''} opacity-70`}>
        {placeholder}
      </AppText>
    </Pressable>
  );
}
