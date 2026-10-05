import type { LessonSeed } from '../types';
import { fill, fix, grammar, order, p, vocab, w } from '../builders';

/**
 * Étape Avancée — C2 : maîtrise.
 * Registre littéraire, ironie, rédaction académique de haute précision.
 */
export const C2_LESSONS: LessonSeed[] = [
  {
    id: 'c2-01',
    level: 'C2',
    order: 1,
    title: "Décoder l'ironie et l'understatement",
    theme:
      "Lire un éditorial ou un roman britannique : repérer l'ironie, la litote, le sarcasme, et savoir les manier soi-même.",
    vocabulary: [
      w(
        'understatement',
        'litote / euphémisme',
        '"It\'s a bit chilly," he said, in the middle of a blizzard — a typical British understatement.',
      ),
      w('tongue-in-cheek', 'ironique / pince-sans-rire', 'The review was written in a tongue-in-cheek style.'),
      w('wry', 'désabusé / narquois', 'She gave a wry smile.'),
      w('deadpan', 'impassible (humour)', 'His deadpan delivery made it even funnier.'),
      w('scathing', 'cinglant / virulent', 'The critic wrote a scathing review.'),
      w('disingenuous', 'faussement naïf / hypocrite', "It's disingenuous to claim you didn't know."),
      w('poignant', 'poignant / émouvant', 'A poignant reminder of what was lost.'),
      w('subtle', 'subtil', 'The irony is subtle but unmistakable.'),
      w('innuendo', 'insinuation', 'The article was full of innuendo.'),
      w('mock', 'se moquer de / faux', "He mocked the minister's speech."),
      w('sardonic', 'sardonique', 'His sardonic remarks offended no one — everyone was used to them.'),
      w('feign', 'feindre', 'She feigned surprise.'),
      w('incongruous', 'incongru', 'The cheerful music felt incongruous with the tragedy.'),
      w('bathos', 'chute comique (du sublime au trivial)', 'The speech ended in bathos.'),
      w('hyperbole', 'hyperbole / exagération', '"I\'ve told you a million times" is a hyperbole.'),
      w('veiled', 'voilé', 'It was a thinly veiled criticism.'),
      w('self-deprecating', 'autodérision', 'His self-deprecating humour won the audience over.'),
      w('jarring', 'discordant / choquant', 'The change of tone is jarring.'),
      w('nuance', 'nuance', 'The translation loses much of the nuance.'),
      w('not entirely', 'pas tout à fait (litote)', 'The plan was not entirely without merit.'),
    ],
    grammarTip: {
      title: 'La litote anglaise : « not un- » et les atténuateurs',
      explanation:
        "L'anglais cultivé exprime souvent une opinion forte en la disant faiblement. « Not bad » = très bien ; « not unlike » = assez semblable ; « not without merit » = plutôt bon ; « I'm not entirely convinced » = je ne suis pas du tout convaincu. Le lecteur C2 doit inverser mentalement l'intensité, et l'utiliser lui-même pour critiquer avec élégance.",
      shortcut:
        'Double négation (not + un-/without) = affirmation prudente. « Slightly », « somewhat », « a tad » devant une catastrophe = ironie.',
      examples: [
        'The results were not unimpressive (= assez impressionnants).',
        "It's not without its problems (= il y a de vrais problèmes).",
        'The flood was somewhat inconvenient (ironie).',
        "I'm not altogether sure that's wise (= c'est une mauvaise idée).",
      ],
    },
    keyPhrases: [
      p("That's one way of putting it.", "C'est une façon de voir les choses (= je ne suis pas d'accord)."),
      p(
        "With all due respect, I'm not entirely convinced.",
        'Sauf votre respect, je ne suis pas tout à fait convaincu.',
      ),
      p('The irony was not lost on anyone.', "L'ironie n'a échappé à personne."),
      p('It was, to put it mildly, a disaster.', "C'était, pour le dire gentiment, un désastre."),
      p('Well, that went well.', "Eh bien, ça s'est bien passé… (dit avec ironie après un fiasco)."),
    ],
    quizzes: [
      vocab(
        '« Pince-sans-rire » / ironique (registre écrit) :',
        ['tongue-in-cheek', 'cheeky-tongued', 'tongue-tied', 'cheek-to-cheek'],
        'tongue-in-cheek',
        "Tongue-in-cheek = ironique. Tongue-tied = muet d'embarras, cheek-to-cheek = joue contre joue.",
      ),
      vocab(
        '« A scathing review » est :',
        ['une critique cinglante', 'une critique élogieuse', 'une critique ambiguë', 'une critique brève'],
        'une critique cinglante',
        'Scathing = virulent, qui blesse. Le contraire serait « a glowing review ».',
      ),
      vocab(
        '« Disingenuous » signifie :',
        ['faussement naïf / de mauvaise foi', 'ingénieux', 'ingénu', 'sans génie'],
        'faussement naïf / de mauvaise foi',
        "Piège : disingenuous ≠ ingenious. Il décrit quelqu'un qui feint l'innocence.",
      ),
      vocab(
        'Définition inversée : « an anticlimax created by a sudden shift from the serious to the trivial ».',
        ['bathos', 'pathos', 'ethos', 'logos'],
        'bathos',
        'Bathos = chute comique. Pathos = émotion pathétique, ethos = crédibilité morale.',
      ),
      vocab(
        '« Feign surprise » :',
        ['feindre la surprise', 'éprouver une vive surprise', 'cacher sa surprise', 'provoquer la surprise'],
        'feindre la surprise',
        'Feign = faire semblant, simuler.',
      ),
      vocab(
        'Synonyme de « wry » :',
        ['dry and mocking', 'loud and cheerful', 'sad and bitter', 'warm and kind'],
        'dry and mocking',
        'Wry = mêlant amusement et désabusement : a wry smile, a wry remark.',
      ),
      vocab(
        '« A thinly veiled threat » :',
        ['une menace à peine voilée', 'une menace très discrète', 'une menace absurde', 'une menace levée'],
        'une menace à peine voilée',
        "Thinly veiled = le voile est si fin que l'on voit tout.",
      ),
      grammar(
        '« The film was not unlike his previous work » signifie :',
        [
          'Le film ressemblait assez à son travail précédent.',
          'Le film était totalement différent.',
          "Le film n'était pas aimé.",
          'Le film était meilleur.',
        ],
        'Le film ressemblait assez à son travail précédent.',
        'Not unlike = assez semblable (double négation).',
      ),
      grammar(
        'Quelle phrase est une litote critique ?',
        [
          'The plan is terrible.',
          'The plan is not without its flaws.',
          'The plan has flaws everywhere!',
          'The plan is a disaster, frankly.',
        ],
        'The plan is not without its flaws.',
        'La litote critique en affirmant faiblement : « pas sans défauts » = plein de défauts.',
      ),
      grammar(
        'Complète pour une ironie britannique : « The hurricane was ___ inconvenient. »',
        ['slightly', 'extremely', 'totally', 'hugely'],
        'slightly',
        "L'atténuateur devant une catastrophe crée l'ironie (understatement).",
      ),
      grammar(
        'Complète : « It was, to put it ___, a fiasco. »',
        ['mildly', 'mild', 'softer', 'lightly said'],
        'mildly',
        'Expression figée : to put it mildly = pour le dire gentiment.',
      ),
      grammar(
        "« I'm not altogether sure that's wise » exprime :",
        [
          'un désaccord poli mais net',
          'une approbation enthousiaste',
          'une hésitation sincère sur un détail',
          'une indifférence',
        ],
        'un désaccord poli mais net',
        "Atténuation polie typique : le locuteur pense clairement que c'est une mauvaise idée.",
      ),
      order(
        "Remets les mots dans l'ordre.",
        'The irony was not lost on anyone',
        "« Be lost on someone » = échapper à quelqu'un.",
      ),
      order(
        "Remets les mots dans l'ordre.",
        'His remarks were not entirely without merit',
        'Double atténuation : not entirely + without.',
      ),
      fill(
        'Écris le mot manquant (insinuation).',
        'The article relied on rumour and ___.',
        'innuendo',
        'I-N-N-U-E-N-D-O : double N au début.',
      ),
      fill(
        'Écris le mot manquant (hyperbole).',
        '"I\'m starving to death" is a ___.',
        ['hyperbole', 'an hyperbole'],
        'H-Y-P-E-R-B-O-L-E (prononcé « haï-PEUR-bo-li »).',
      ),
      fill(
        'Écris le mot manquant (subtil).',
        'The humour is ___ and easy to miss.',
        'subtle',
        'S-U-B-T-L-E : le B est muet.',
      ),
      fix('His sardonnic tone irritated the panel.', 'sardonnic', 'sardonic', 'Sardonic : un seul N.'),
      fix('A poingnant scene closes the novel.', 'poingnant', 'poignant', 'P-O-I-G-N-A-N-T, comme en français.'),
      fix(
        'Her self-depreciating humour charmed the audience.',
        'self-depreciating',
        'self-deprecating',
        "Deprecate = dénigrer ; depreciate = perdre de la valeur. On écrit « self-deprecating » (même si l'autre forme se rencontre).",
      ),
      fix('The cheerful music felt incongrous.', 'incongrous', 'incongruous', 'In-con-gru-OUS : le U avant -ous.'),
    ],
    journalPrompt:
      "Raconte en français un événement de ta semaine qui t'a agacé (retard, réunion inutile, panne). Puis réécris-le en anglais avec un humour britannique : au moins 3 litotes ou atténuateurs ironiques (slightly, not entirely, somewhat, to put it mildly) et une touche d'autodérision.",
  },
  {
    id: 'c2-02',
    level: 'C2',
    order: 2,
    title: 'Rédaction académique : nuancer et réfuter',
    theme:
      'Article ou dissertation de haut niveau : concéder avec précision, hiérarchiser les sources, conclure sans surgénéraliser.',
    vocabulary: [
      w('notwithstanding', 'nonobstant / malgré', 'Notwithstanding these limitations, the study is valuable.'),
      w('tentative', 'provisoire / hésitant', 'These conclusions are tentative.'),
      w('corroborate', 'corroborer', 'Later studies corroborate these findings.'),
      w('posit', 'postuler / avancer', 'The author posits a link between diet and mood.'),
      w('cogent', 'convaincant / solide', 'A cogent analysis of the data.'),
      w('salient', 'saillant / principal', 'The salient points are summarised below.'),
      w('paradigm', 'paradigme', 'This marks a paradigm shift.'),
      w('caveat', 'mise en garde / réserve', 'One caveat: the sample was small.'),
      w('ostensibly', 'en apparence', 'The policy was ostensibly designed to help.'),
      w('inherent', 'inhérent', 'There are risks inherent in any change.'),
      w('conversely', 'inversement', 'Conversely, rural areas saw no change.'),
      w('be that as it may', "quoi qu'il en soit", 'Be that as it may, the trend is clear.'),
      w('hitherto', "jusqu'ici", 'A hitherto unknown manuscript.'),
      w('insofar as', 'dans la mesure où', 'The theory holds insofar as it explains the data.'),
      w('preclude', 'empêcher / exclure', 'The small sample precludes firm conclusions.'),
      w('underpin', 'sous-tendre / étayer', 'The assumptions that underpin the model.'),
      w('contentious', 'controversé', 'A contentious issue among historians.'),
      w('nuanced', 'nuancé', 'She offers a nuanced reading of the text.'),
      w('extrapolate', 'extrapoler', 'We cannot extrapolate from such limited data.'),
      w('moot', 'discutable / sans intérêt pratique', 'Whether it would have worked is a moot point.'),
    ],
    grammarTip: {
      title: 'Les concessives de haute volée : Much as…, -ever…, Adjectif + as + sujet + be',
      explanation:
        "Au-delà de « although », le registre académique dispose de structures plus denses : « Much as I admire his work, … » (bien que j'admire beaucoup) ; « Compelling as the argument is, … » (aussi convaincant que soit l'argument) ; « However persuasive it may seem, … » ; « Try as they might, they could not replicate it. » L'ordre des mots est fixe : adjectif/adverbe d'abord, puis AS + sujet + verbe.",
      shortcut:
        "« Aussi X que soit… » = X + AS + sujet + BE. « Bien que j'aime beaucoup… » = MUCH AS + sujet + verbe. « Avoir beau essayer » = TRY AS + sujet + MIGHT.",
      examples: [
        'Much as I respect the author, her conclusions are unfounded.',
        'Persuasive as it may be, the theory lacks evidence.',
        'However carefully one reads the data, the trend is ambiguous.',
        'Try as they might, researchers could not corroborate the claim.',
      ],
    },
    keyPhrases: [
      p(
        'While this argument has considerable merit, it rests on a questionable assumption.',
        'Si cet argument a un mérite considérable, il repose sur une hypothèse discutable.',
      ),
      p(
        'The evidence, albeit limited, points in the same direction.',
        'Les éléments, quoique limités, vont dans le même sens.',
      ),
      p('It would be premature to conclude that…', 'Il serait prématuré de conclure que…'),
      p('This is not to say that…; rather, …', "Cela ne veut pas dire que… ; il s'agit plutôt de…"),
      p('Further research is warranted.', 'Des recherches complémentaires sont justifiées.'),
    ],
    quizzes: [
      vocab(
        '« Une mise en garde / réserve » (registre académique) :',
        ['a caveat', 'a caviar', 'a cavity', 'a cave-in'],
        'a caveat',
        "Caveat (latin « qu'il prenne garde ») = réserve. Les autres mots sont des pièges de forme.",
      ),
      vocab(
        '« Corroborer » :',
        ['corroborate', 'collaborate', 'corrode', 'correlate'],
        'corroborate',
        'Corroborate = confirmer. Collaborate = collaborer, correlate = mettre en corrélation.',
      ),
      vocab(
        'Synonyme de « cogent » :',
        ['convincing', 'cognitive', 'cozy', 'confusing'],
        'convincing',
        'Cogent = logique et convaincant. Cognitive = relatif à la cognition.',
      ),
      vocab(
        '« A moot point » est :',
        ['une question discutable ou devenue sans objet', 'un point essentiel', 'un point mort', 'un point de départ'],
        'une question discutable ou devenue sans objet',
        'Moot = discutable (UK) ou sans intérêt pratique (US). Les deux sens se rencontrent.',
      ),
      vocab(
        'Définition inversée : « apparently, but perhaps not really ».',
        ['ostensibly', 'ostentatiously', 'obviously', 'obliquely'],
        'ostensibly',
        'Ostensibly = en apparence. Ostentatiously = de façon ostentatoire.',
      ),
      vocab(
        "« Jusqu'ici inconnu » :",
        ['hitherto unknown', 'heretofore known', 'thereto unknown', 'hereby unknown'],
        'hitherto unknown',
        'Hitherto = until now. Hereby = par la présente.',
      ),
      vocab(
        '« Empêcher / exclure » (registre soutenu) :',
        ['preclude', 'precede', 'prelude', 'presume'],
        'preclude',
        'Preclude = rendre impossible. Precede = précéder, prelude = prélude.',
      ),
      grammar(
        "« Aussi convaincant que soit l'argument… » :",
        [
          'Convincing as the argument is, …',
          'As convincing the argument is, …',
          'So convincing as is the argument, …',
          'Although convincing is the argument, …',
        ],
        'Convincing as the argument is, …',
        'Adjectif + AS + sujet + verbe.',
      ),
      grammar(
        'Complète : « ___ I admire her work, I cannot accept her conclusions. »',
        ['Much as', 'As much', 'So much', 'Even much'],
        'Much as',
        'Much as + proposition = bien que (concession forte).',
      ),
      grammar(
        'Complète : « Try as they ___, they could not replicate the results. »',
        ['might', 'may be', 'could have', 'would'],
        'might',
        'Structure figée : Try as + sujet + might.',
      ),
      grammar(
        'Complète : « ___ these limitations, the study remains valuable. »',
        ['Notwithstanding', 'Nevertheless', 'Although', 'However'],
        'Notwithstanding',
        'Notwithstanding + groupe nominal (= despite). Nevertheless et however sont des adverbes de phrase ; although exige un verbe.',
      ),
      grammar(
        'Complète : « The theory is valid ___ it accounts for the data. »',
        ['insofar as', 'inasmuch that', 'in so far', 'as far that'],
        'insofar as',
        'Insofar as = dans la mesure où.',
      ),
      order(
        "Remets les mots dans l'ordre.",
        'However persuasive it may seem the theory lacks evidence',
        'However + adjectif + sujet + verbe (souvent avec may).',
      ),
      order(
        "Remets les mots dans l'ordre.",
        'It would be premature to draw firm conclusions',
        'Hedging académique : it would be premature to…',
      ),
      fill(
        'Écris le mot manquant (inhérent).',
        'There are risks ___ in any methodology.',
        'inherent',
        'I-N-H-E-R-E-N-T : -ENT.',
      ),
      fill(
        'Écris le mot manquant (paradigme).',
        'The discovery triggered a ___ shift in physics.',
        'paradigm',
        'P-A-R-A-D-I-G-M : le G est muet.',
      ),
      fill(
        'Écris le mot manquant (controversé).',
        'Immigration remains a ___ issue.',
        'contentious',
        'Content + ious : c-o-n-t-e-n-t-i-o-u-s.',
      ),
      fix(
        'Later studies coroborate the initial findings.',
        'coroborate',
        'corroborate',
        'Corroborate : double R au début (cor-RO-borate).',
      ),
      fix('The salliant points are listed in Table 2.', 'salliant', 'salient', 'Salient : un seul L.'),
      fix(
        'These conclusions remain tentive.',
        'tentive',
        'tentative',
        'Tentative : t-e-n-t-A-t-i-v-e. Faux ami partiel : « tentative » = provisoire.',
      ),
      fix(
        'We cannot extrappolate from such a small sample.',
        'extrappolate',
        'extrapolate',
        'Extrapolate : un seul P.',
      ),
    ],
    journalPrompt:
      "Choisis une idée reçue que tu entends souvent (sur l'argent, l'éducation, la technologie). En français, rédige un paragraphe académique de 200 mots qui la nuance : concession, réserve méthodologique, contre-exemple, conclusion prudente. Traduis-le avec au moins 2 concessives avancées (Much as…, Compelling as… is, Try as… might) et les mots caveat, notwithstanding, insofar as.",
  },
];
