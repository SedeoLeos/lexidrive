import type { ISpellChecker, SpellToken } from '@/domain/services';
import { isWordCorrect, rankSuggestions, tokenizeText } from '@/domain/logic/spelling';

/**
 * Offline English spell checker backed by the SCOWL lexicon bundled with the app,
 * extended at runtime with every dictionary headword and the learner's custom words.
 */
export class LocalSpellChecker implements ISpellChecker {
  private readonly lexicon = new Set<string>();
  /** Words bucketed by length for fast suggestion lookup. */
  private readonly byLength = new Map<number, string[]>();
  private loading: Promise<void> | null = null;

  ready(): Promise<void> {
    if (!this.loading) {
      this.loading = (async () => {
        // Lazy import keeps the ~650 KB lexicon out of the startup path.
        const { LEXICON } = await import('../content/spelling/lexicon');
        this.addWords(LEXICON.split('\n'));
        this.addWords(['a', 'ok', 'email', 'emails', 'online', 'offline', 'wifi', 'smartphone', 'app', 'apps']);
      })();
    }
    return this.loading;
  }

  addWords(words: Iterable<string>): void {
    for (const raw of words) {
      const w = raw.trim().toLowerCase();
      if (!w || this.lexicon.has(w)) continue;
      this.lexicon.add(w);
      const bucket = this.byLength.get(w.length);
      if (bucket) bucket.push(w);
      else this.byLength.set(w.length, [w]);
    }
  }

  isCorrect(word: string): boolean {
    // Until the lexicon is loaded, never flag anything (avoids a flash of red underlines).
    if (this.lexicon.size === 0) return true;
    return isWordCorrect(word, this.lexicon);
  }

  tokenize(text: string): SpellToken[] {
    return tokenizeText(text, (w) => this.isCorrect(w));
  }

  suggest(word: string, max = 4): string[] {
    const len = word.length;
    const candidates: string[] = [];
    for (let l = Math.max(1, len - 2); l <= len + 2; l++) {
      const bucket = this.byLength.get(l);
      if (bucket) candidates.push(...bucket);
    }
    return rankSuggestions(word, candidates, max);
  }
}
