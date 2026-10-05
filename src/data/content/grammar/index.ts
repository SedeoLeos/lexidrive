import { library } from './helpers';
import { GRAMMAR_A1 } from './a1';
import { GRAMMAR_A2 } from './a2';
import { GRAMMAR_B1 } from './b1';
import { GRAMMAR_B2 } from './b2';
import { GRAMMAR_C1 } from './c1';
import { GRAMMAR_C2 } from './c2';

/** The whole grammar library, indexed by point id (e.g. "b1-passive"). */
export const GRAMMAR_LIBRARY = library([
  ...GRAMMAR_A1,
  ...GRAMMAR_A2,
  ...GRAMMAR_B1,
  ...GRAMMAR_B2,
  ...GRAMMAR_C1,
  ...GRAMMAR_C2,
]);
