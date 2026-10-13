/**
 * Renders every app icon / splash / favicon from the single brand glyph (assets/brand/glyph.svg).
 *
 * Usage: npm run build:assets
 * Needs Playwright's Chromium: `npx -p playwright node scripts/build-assets.js` if it isn't installed.
 */
const { readFileSync, writeFileSync } = require('node:fs');
const { join } = require('node:path');
const { chromium } = require('playwright');

const BRAND = '#3D469D';
const MIST = '#B8BCE6';
const CANVAS = '#FAF9F6';
const WHITE = '#FFFFFF';

const root = join(__dirname, '..', 'assets');
const glyph = readFileSync(join(root, 'brand', 'glyph.svg'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');

/** glyph coloured and scaled (1 = full 1024 artboard) around the centre. */
const mark = (l, dot, scale = 1) =>
  `<g transform="translate(512 512) scale(${scale}) translate(-512 -512)">${glyph
    .replace('{{L}}', l)
    .replace('{{DOT}}', dot)}</g>`;

const svg = (body, background) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">${
    background ? `<rect width="1024" height="1024" fill="${background}"/>` : ''
  }${body}</svg>`;

const roundedTile = (scale) =>
  `<rect x="${512 - 512 * scale}" y="${512 - 512 * scale}" width="${1024 * scale}" height="${
    1024 * scale
  }" rx="${230 * scale}" fill="${BRAND}"/>${mark(WHITE, MIST, scale * 1.15)}`;

const ASSETS = [
  // iOS / default icon: full bleed, the OS rounds the corners.
  { file: 'icon.png', size: 1024, svg: svg(mark(WHITE, MIST, 1.15), BRAND) },
  // Android adaptive icon: glyph inside the 66 % safe zone, background layer separate.
  { file: 'android-icon-foreground.png', size: 1024, svg: svg(mark(WHITE, MIST, 0.76)) },
  { file: 'android-icon-background.png', size: 1024, svg: svg('', BRAND) },
  { file: 'android-icon-monochrome.png', size: 1024, svg: svg(mark(WHITE, WHITE, 0.76)) },
  // Splash: the rounded tile on the off-white canvas.
  { file: 'splash-icon.png', size: 1024, svg: svg(roundedTile(1)) },
  // In-app logo (Welcome, Profile).
  { file: 'logo.png', size: 512, svg: svg(roundedTile(1)) },
  // Android notification small icon: white silhouette on transparent.
  { file: 'notification-icon.png', size: 96, svg: svg(mark(WHITE, WHITE, 1.3)) },
  { file: 'favicon.png', size: 48, svg: svg(roundedTile(1)) },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const asset of ASSETS) {
    await page.setViewportSize({ width: asset.size, height: asset.size });
    const sized = asset.svg.replace('width="1024" height="1024"', `width="${asset.size}" height="${asset.size}"`);
    await page.setContent(`<html><body style="margin:0;background:transparent">${sized}</body></html>`);
    writeFileSync(join(root, asset.file), await page.screenshot({ omitBackground: true }));
    console.log(`✓ assets/${asset.file} (${asset.size}px)`);
  }
  // Source of truth for designers: the full icon as a standalone SVG.
  writeFileSync(join(root, 'brand', 'logo.svg'), svg(roundedTile(1)));
  writeFileSync(join(root, 'brand', 'icon.svg'), svg(mark(WHITE, MIST, 1.15), BRAND));
  await browser.close();
})();
