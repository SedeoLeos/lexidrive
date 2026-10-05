/**
 * Exports the embedded curriculum as readable documents, generated from the exact data seeded
 * into SQLite — the two can never diverge:
 *  - docs/CONTENU_PEDAGOGIQUE.md : overview, lesson index, dictionary (Volet 2) and exams (Volet 3)
 *  - docs/contenu/<LEVEL>.md     : every lesson of a level in full, with its quiz bank (Volet 1)
 *
 * Usage: npm run export:content
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { LEVELS, LEVEL_META } from '../src/core/constants/levels';
import type { LessonSeed } from '../src/data/content/types';
import { BOOTCAMP_MODULES, DAILY_GOAL_MINUTES } from '../src/core/constants/bootcamp';
import { EXAMS, JOURNAL_PROMPTS, LESSONS } from '../src/data/content';
import { PILLAR_WORDS } from '../src/data/content/dictionary/pillars';
import { IDIOMS_AND_CONNECTORS } from '../src/data/content/dictionary/idioms';
import { CORE_WORDS } from '../src/data/content/dictionary/core';
import type { QuizSeed } from '../src/data/content/types';

const CATEGORY_TITLE = {
  vocabulary: 'Catégorie A — Vocabulaire',
  grammar: 'Catégorie B — Grammaire & syntaxe',
  spelling: 'Catégorie C — Orthographe & textes à trous',
} as const;

const LETTERS = ['a', 'b', 'c', 'd', 'e'];

function quizToMarkdown(q: QuizSeed, n: number): string {
  switch (q.kind) {
    case 'mcq':
      return [
        `${n}. **${q.prompt}**`,
        ...q.options.map((o, i) => `   - ${LETTERS[i]}) ${o}`),
        `   - ✅ Réponse : **${q.options[q.answerIndex]}**`,
        `   - 💡 ${q.explanation}`,
      ].join('\n');
    case 'reorder':
      return [
        `${n}. **${q.prompt}** — mots : _${[...q.words].sort((a, b) => a.localeCompare(b)).join(' / ')}_`,
        `   - ✅ Réponse : **${q.words.join(' ')}**`,
        `   - 💡 ${q.explanation}`,
      ].join('\n');
    case 'fill':
      return [
        `${n}. **${q.prompt}** — « ${q.text} »`,
        `   - ✅ Réponse : **${q.answers.join(' / ')}**`,
        `   - 💡 ${q.explanation}`,
      ].join('\n');
    case 'correct':
      return [
        `${n}. **${q.prompt}** — « ${q.text} »`,
        `   - ✅ « ${q.wrong} » → **${q.answers.join(' / ')}**`,
        `   - 💡 ${q.explanation}`,
      ].join('\n');
  }
}

function lessonToMarkdown(lesson: LessonSeed): string {
  const out: string[] = [];
  const meta = LEVEL_META[lesson.level];
  out.push(`## ${lesson.level} · Leçon ${lesson.order} — ${lesson.title}`);
  out.push('');
  out.push(`_Étape ${meta.stage} · ${meta.title}_`);
  out.push('');
  out.push(`### 1. Thème`);
  out.push('');
  out.push(lesson.theme);
  out.push('');
  out.push('### 2. Les 20 mots du jour');
  out.push('');
  out.push('| Anglais | Français | Exemple en contexte |');
  out.push('|---|---|---|');
  for (const v of lesson.vocabulary) out.push(`| **${v.english}** | ${v.french} | ${v.example} |`);
  out.push('');
  out.push(`### 3. L'astuce du jour — ${lesson.grammarTip.title}`);
  out.push('');
  out.push(lesson.grammarTip.explanation);
  out.push('');
  out.push(`> **Raccourci :** ${lesson.grammarTip.shortcut}`);
  out.push('');
  for (const ex of lesson.grammarTip.examples) out.push(`- ${ex}`);
  out.push('');
  out.push('### 4. Les 5 phrases clés');
  out.push('');
  for (const ph of lesson.keyPhrases) out.push(`- **${ph.english}** — ${ph.french}`);
  out.push('');
  out.push(`### 5. Banque de quiz (${lesson.quizzes.length} questions)`);
  out.push('');
  for (const cat of ['vocabulary', 'grammar', 'spelling'] as const) {
    out.push(`#### ${CATEGORY_TITLE[cat]}`);
    out.push('');
    lesson.quizzes.filter((q) => q.category === cat).forEach((q, i) => out.push(quizToMarkdown(q, i + 1)));
    out.push('');
  }
  out.push('### 6. Journal de Vie & Débat');
  out.push('');
  out.push(lesson.journalPrompt);
  out.push('');
  return out.join('\n');
}

const out: string[] = [];
out.push('# LexiDrive — Contenu pédagogique (A1 → C2)');
out.push('');
out.push(
  '> Document généré automatiquement depuis `src/data/content` (`npm run export:content`). Il reflète exactement les données insérées dans la base SQLite embarquée.',
);
out.push('');
out.push(`## Le Bootcamp quotidien (${DAILY_GOAL_MINUTES / 60} h fractionnables)`);
out.push('');
out.push('| Module | Objectif | Contenu |');
out.push('|---|---|---|');
for (const m of BOOTCAMP_MODULES) out.push(`| ${m.label} | ${m.targetMinutes} min | ${m.description} |`);
out.push('');

out.push('---');
out.push('');
out.push('# VOLET 1 — Curriculum et banques de quiz');
out.push('');
out.push(
  `${LESSONS.length} leçons, chacune avec 20 mots, une astuce de grammaire, 5 phrases clés, ${LESSONS.reduce((n, l) => n + l.quizzes.length, 0)} quiz au total et une consigne de journal. Le détail complet de chaque niveau est dans \`docs/contenu/\`.`,
);
out.push('');
mkdirSync(join(__dirname, '..', 'docs', 'contenu'), { recursive: true });
for (const level of LEVELS) {
  const lessons = LESSONS.filter((l) => l.level === level);
  const meta = LEVEL_META[level];
  out.push(`## ${level} · ${meta.title} — ${lessons.length} leçons ([détail](contenu/${level}.md))`);
  out.push('');
  out.push('| # | Leçon | Thème | Grammaire |');
  out.push('|---|---|---|---|');
  for (const l of lessons) out.push(`| ${l.order} | ${l.title} | ${l.theme} | ${l.grammarTip.title} |`);
  out.push('');
  const doc = [
    `# LexiDrive — Niveau ${level} · ${meta.title}`,
    '',
    `> Généré automatiquement (\`npm run export:content\`). ${lessons.length} leçons. [← Retour au sommaire](../CONTENU_PEDAGOGIQUE.md)`,
    '',
    ...lessons.map(lessonToMarkdown),
  ];
  writeFileSync(join(__dirname, '..', 'docs', 'contenu', `${level}.md`), doc.join('\n'));
}

out.push('### Consignes générales du journal (rotation quotidienne)');
out.push('');
for (const prompt of JOURNAL_PROMPTS) out.push(`- _${prompt.kind === 'debate' ? 'Débat' : 'Vie'}_ — ${prompt.text}`);
out.push('');

out.push('---');
out.push('');
out.push('# VOLET 2 — Dictionnaire local et astuces');
out.push('');
out.push(`## Les ${PILLAR_WORDS.length} mots piliers (pièges des francophones)`);
out.push('');
out.push('| Mot | Sens réel | Piège | Alternatives élégantes | Collocations |');
out.push('|---|---|---|---|---|');
for (const p of PILLAR_WORDS) {
  out.push(
    `| **${p.word}** | ${p.translation} | ${p.note ?? ''} | ${(p.alternatives ?? []).join(', ')} | ${(p.collocations ?? []).join(' · ')} |`,
  );
}
out.push('');
out.push('## Expressions idiomatiques et connecteurs logiques (B1 → C2)');
out.push('');
for (const level of ['B1', 'B2', 'C1', 'C2'] as const) {
  out.push(`### Niveau ${level}`);
  out.push('');
  out.push('**Connecteurs logiques**');
  out.push('');
  for (const c of IDIOMS_AND_CONNECTORS.filter((e) => e.level === level && e.category === 'connector')) {
    out.push(`- **${c.word}** — ${c.translation}. _${c.example}_ ${c.note ? `(${c.note})` : ''}`);
  }
  out.push('');
  out.push('**Expressions idiomatiques**');
  out.push('');
  for (const i of IDIOMS_AND_CONNECTORS.filter((e) => e.level === level && e.category === 'idiom')) {
    out.push(`- **${i.word}** — ${i.translation}. _${i.example}_`);
  }
  out.push('');
}
out.push(`## Socle lexical`);
out.push('');
out.push(
  `${CORE_WORDS.length} mots fréquents (plus les ${LESSONS.length * 20} mots des leçons) alimentent le dictionnaire pop-up et la recherche FR ⇄ EN.`,
);
out.push('');

out.push('---');
out.push('');
out.push('# VOLET 3 — Examens de passage de niveau');
out.push('');
for (const exam of EXAMS) {
  out.push(`## ${exam.title}`);
  out.push('');
  out.push(`${exam.description}`);
  out.push('');
  exam.questions.forEach((q, i) => {
    if (q.kind === 'mcq') {
      out.push(`${i + 1}. _[${q.section}]_ **${q.prompt}**`);
      q.options.forEach((o, j) => out.push(`   - ${LETTERS[j]}) ${o}`));
      out.push(`   - ✅ **${q.options[q.answerIndex]}** — ${q.explanation}`);
    } else {
      out.push(`${i + 1}. _[${q.section}]_ **${q.prompt}** — « ${q.text} »`);
      out.push(`   - ✅ **${q.answers.join(' / ')}** — ${q.explanation}`);
    }
  });
  out.push('');
}

const target = join(__dirname, '..', 'docs', 'CONTENU_PEDAGOGIQUE.md');
writeFileSync(target, out.join('\n'));
console.log(`Wrote ${target}`);
