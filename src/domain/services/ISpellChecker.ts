export interface SpellToken {
  /** Raw text of the token, including punctuation/whitespace runs. */
  text: string;
  isWord: boolean;
  misspelled: boolean;
  /** Offset in the original string. */
  start: number;
}

/** Offline English spell checker. */
export interface ISpellChecker {
  /** Loads the lexicon (idempotent). */
  ready(): Promise<void>;
  addWords(words: Iterable<string>): void;
  isCorrect(word: string): boolean;
  tokenize(text: string): SpellToken[];
  suggest(word: string, max?: number): string[];
}
