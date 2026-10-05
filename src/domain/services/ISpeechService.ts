import type { Accent } from '../entities';

export interface SpeakOptions {
  accent: Accent;
  rate: number;
  onDone?: () => void;
}

/** Offline text-to-speech using the device's native engine. */
export interface ISpeechService {
  speak(text: string, options: SpeakOptions): Promise<void>;
  stop(): Promise<void>;
  isSpeaking(): Promise<boolean>;
}
