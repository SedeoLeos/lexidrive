import type { ExamSeed } from '../types';
import { examFill, examMcq } from '../builders';

/**
 * Examen de passage A2 ➔ B1 : grammaire de base, structure des phrases simples
 * et vocabulaire quotidien.
 */
export const EXAM_A2_B1: ExamSeed = {
  id: 'exam-a2-b1',
  fromLevel: 'A2',
  toLevel: 'B1',
  title: 'Examen de passage A2 ➔ B1',
  description:
    "La porte d'entrée de l'autonomie : prétérit, comparatifs, prépositions, futur et structures simples. 80 % requis.",
  passRatio: 0.8,
  questions: [
    examMcq(
      'Grammaire',
      'Complète : « Yesterday we ___ to the beach. »',
      ['go', 'went', 'gone', 'have gone'],
      'went',
      '« Yesterday » = moment passé terminé → prétérit irrégulier : went.',
    ),
    examMcq(
      'Grammaire',
      'Question correcte :',
      ['Did you saw him?', 'Did you see him?', 'Have you see him yesterday?', 'You did see him?'],
      'Did you see him?',
      'Did + sujet + base verbale.',
    ),
    examMcq(
      'Grammaire',
      'Complète : « London is ___ than Paris. »',
      ['more big', 'bigger', 'biggest', 'more bigger'],
      'bigger',
      'Adjectif court : -ER (+ doublement de la consonne : big → bigger).',
    ),
    examMcq(
      'Grammaire',
      'Complète : « This is the ___ film I have ever seen. »',
      ['more interesting', 'most interesting', 'interestingest', 'much interesting'],
      'most interesting',
      "Superlatif d'un adjectif long : the most + adjectif.",
    ),
    examMcq(
      'Grammaire',
      "Complète : « I'm going ___ my grandparents this weekend. »",
      ['visit', 'to visit', 'visiting', 'visited'],
      'to visit',
      'Be going TO + base verbale pour une intention.',
    ),
    examMcq(
      'Grammaire',
      'Complète : « The meeting is ___ Monday ___ 10 a.m. »',
      ['in / at', 'on / at', 'at / on', 'on / in'],
      'on / at',
      'ON + jour, AT + heure.',
    ),
    examMcq(
      'Grammaire',
      "Complète : « She ___ English for two years. » (elle l'étudie encore)",
      ['studies', 'has studied', 'studied', 'is study'],
      'has studied',
      'Action commencée dans le passé et qui continue + FOR → present perfect.',
    ),
    examMcq(
      'Grammaire',
      'Complète : « Look! It ___. »',
      ['rains', 'is raining', 'rain', 'raining'],
      'is raining',
      '« Look! » = action en cours → présent continu.',
    ),
    examMcq(
      'Grammaire',
      "Complète : « You ___ smoke here. It's forbidden. »",
      ["mustn't", "don't have to", "needn't", "haven't to"],
      "mustn't",
      "Mustn't = interdiction. Don't have to = absence d'obligation (ce n'est pas nécessaire).",
    ),
    examMcq(
      'Grammaire',
      "Remets dans l'ordre : « always / late / is / he »",
      ['He is always late.', 'He always is late.', 'Always he is late.', 'He is late always.'],
      'He is always late.',
      'Adverbe de fréquence APRÈS le verbe be, AVANT les autres verbes (He always arrives late).',
    ),
    examMcq(
      'Grammaire',
      'Complète : « If it rains, we ___ at home. »',
      ['stay', 'will stay', 'would stay', 'stayed'],
      'will stay',
      'Condition réelle : if + présent → will + base.',
    ),
    examMcq(
      'Vocabulaire',
      '« Il y a trois jours » :',
      ['three days ago', 'since three days', 'there is three days', 'before three days'],
      'three days ago',
      'Durée + ago.',
    ),
    examMcq(
      'Vocabulaire',
      '« En face de la gare » :',
      ['in front of the station', 'opposite the station', 'next the station', 'face the station'],
      'opposite the station',
      "Opposite = de l'autre côté. In front of = devant.",
    ),
    examMcq(
      'Vocabulaire',
      '« Actually, I prefer tea » signifie :',
      [
        'Actuellement, je préfère le thé.',
        'En fait, je préfère le thé.',
        'Activement, je préfère le thé.',
        'Bientôt, je préférerai le thé.',
      ],
      'En fait, je préfère le thé.',
      'Faux ami : actually = en fait.',
    ),
    examMcq(
      'Vocabulaire',
      '« Descendre du train » :',
      ['get off the train', 'get down the train', 'go out the train', 'leave off the train'],
      'get off the train',
      'Get on / get off pour les transports en commun.',
    ),
    examFill('Orthographe', 'Écris le passé de « buy ».', 'Last week I ___ a new jacket.', 'bought', 'Buy → bought.'),
    examFill(
      'Orthographe',
      'Écris le mot manquant (hier).',
      '___ evening I cooked for my friends.',
      'Yesterday',
      'Y-E-S-T-E-R-D-A-Y.',
    ),
    examFill(
      'Orthographe',
      'Écris le mot manquant (vraiment).',
      'The film was ___ good.',
      'really',
      'Real + ly : deux L.',
    ),
    examFill(
      'Orthographe',
      'Écris le mot manquant (entre).',
      'The bank is ___ the café and the school.',
      'between',
      'B-E-T-W-E-E-N.',
    ),
    examFill(
      'Orthographe',
      'Écris le comparatif de « happy ».',
      'She is ___ now than last year.',
      'happier',
      "Y précédé d'une consonne → IER : happy → happier.",
    ),
  ],
};
