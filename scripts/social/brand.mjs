// scripts/social/brand.mjs
// Everything a social card borrows from the app, read from the app's own
// sources so a card cannot drift from the site:
//
//   colours    src/design/tokens.ts      → CSS custom properties, as hex
//   wordmark   src/design/wordmark.ts    → the red acrylic, drawn from the glyphs
//   dots       src/lib/led/*             → the mark lit in dots, numbers in the 5×7 matrix
//   type       public/fonts/Outfit-*.ttf → @font-face, embedded
//   photos     src/data/media/paths.ts   → a key, never a path
//
// Those modules are plain, erasable TypeScript with explicit `.ts` imports, so
// Node loads them as they are (type stripping, Node 22.18+). Nothing here
// draws the mark in a font and no colour is written by hand.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { images } from '../../src/data/media/paths.ts';
import { toHex } from '../../src/design/color.ts';
import { tokens } from '../../src/design/tokens.ts';
import { WORDMARK, wordmarkPaths } from '../../src/design/wordmark.ts';
import { wordmarkCells } from '../../src/lib/led/glyphs.ts';
import { ledPath } from '../../src/lib/led/matrix.ts';
import { gridPaths } from '../../src/lib/led/svg.ts';

/** The Next.js app this script lives in, resolved from this file. */
export const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PUBLIC = join(APP, 'public');

const MIME = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
};

/** A file as a data URL, so the HTML that leaves here opens anywhere, offline. */
function dataUrl(file) {
  const mime = MIME[extname(file).toLowerCase()];
  if (!mime) throw new Error(`No MIME type known for ${file}`);
  return `data:${mime};base64,${readFileSync(file).toString('base64')}`;
}

// ── Colours and type ───────────────────────────────────────────────────────

/** `:root { --color-night-950: #020510; … }` — the whole palette, plus the tracking scale. */
export function tokensCss() {
  const lines = Object.entries(tokens.palette).map(([name, value]) => `  --color-${name}: ${toHex(value)};`);
  for (const [name, value] of Object.entries(tokens.tracking)) lines.push(`  --tracking-${name}: ${value};`);
  return `:root {\n${lines.join('\n')}\n}`;
}

const FONT_FILES = [
  { file: 'Outfit-Regular.ttf', weight: 400 },
  { file: 'Outfit-SemiBold.ttf', weight: 600 },
  { file: 'Outfit-Bold.ttf', weight: 700 },
];

/** The one family, embedded: the same static files the PDFs and the share cards use. */
export function fontFacesCss() {
  return FONT_FILES.map(
    ({ file, weight }) =>
      `@font-face {\n  font-family: Outfit;\n  font-weight: ${weight};\n  src: url('${dataUrl(join(PUBLIC, 'fonts', file))}') format('truetype');\n}`,
  ).join('\n');
}

/** The weights a card needs, for the build to confirm the browser really loaded them. */
export const FONT_WEIGHTS = FONT_FILES.map(({ weight }) => weight);

// ── The mark ───────────────────────────────────────────────────────────────

/** Room around the mark's box for the extruded side, in wordmark units. */
const MARK_MARGIN = 4;

const markBox = {
  x: WORDMARK.viewBox.x - MARK_MARGIN,
  y: WORDMARK.viewBox.y - MARK_MARGIN,
  width: WORDMARK.viewBox.width + 2 * MARK_MARGIN,
  height: WORDMARK.viewBox.height + 2 * MARK_MARGIN,
};

/** Width over height of the acrylic's box, margin included: the CSS sizes it by width. */
export const ACRYLIC_ASPECT = markBox.width / markBox.height;

/** The eight glyphs once, shifted by (dx, dy): every layer of the acrylic is this drawing. */
function glyphs(dx = 0, dy = 0) {
  return wordmarkPaths()
    .map((glyph) => `<g transform="translate(${glyph.x + dx} ${dy})">${glyph.d.map((d) => `<path d="${d}"/>`).join('')}</g>`)
    .join('');
}

/**
 * The acrylic's layers, defined once per document and reused by every card:
 * the extruded side, the face under light from above, the specular line.
 * The same construction as src/components/brand/Wordmark.tsx, with the
 * gradient in user space so one ramp runs down the whole sign.
 */
export function acrylicDefs() {
  const { y, height } = WORDMARK.viewBox;
  const stop = (offset, name) => `<stop offset="${offset}" stop-color="${toHex(tokens.palette[name])}"/>`;
  return `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="acrylic-face" gradientUnits="userSpaceOnUse" x1="0" y1="${y}" x2="0" y2="${y + height}">
      ${stop(0, 'red-400')}${stop(0.25, 'red-500')}${stop(0.7, 'red-600')}${stop(1, 'red-800')}
    </linearGradient>
    <g id="acrylic" fill="none" stroke-linecap="butt">
      <g stroke="${toHex(tokens.palette['red-900'])}" stroke-width="${WORDMARK.stroke}" opacity="0.9">${glyphs(1.5, 2.5)}</g>
      <g stroke="url(#acrylic-face)" stroke-width="${WORDMARK.stroke}">${glyphs()}</g>
      <g stroke="${toHex(tokens.palette['red-200'])}" stroke-width="2" opacity="0.35">${glyphs(0, -0.75)}</g>
    </g>
  </defs>
</svg>`;
}

/** One instance of the acrylic mark. Needs acrylicDefs() somewhere in the same document. */
export function acrylicMark(label) {
  return `<svg class="wordmark" viewBox="${markBox.x} ${markBox.y} ${markBox.width} ${markBox.height}" role="img" aria-label="${label}"><use href="#acrylic"/></svg>`;
}

// ── Dots ───────────────────────────────────────────────────────────────────

/**
 * The mark lit in dots, `cols` dots across: the cells come from the vector
 * itself (src/lib/led/glyphs.ts), one path per brightness level. It paints in
 * `currentColor`.
 */
export function dotWordmark(cols) {
  const grid = wordmarkCells(cols);
  const paths = gridPaths(grid)
    .map((level) => `<path d="${level.d}" stroke-width="${level.width}"/>`)
    .join('');
  return `<svg class="dot-wordmark" viewBox="0 0 ${grid.cols} ${grid.height}" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-linecap="round" transform="translate(0.5 ${grid.offsetY + 0.5})">${paths}</g></svg>`;
}

/** Digits in the 5×7 matrix: every cell as an unlit dot, the lit ones over it. */
export function ledNumber(value) {
  const { width, rows, all, lit } = ledPath(String(value));
  return `<svg class="led-number" viewBox="0 0 ${width} ${rows}" role="img" aria-label="${value}"><g fill="none" stroke-linecap="round" stroke-width="0.78" transform="translate(0.5 0.5)"><path class="led-number__off" d="${all}"/><path class="led-number__on" d="${lit}"/></g></svg>`;
}

// ── Photographs ────────────────────────────────────────────────────────────

/** Every key a campaign may name, straight from the media registry. */
export const PHOTO_KEYS = Object.keys(images);

/**
 * A photograph by its key in src/data/media/paths.ts: the file in
 * public/images, embedded whole and untouched. An unknown key, or a key whose
 * file is missing, is an error that says which.
 */
export function photo(key) {
  const src = images[key];
  if (!src) throw new Error(`Unknown photo key "${key}". It has to be a key of \`images\` in src/data/media/paths.ts.`);
  const file = join(PUBLIC, src);
  if (!existsSync(file)) throw new Error(`Photo "${key}" points at ${src}, which is not in public/.`);
  return { key, src, file, url: dataUrl(file) };
}
