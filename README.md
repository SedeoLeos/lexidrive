# LexiDrive

Application mobile d'apprentissage de l'anglais **100 % hors ligne**, du niveau Zéro (A1) au C2, centrée sur l'autonomie B1/B2.
Son cœur est un **Bootcamp quotidien de 7 heures fractionnables** : chaque minute étudiée, en une ou plusieurs sessions, remplit la jauge du jour, même si l'app est fermée puis rouverte.

- **Stack** : Expo SDK 57 (React Native 0.86) · TypeScript strict · Expo Router · NativeWind 4 (Tailwind) · expo-sqlite · expo-speech · expo-notifications
- **Architecture** : Clean Architecture (Domain / Data / Presentation) + Atomic Design (atoms → pages)
- **Design** : « Modern Luxury Minimalism » : bleu signature `#3D469D`, blancs cassés, Inter ExtraLight → SemiBold, aucune ombre, relief par variations de teinte, arrondis `rounded-3xl` / `rounded-full`, barre de navigation flottante, arrondie et centrée.

## Démarrer

```bash
npm install
npx expo start          # puis « a » (Android) / « i » (iOS) dans un development build
npm test                # 229 tests : logique, cas d'usage, intégrité du contenu
npm run typecheck
npm run export:content  # régénère docs/CONTENU_PEDAGOGIQUE.md depuis les données
npm run build:lexicon   # régénère le lexique orthographique hors ligne (SCOWL)
```

> Pour tester le rappel quotidien (`expo-notifications`) dans des conditions réelles, utilise un _development build_ (`npx expo run:android|ios` ou `eas build --profile development`).

## Fonctionnalités

| Besoin                                                                                                     | Où                                                                    |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Parcours A1 → C2, niveaux verrouillés                                                                      | `CoursesPage`, `GetCourseCatalogUseCase`, `isLevelUnlocked`           |
| Leçon : thème, 20 mots, astuce, 5 phrases                                                                  | `LessonPage` (onglets Vocabulaire / Grammaire / Phrases)              |
| 20+ quiz par leçon (QCM, remise en ordre, texte à trous, correction)                                       | `QuizRunner`, `evaluateQuiz`                                          |
| 7 h quotidiennes fractionnables, suivies en temps réel                                                     | `useStudySession` → `RecordStudyTimeUseCase` → table `study_time_log` |
| Examens de passage stricts (80 %), en accès direct, + écran « Félicitations, tu as atteint le niveau X ! » | `ExamPage`, `SubmitExamUseCase`, `LevelUpPage`                        |
| Journal de Vie & Débat (FR + traduction EN), correcteur local, coffre-fort                                 | `JournalPage`, `JournalEditor`, `JournalHistoryPage`                  |
| Dictionnaire pop-up EN ⇄ FR + 🔊 accent UK/US                                                              | `DictionaryPopup`, `DictionaryPage`, `SpeakerButton`                  |
| Rappel quotidien local + série de jours                                                                    | `ProfilePage`, `ExpoNotificationService`, `computeStreak`             |

### Suivi du temps (7 h fractionnables)

- Le temps ne compte que si un **écran d'étude** est au premier plan _et_ l'app active (`AppState`).
- Toutes les **15 s** (et à chaque sortie d'écran, mise en arrière-plan ou changement de module), le temps écoulé est ajouté en SQLite par jour local et par module (`UPSERT … seconds = seconds + ?`). Une fermeture brutale fait perdre au plus 15 s.
- Un intervalle qui chevauche minuit est réparti sur les deux jours (`splitByLocalDay`) ; un écart anormal (horloge, thread JS gelé) est plafonné à 60 s.
- La jauge du tableau de bord additionne toutes les sessions de la journée : 7 segments d'une heure et un détail par module du Bootcamp.

### Examens

Chaque transition (A1→A2, A2→B1, B1→B2, B2→C1, C1→C2) a un examen de 25 questions (QCM + textes à trous orthographiques), avec une section **Nombres & maths** et, dès B1, **Anglais technique**. L'examen du niveau actuel est **ouvert en accès direct** : quelqu'un qui a déjà le niveau peut le passer sans suivre les leçons, puis enchaîner l'examen suivant. Les leçons restent recommandées (« Prêt pour l'examen » quand elles sont toutes validées). Aucune correction n'apparaît pendant l'épreuve, et il faut **80 %** pour passer. En cas de réussite, le niveau est mis à jour, le suivant est débloqué et l'écran de félicitations s'affiche.

## Architecture

