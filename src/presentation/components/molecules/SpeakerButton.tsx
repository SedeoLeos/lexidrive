import { useSpeech } from '../../hooks/useSpeech';
import { IconButton } from '../atoms';

export interface SpeakerButtonProps {
  text: string;
  /** Distinguishes two buttons reading the same text. */
  speechKey?: string;
  size?: 'sm' | 'md';
  tone?: 'surface' | 'plain';
}

/** 🔊 Reads `text` aloud offline with the UK/US accent chosen in settings. Tap again to stop. */
export function SpeakerButton({ text, speechKey, size = 'sm', tone = 'surface' }: SpeakerButtonProps) {
  const { speak, speakingKey } = useSpeech();
  const key = speechKey ?? text;
  const active = speakingKey === key;
  return (
    <IconButton
      icon={active ? 'pause' : 'volume-2'}
      label={active ? 'Arrêter la lecture' : `Écouter : ${text.slice(0, 40)}`}
      size={size}
      tone={tone}
      active={active}
      disabled={!text.trim()}
      onPress={() => void speak(text, key)}
    />
  );
}
