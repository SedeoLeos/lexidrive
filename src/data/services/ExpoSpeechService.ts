import * as Speech from 'expo-speech';
import type { Accent } from '@/domain/entities';
import type { ISpeechService, SpeakOptions } from '@/domain/services';

/**
 * Offline TTS through the platform engine (AVSpeechSynthesizer / Android TextToSpeech).
 * Picks the best installed voice for the requested accent (enhanced quality first).
 */
export class ExpoSpeechService implements ISpeechService {
  private voicesByAccent: Partial<Record<Accent, string | null>> = {};
  private voicesLoaded: Promise<Speech.Voice[]> | null = null;

  private async loadVoices(): Promise<Speech.Voice[]> {
    if (!this.voicesLoaded) {
      this.voicesLoaded = Speech.getAvailableVoicesAsync().catch(() => []);
    }
    return this.voicesLoaded;
  }

  private async resolveVoice(accent: Accent): Promise<string | undefined> {
    if (accent in this.voicesByAccent) return this.voicesByAccent[accent] ?? undefined;
    const voices = await this.loadVoices();
    const wanted = accent.toLowerCase();
    const candidates = voices.filter((v) => v.language.replace('_', '-').toLowerCase() === wanted);
    const best = candidates.find((v) => v.quality === Speech.VoiceQuality.Enhanced) ?? candidates[0] ?? null;
    this.voicesByAccent[accent] = best?.identifier ?? null;
    return best?.identifier;
  }

  async speak(text: string, { accent, rate, onDone }: SpeakOptions): Promise<void> {
    const chunks = splitForSpeech(text, Speech.maxSpeechInputLength || 4000);
    const voice = await this.resolveVoice(accent);
    chunks.forEach((chunk, i) => {
      const isLast = i === chunks.length - 1;
      Speech.speak(chunk, {
        language: accent,
        voice,
        rate,
        pitch: 1,
        onDone: isLast ? onDone : undefined,
        onStopped: isLast ? onDone : undefined,
        onError: isLast ? onDone : undefined,
      });
    });
  }

  stop(): Promise<void> {
    return Speech.stop();
  }

  isSpeaking(): Promise<boolean> {
    return Speech.isSpeakingAsync();
  }
}

/** Splits long journal texts on sentence boundaries so they fit the engine's input limit. */
export function splitForSpeech(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) return [text];
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) ?? [text];
  const chunks: string[] = [];
  let current = '';
  for (const s of sentences) {
    if ((current + s).length > maxLength && current) {
      chunks.push(current.trim());
      current = '';
    }
    if (s.length > maxLength) {
      for (let i = 0; i < s.length; i += maxLength) chunks.push(s.slice(i, i + maxLength));
    } else {
      current += s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
