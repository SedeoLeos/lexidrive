import type { JournalPromptSeed } from '../types';

/**
 * Consignes générales du « Journal de Vie & Débat », en rotation quotidienne.
 * Elles alternent récit de vie (production personnelle) et débat d'opinion.
 */
const life = (n: number, text: string): JournalPromptSeed => ({
  id: `life-${String(n).padStart(2, '0')}`,
  kind: 'life',
  text,
});
const debate = (n: number, text: string): JournalPromptSeed => ({
  id: `debate-${String(n).padStart(2, '0')}`,
  kind: 'debate',
  text,
});

export const GENERAL_JOURNAL_PROMPTS: JournalPromptSeed[] = [
  life(
    1,
    "Raconte ta journée d'hier, du réveil au coucher : ce que tu as fait, avec qui, et le moment que tu as préféré.",
  ),
  debate(1, 'Le télétravail rend-il les gens plus heureux ou plus isolés ? Donne ton avis avec deux arguments.'),
  life(
    2,
    "Qu'as-tu acheté cette semaine (marché, magasin, en ligne) ? Raconte un achat, son prix et pourquoi tu l'as choisi.",
  ),
  debate(2, 'Faut-il rendre les transports en commun gratuits ? Pèse le pour et le contre.'),
  life(3, "Décris ta routine du matin en détail. Qu'aimerais-tu y changer et pourquoi ?"),
  debate(3, 'Les réseaux sociaux rapprochent-ils ou éloignent-ils les gens ?'),
  life(4, "Raconte une conversation importante que tu as eue récemment. Qu'as-tu dit ? Qu'aurais-tu aimé dire ?"),
  debate(4, 'Vaut-il mieux vivre en ville ou à la campagne ? Défends ta position.'),
  life(5, "Décris ton travail ou tes études à quelqu'un qui ne connaît rien à ton domaine."),
  debate(5, "L'école devrait-elle enseigner la gestion de l'argent dès le collège ?"),
  life(6, 'Raconte un problème que tu as résolu cette semaine. Comment as-tu fait ?'),
  debate(6, "Faut-il limiter le temps d'écran des adultes autant que celui des enfants ?"),
  life(7, 'Quel est ton meilleur souvenir de voyage ? Décris les lieux, les gens, les odeurs.'),
  debate(7, 'Le sport professionnel paie-t-il trop bien ses champions ?'),
  life(8, "Décris une personne qui t'inspire et explique ce qu'elle t'a appris."),
  debate(8, "L'intelligence artificielle va-t-elle créer plus d'emplois qu'elle n'en détruit ?"),
  life(9, "Raconte un repas que tu as cuisiné ou partagé récemment : la recette, les invités, l'ambiance."),
  debate(9, 'Faut-il apprendre une langue étrangère dès la maternelle ?'),
  life(10, 'Quelles sont tes trois priorités pour le mois prochain ? Explique comment tu vas les atteindre.'),
  debate(10, 'Le travail de quatre jours par semaine devrait-il devenir la norme ?'),
  life(11, 'Décris ton quartier à un ami étranger qui va venir te rendre visite.'),
  debate(11, "Les touristes abîment-ils les villes qu'ils aiment ?"),
  life(12, 'Raconte un moment où tu as eu peur, ou où tu as été très fier de toi.'),
  debate(12, 'Doit-on interdire les voitures dans les centres-villes ?'),
  life(13, "Raconte ta dernière dispute ou ton dernier désaccord : comment l'as-tu géré ?"),
  debate(13, 'La réussite dépend-elle davantage du talent ou du travail ?'),
  life(14, 'Décris ce que tu feras ce week-end, heure par heure, au futur.'),
  debate(14, "Faut-il payer les étudiants pour qu'ils étudient ?"),
  life(15, 'Écris une lettre à toi-même dans cinq ans : où seras-tu, que feras-tu en anglais ?'),
  debate(15, 'Les livres papier vont-ils disparaître ? Est-ce grave ?'),
];
