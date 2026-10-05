import { isLevel } from '@/core/constants/levels';
import type { DictionarySeed } from '../types';

/**
 * Socle lexical : les mots anglais les plus fréquents, avec traduction française.
 * Format compact « mot | nature | traduction | niveau » (une entrée par ligne), parsé au chargement.
 * Les leçons, mots piliers et idiomes viennent enrichir ce socle dans la table `dictionary`.
 */
const RAW = `
be|verb|être|A1
have|verb|avoir|A1
do|verb|faire (activité, tâche)|A1
say|verb|dire (quelque chose)|A1
go|verb|aller|A1
get|verb|obtenir, recevoir, devenir|A1
know|verb|savoir, connaître|A1
think|verb|penser, croire|A1
take|verb|prendre|A1
see|verb|voir|A1
come|verb|venir|A1
look|verb|regarder, sembler|A1
give|verb|donner|A1
use|verb|utiliser|A1
find|verb|trouver|A1
work|verb / noun|travailler ; travail|A1
call|verb|appeler|A1
try|verb|essayer|A1
feel|verb|ressentir, se sentir|A1
leave|verb|partir, quitter, laisser|A1
put|verb|mettre, poser|A1
mean|verb|signifier, vouloir dire|A1
keep|verb|garder, continuer|A2
let|verb|laisser, permettre|A2
begin|verb|commencer|A1
start|verb|commencer, démarrer|A1
help|verb / noun|aider ; aide|A1
talk|verb|parler, discuter|A1
speak|verb|parler (une langue)|A1
turn|verb|tourner|A1
show|verb|montrer|A1
hear|verb|entendre|A1
listen|verb|écouter|A1
play|verb|jouer|A1
run|verb|courir, diriger|A1
move|verb|bouger, déménager|A2
believe|verb|croire|A2
bring|verb|apporter, amener|A2
happen|verb|arriver, se produire|A2
write|verb|écrire|A1
read|verb|lire|A1
sit|verb|s'asseoir|A1
stand|verb|être debout, supporter|A2
lose|verb|perdre|A2
win|verb|gagner (compétition)|A2
learn|verb|apprendre (étudier)|A1
teach|verb|enseigner, apprendre à quelqu'un|A1
understand|verb|comprendre|A1
change|verb / noun|changer ; changement, monnaie|A2
follow|verb|suivre|A2
stop|verb|arrêter, s'arrêter|A1
create|verb|créer|B1
spend|verb|dépenser, passer (du temps)|A2
grow|verb|grandir, cultiver|A2
open|verb / adjective|ouvrir ; ouvert|A1
close|verb / adjective|fermer ; proche|A1
walk|verb|marcher|A1
offer|verb / noun|offrir, proposer ; offre|B1
remember|verb|se souvenir de|A2
love|verb / noun|aimer, adorer ; amour|A1
like|verb|aimer bien|A1
hate|verb|détester|A1
consider|verb|considérer, envisager|B1
appear|verb|apparaître, sembler|B1
send|verb|envoyer|A2
expect|verb|s'attendre à, attendre|B1
build|verb|construire|A2
stay|verb|rester, séjourner|A2
fall|verb|tomber|A2
cut|verb|couper|A2
reach|verb|atteindre|B1
kill|verb|tuer|A2
decide|verb|décider|A2
explain|verb|expliquer|A2
develop|verb|développer|B1
carry|verb|porter, transporter|A2
drive|verb|conduire|A1
break|verb|casser, rompre|A2
receive|verb|recevoir|A2
choose|verb|choisir|A2
sleep|verb|dormir|A1
eat|verb|manger|A1
drink|verb|boire|A1
wear|verb|porter (vêtement)|A2
forget|verb|oublier|A2
answer|verb / noun|répondre ; réponse|A1
travel|verb|voyager|A1
arrive|verb|arriver|A1
return|verb|revenir, rendre|A2
improve|verb|améliorer|B1
increase|verb / noun|augmenter ; hausse|B1
reduce|verb|réduire|B1
prefer|verb|préférer|A2
hope|verb / noun|espérer ; espoir|A2
worry|verb|s'inquiéter|A2
share|verb|partager|A2
fix|verb|réparer, fixer|B1
avoid|verb|éviter|B1
allow|verb|permettre, autoriser|B1
manage|verb|gérer, réussir à|B1
provide|verb|fournir|B1
require|verb|exiger, nécessiter|B2
suggest|verb|suggérer, proposer|B1
prove|verb|prouver|B1
compare|verb|comparer|B1
describe|verb|décrire|A2
discuss|verb|discuter de (sans « about »)|B1
argue|verb|se disputer, soutenir que|B1
borrow|verb|emprunter|A2
enjoy|verb|apprécier, aimer|A2
invite|verb|inviter|A2
join|verb|rejoindre|A2
plan|verb / noun|prévoir ; plan|A2
prepare|verb|préparer|A2
protect|verb|protéger|B1
replace|verb|remplacer|B1
solve|verb|résoudre|B1
succeed|verb|réussir|B1
fail|verb|échouer|B1
measure|verb|mesurer|B1
deliver|verb|livrer|B1
order|verb / noun|commander ; commande, ordre|A2
book|verb / noun|réserver ; livre|A2
cancel|verb|annuler|B1
time|noun|temps, fois, heure|A1
year|noun|année, an|A1
day|noun|jour, journée|A1
week|noun|semaine|A1
month|noun|mois|A1
morning|noun|matin, matinée|A1
evening|noun|soir, soirée|A1
night|noun|nuit|A1
today|adverb|aujourd'hui|A1
tomorrow|adverb|demain|A1
people|noun|gens, personnes|A1
man|noun|homme|A1
woman|noun|femme|A1
child|noun|enfant|A1
world|noun|monde|A1
life|noun|vie|A1
hand|noun|main|A1
part|noun|partie|A2
place|noun|endroit, lieu|A1
case|noun|cas|B1
company|noun|entreprise, compagnie|A2
system|noun|système|B1
program|noun|programme|A2
question|noun|question|A1
government|noun|gouvernement|B1
number|noun|nombre, numéro|A1
point|noun|point, argument|B1
home|noun|maison, chez-soi|A1
house|noun|maison|A1
room|noun|pièce, chambre, place|A1
money|noun|argent|A1
fact|noun|fait|B1
water|noun|eau|A1
food|noun|nourriture|A1
problem|noun|problème|A1
idea|noun|idée|A2
business|noun|affaires, entreprise|A2
side|noun|côté|A2
head|noun|tête|A1
eye|noun|œil|A1
face|noun|visage|A1
body|noun|corps|A1
health|noun|santé|A2
school|noun|école|A1
car|noun|voiture|A1
train|noun|train|A1
plane|noun|avion|A1
road|noun|route|A1
door|noun|porte|A1
window|noun|fenêtre|A1
table|noun|table, tableau|A1
phone|noun|téléphone|A1
computer|noun|ordinateur|A1
email|noun|e-mail, courriel|A1
word|noun|mot|A1
language|noun|langue, langage|A1
story|noun|histoire|A2
news|noun|nouvelles, informations (indénombrable)|A2
information|noun|informations (indénombrable)|A2
advice|noun|conseil(s) (indénombrable)|A2
furniture|noun|meubles (indénombrable)|B1
luggage|noun|bagages (indénombrable)|A2
weather|noun|temps (météo)|A1
holiday|noun|vacances, jour férié|A1
trip|noun|voyage, excursion|A2
journey|noun|trajet, voyage|B1
team|noun|équipe|A2
boss|noun|patron, chef|A2
customer|noun|client (magasin)|A2
client|noun|client (services)|B1
employee|noun|employé|A2
office|noun|bureau|A1
meeting room|noun|salle de réunion|A2
project|noun|projet|A2
goal|noun|objectif, but|B1
result|noun|résultat|A2
reason|noun|raison|A2
issue|noun|problème, question, numéro (revue)|B1
choice|noun|choix|A2
decision|noun|décision|A2
mistake|noun|erreur|A2
risk|noun|risque|B1
cost|noun / verb|coût ; coûter|A2
profit|noun|bénéfice|B1
budget|noun|budget|B1
market share|noun|part de marché|B2
growth|noun|croissance|B1
sales|noun|ventes|B1
invoice|noun|facture|B1
bill|noun|addition, facture|A2
contract|noun|contrat|B1
law|noun|loi, droit|B1
rule|noun|règle|A2
right|noun / adjective|droit ; juste, à droite|A1
truth|noun|vérité|B1
knowledge|noun|connaissance(s)|B1
education|noun|éducation, enseignement|B1
society|noun|société (collectivité)|B1
culture|noun|culture|B1
environment|noun|environnement|B1
city centre|noun|centre-ville|A2
neighbour|noun|voisin|A2
relationship|noun|relation|B1
feeling|noun|sentiment|A2
fear|noun|peur|B1
pride|noun|fierté|B2
challenge|noun|défi|B1
success|noun|succès, réussite|B1
failure|noun|échec|B1
good|adjective|bon, bien|A1
new|adjective|nouveau|A1
first|adjective|premier|A1
long|adjective|long|A1
great|adjective|génial, grand|A1
little|adjective|petit, peu|A1
own|adjective|propre (à soi)|A2
other|adjective|autre|A1
right|adjective|correct, juste|A1
big|adjective|grand, gros|A1
high|adjective|haut, élevé|A2
different|adjective|différent|A2
small|adjective|petit|A1
next|adjective|prochain, suivant|A1
early|adjective / adverb|tôt, précoce|A2
young|adjective|jeune|A1
important|adjective|important|A2
few|adjective|peu de (dénombrable)|A2
public|adjective|public|B1
bad|adjective|mauvais|A1
same|adjective|même|A2
able|adjective|capable|B1
late|adjective / adverb|en retard, tard|A1
hard|adjective / adverb|dur, difficile ; dur|A2
easy|adjective|facile|A1
difficult|adjective|difficile|A1
happy|adjective|heureux|A1
sad|adjective|triste|A1
angry|adjective|en colère|A2
afraid|adjective|effrayé, avoir peur|A2
proud|adjective|fier|B1
ready|adjective|prêt|A1
sure|adjective|sûr|A2
free|adjective|libre, gratuit|A1
full|adjective|plein, complet|A2
empty|adjective|vide|A2
quiet|adjective|calme, silencieux|A2
noisy|adjective|bruyant|A2
clean|adjective|propre|A1
dirty|adjective|sale|A2
safe|adjective|sûr, en sécurité|B1
dangerous|adjective|dangereux|A2
strong|adjective|fort|A2
weak|adjective|faible|B1
true|adjective|vrai|A2
false|adjective|faux|A2
wrong|adjective|faux, erroné, mal|A2
clear|adjective|clair|B1
available|adjective|disponible|B1
useful|adjective|utile|A2
useless|adjective|inutile|B1
boring|adjective|ennuyeux|A2
bored|adjective|qui s'ennuie|A2
interesting|adjective|intéressant|A1
interested|adjective|intéressé|A2
worried|adjective|inquiet|A2
crowded|adjective|bondé|B1
polite|adjective|poli|B1
rude|adjective|impoli|B1
kind|adjective|gentil|A2
honest|adjective|honnête|B1
lazy|adjective|paresseux|A2
hard-working|adjective|travailleur|B1
punctual|adjective|ponctuel|B1
always|adverb|toujours|A1
never|adverb|jamais|A1
often|adverb|souvent|A1
sometimes|adverb|parfois|A1
usually|adverb|d'habitude|A1
rarely|adverb|rarement|A2
already|adverb|déjà|A2
yet|adverb|encore, déjà (question)|B1
still|adverb|encore, toujours|A2
soon|adverb|bientôt|A2
again|adverb|encore, de nouveau|A1
also|adverb|aussi|A1
too|adverb|trop, aussi|A1
enough|adverb|assez|A2
almost|adverb|presque|A2
quite|adverb|assez, plutôt|A2
rather|adverb|plutôt|B1
especially|adverb|surtout, en particulier|B1
probably|adverb|probablement|A2
perhaps|adverb|peut-être|A2
maybe|adverb|peut-être|A1
together|adverb|ensemble|A1
abroad|adverb|à l'étranger|B1
however|adverb|cependant|B1
instead|adverb|à la place|B1
indeed|adverb|en effet|B2
because|conjunction|parce que|A1
but|conjunction|mais|A1
or|conjunction|ou|A1
if|conjunction|si|A1
when|conjunction|quand|A1
while|conjunction|pendant que, alors que|B1
although|conjunction|bien que|B1
unless|conjunction|à moins que|B2
since|preposition / conjunction|depuis ; puisque|B1
until|preposition|jusqu'à|A2
during|preposition|pendant|A2
without|preposition|sans|A2
against|preposition|contre|B1
among|preposition|parmi|B1
through|preposition|à travers, grâce à|B1
towards|preposition|vers|B1
behind|preposition|derrière|A2
in front of|preposition|devant|A2
above|preposition|au-dessus de|A2
below|preposition|en dessous de|A2
near|preposition|près de|A1
beside|preposition|à côté de|B1
upset|adjective|contrarié, bouleversé|B1
excited|adjective|enthousiaste, impatient|A2
embarrassed|adjective|gêné|B1
embarrassing|adjective|gênant|B1
`;

/** Parses the compact list; malformed lines are skipped. */
export function parseCoreWords(raw: string): DictionarySeed[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line) => {
      const [word, partOfSpeech, translation, level] = line.split('|').map((s) => s.trim());
      if (!word || !translation) return [];
      return [
        {
          word,
          translation,
          partOfSpeech: partOfSpeech || undefined,
          level: isLevel(level) ? level : undefined,
          category: 'core' as const,
        },
      ];
    });
}

export const CORE_WORDS: DictionarySeed[] = parseCoreWords(RAW);
