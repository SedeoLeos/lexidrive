/**
 * Immersive listening items generated from a lesson: the learner hears English
 * (native TTS, text hidden) and must understand it.
 */
export interface ListenChooseItem {
  kind: 'listen-choose';
  id: string;
  /** Spoken English word or phrase (hidden until answered). */
  audio: string;
  options: string[];
  answerIndex: number;
}

export interface DictationItem {
  kind: 'dictation';
  id: string;
  /** Sentence the learner hears and must type. */
  audio: string;
  /** French meaning, revealed as a gentle help after the attempt. */
  translation: string;
}

export type ListeningItem = ListenChooseItem | DictationItem;

export interface DictationResult {
  correct: boolean;
  /** 0 → 1 share of expected words found in the right order. */
  accuracy: number;
  /** Expected words with a flag telling whether the learner got each one. */
  words: { word: string; ok: boolean }[];
}

export interface ListeningSession {
  lessonId: string;
  lessonTitle: string;
  items: ListeningItem[];
}