```
src/
├── app/                         # Expo Router — routes minces qui rendent des Pages
│   ├── _layout.tsx              # polices → SQLiteProvider (migrations + seed) → DI → Stack
│   ├── (tabs)/                  # Accueil · Cours · Journal · Lexique · Profil
│   ├── lesson/[id].tsx  quiz/[id].tsx  exam/[id].tsx  level-up/[level].tsx
│   └── journal/history.tsx  journal/[id].tsx
├── core/                        # transverse, sans dépendance
│   ├── constants/               # niveaux CECRL, modules du Bootcamp (7 h), seuils
│   ├── theme/colors.ts          # jetons couleur (miroir de tailwind.config.js)
│   └── utils/                   # dates locales, normalisation de texte, RNG déterministe
├── domain/                      # règles métier pures (aucun import Expo/SQLite)
│   ├── entities/                # Lesson, Quiz, Exam, DictionaryEntry, JournalEntry, Progress, Settings
│   ├── repositories/            # contrats I*Repository
│   ├── services/                # contrats ISpeechService, INotificationService, ISpellChecker
│   ├── logic/                   # studyTime, streak, quizGrading, examGrading, spelling
│   └── usecases/                # progress, courses, exams, journal, dictionary, settings
├── data/                        # implémentations
│   ├── database/database.ts     # schéma SQLite, migrations (PRAGMA user_version), init
│   ├── database/seed.ts         # insertion du contenu (re-seed si CONTENT_VERSION change)
│   ├── repositories/            # SQLite*Repository
│   ├── services/                # ExpoSpeechService, ExpoNotificationService, LocalSpellChecker
│   ├── mappers/                 # lignes SQL ⇄ entités
│   └── content/                 # le curriculum embarqué (leçons, examens, dictionnaire, lexique)
└── presentation/
    ├── di/                      # composition root (createContainer) + DependenciesProvider
    ├── state/                   # SettingsProvider, store de session d'étude
    ├── hooks/                   # useStudySession, useAsync, useSpeech, useSpellChecker…
    └── components/
        ├── atoms/               # AppText, Button, IconButton, ProgressBar, Pill, Surface, TextArea…
        ├── molecules/           # SpeakerButton, VocabularyRow, OptionButton, SegmentedControl…
        ├── organisms/           # FloatingTabBar, DailyGauge, QuizRunner, DictionaryPopup, JournalEditor…
        ├── templates/           # NavigationTemplate, ScreenTemplate, FocusTemplate
        └── pages/               # Dashboard, Courses, Lesson, Quiz, Exam, LevelUp, Journal…, Dictionary, Profile
```

Règle de dépendance : `presentation → domain ← data`. Les pages ne parlent qu'aux cas d'usage via `useUseCases()` ; seul `di/container.ts` connaît SQLite et Expo.

## Base de données (SQLite)

| Table                                                 | Rôle                                                                                               |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `courses`                                             | leçons A1 → C2 : thème, vocabulaire, astuce de grammaire, phrases clés (JSON), consigne de journal |
| `course_quizzes`                                      | banque de quiz par leçon (catégorie, type, contenu)                                                |
| `dictionary`                                          | dictionnaire local EN ⇄ FR, clés sans accents, collocations, alternatives, pièges                  |
| `exams` / `exam_questions`                            | examens de passage et leurs questions                                                              |
| `journal_prompts`                                     | consignes de journal en rotation                                                                   |
| `user_progress`                                       | niveau actuel et objectif quotidien (ligne unique)                                                 |
| `study_time_log`                                      | secondes étudiées par jour local et par module (jauge des 7 h)                                     |
| `lesson_progress` / `score_history` / `exam_attempts` | progression et historique des scores                                                               |
| `user_journal`                                        | textes du journal : français + traduction anglaise                                                 |
| `settings` / `meta`                                   | préférences (accent, vitesse, rappel, mots acceptés) et version du contenu                         |

Les tables de contenu sont ré-insérées quand `CONTENT_VERSION` change ; les données de l'apprenant ne sont jamais touchées.

## Contenu pédagogique

Tout le contenu est en texte dans `src/data/content/` et lisible dans **[docs/CONTENU_PEDAGOGIQUE.md](docs/CONTENU_PEDAGOGIQUE.md)** :

- **Volet 1** : 22 leçons, dont une filière **Nombres & maths** (A1 compter, A2 calculer, B1 pourcentages et graphiques, B2 géométrie et équations, C2 langage de la démonstration) et une filière **Anglais technique** (B1 outils et sécurité, B2 informatique et dépannage, C1 spécifications) ; chacune avec 20 mots, une astuce, 5 phrases, 21 quiz répartis en catégories A/B/C (462 au total) avec explications, et une consigne de journal ; plus 30 consignes générales (vie / débat).
- **Volet 2** : 56 mots piliers (faux amis, calques) avec alternatives et collocations, ~70 connecteurs et idiomes classés de B1 à C2, et un socle de ~350 mots fréquents, soit 862 entrées de dictionnaire une fois fusionnées avec le vocabulaire des leçons.
- **Volet 3** : 5 examens de passage de 25 questions corrigées (grammaire, vocabulaire, orthographe, nombres et maths, anglais technique).

Les tests `src/__tests__/content.test.ts` vérifient ce contrat : 20 mots, 20+ quiz bien formés dans les 3 catégories, un examen par transition, des fautes volontaires bien signalées par le correcteur, etc.

## Crédits

Lexique orthographique : SCOWL © 2000-2016 Kevin Atkinson (licence permissive, voir l'en-tête de `src/data/content/spelling/lexicon.ts`). Icônes : Feather. Police : Inter (SIL OFL).
