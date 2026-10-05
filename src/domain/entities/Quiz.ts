/**
 * Quiz bank items. Three pedagogical categories:
 *  - A  vocabulary  (synonyms, reverse definitions, associations)
 *  - B  grammar     (tense, prepositions, word order)
 *  - C  spelling    (type the missing word, correct a deliberate typo)
 */
export type QuizCategory = 'vocabulary' | 'grammar' | 'spelling';

interface QuizBase {
  id: string;
  category: QuizCategory;
  prompt: string;
  /** Why the answer is correct / why the usual mistake is wrong (French). */
  explanation: string;
}

/** Multiple choice: exactly one correct option among (usually) four. */
export interface McqQuiz extends QuizBase {
  kind: 'mcq';
  options: string[];
  answerIndex: number;
}

/** Put the words back in order. `words` is the correct order; the UI shuffles it. */
export interface ReorderQuiz extends QuizBase {
  kind: 'reorder';
  words: string[];
}

/** Type the missing word(s). `text` contains a single "___" gap. */
export interface FillQuiz extends QuizBase {
  kind: 'fill';
  text: string;
  answers: string[];
}

/** A short paragraph contains one misspelled word: type the corrected word. */
export interface CorrectQuiz extends QuizBase {
  kind: 'correct';
  text: string;
  wrong: string;
  answers: string[];
}

export type Quiz = McqQuiz | ReorderQuiz | FillQuiz | CorrectQuiz;

/** What the learner submitted for one quiz. */
export type QuizResponse =
  | { kind: 'mcq'; index: number }
  | { kind: 'reorder'; words: string[] }
  | { kind: 'fill'; text: string }
  | { kind: 'correct'; text: string };

export interface QuizEvaluation {
  correct: boolean;
  /** Canonical correct answer, displayed after the attempt. */
  expected: string;
}
