// scripts/social/build.mjs
// Builds a campaign's Instagram cards: one PNG per card, a contact sheet, the
// editable HTML they were photographed from, and a record of what was checked.
//
//   node scripts/social/build.mjs <campanha> [<campanha> …]
//   node scripts/social/build.mjs --todas
//   npm run social -- <campanha>          (same thing, without Node's warning
//                                          about loading the app's .ts files)
//
// A campaign is scripts/social/campanhas/<campanha>.json: its title, the
// signature printed beside the lock-up, and the cards. Each card names a
// format ("feed" 1080×1350, "story" 1080×1920), a layout ("photo", "cover",
// "panel", "list") and its copy; a photograph is named by its key in
// src/data/media/paths.ts, never by a path. In `head` and `sub` every array
// entry is one line and *asterisks* mark the words lit in LED blue.
//
// The look comes from the app, not from here: brand.mjs reads the colour
// tokens, the wordmark's geometry, the LED dots and the fonts from the app's
// own sources; template/ holds the markup and the stylesheet.
//
// Output goes to <workspace>/saidas/social/<campanha>/, where <workspace> is
// the folder that holds freeband-nextjs/ (resolved from this file, never from
// an absolute path). FREEBAND_SAIDAS points the `saidas` folder elsewhere.
//
//   <id>.png               one per card, exactly the format's size
//   PREVIA.jpg             every card on one sheet
//   artes-editaveis.html   the cards as HTML: opens offline, prints one per page
//   conteudo.json          the campaign as it was built
//   verificacao.json       what was measured: sizes, text, photographs, files
//
// The build fails, and writes nothing, when a line of text does not fit its
// card, a photograph is not drawn whole at its own ratio, a card is not its
// format's size or Outfit did not load. The PNGs are measured again from disk
// with sharp before the record is written.
//
// The browser is Puppeteer's own (the app's devDependency). Set
// PUPPETEER_EXECUTABLE_PATH to use another Chrome, or PUPPETEER_BROWSER_URL
// (e.g. http://127.0.0.1:9222) to attach to one that is already running.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { toHex } from '../../src/design/color.ts';
import { tokens } from '../../src/design/tokens.ts';
import { APP, FONT_WEIGHTS, acrylicDefs, acrylicMark, dotWordmark, fontFacesCss, ledNumber, photo, tokensCss } from './brand.mjs';
import { auditCards, fitCards } from './browser.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const CAMPAIGNS = join(HERE, 'campanhas');
const TEMPLATES = join(HERE, 'template');
const SAIDAS = process.env.FREEBAND_SAIDAS ?? resolve(APP, '..', 'saidas');
const OUT = join(SAIDAS, 'social');

const FORMATS = {
  feed: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
};
const LAYOUTS = ['photo', 'cover', 'panel', 'list'];

// The word over the mark on every card. It mirrors bandInfo.brandLine: the
// one piece of the brand copied here by hand, because src/data/band.ts imports
// its neighbours without a file extension and Node cannot load it as it is.
const BRAND_LINE = 'Internacional';
/** The mark's accessible name, and the default alt of a photograph. */
const BRAND_NAME = 'Freeband';
const PHOTO_ALT = 'Internacional Freeband ao vivo';

/** Columns of dots across the mark on a list card: a stroke is about three dots wide. */
const DOT_WORDMARK_COLS = 112;
/** The smallest headline the fit may settle on, and how fine its steps are (px). */
const FIT = { minHead: 64, step: 2 };

// ── Templates ──────────────────────────────────────────────────────────────

const escapeHtml = (text) =>
  String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** A template file, without the comments that explain it. */
function template(name) {
  return readFileSync(join(TEMPLATES, name), 'utf8').replace(/<!--[\s\S]*?-->\n?/g, '');
}

/**
 * Logic-less templates. `{{name}}` prints text, escaped; `{{{name}}}` prints
 * markup as it is; `{{#name}}…{{/name}}` prints its body once for a value,
 * once per entry for a list (the entry's fields join the scope) and not at
 * all for null. A name the data does not have is a typo, and throws.
 */
function render(source, data) {
  const value = (key) => {
    if (!(key in data)) throw new Error(`Template asks for "${key}", which the data does not have.`);
    return data[key];
  };
  // Slots are filled in the template's own text only, never in what a slot
  // already printed: copy that happens to contain braces stays copy.
  const fill = (text) =>
    text.replace(/{{{(\w+)}}}|{{(\w+)}}/g, (_, markup, plain) =>
      markup ? String(value(markup) ?? '') : escapeHtml(value(plain) ?? ''),
    );
  const section = (key, body) => {
    const v = value(key);
    if (v === null || v === undefined || v === false) return '';
    if (Array.isArray(v)) return v.map((entry) => render(body, { ...data, ...entry })).join('');
    return render(body, typeof v === 'object' ? { ...data, ...v } : data);
  };

  let out = '';
  let from = 0;
  for (const match of source.matchAll(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g)) {
    out += fill(source.slice(from, match.index)) + section(match[1], match[2]);
    from = match.index + match[0].length;
  }
  return out + fill(source.slice(from));
}

/** One authored line as markup: escaped, with *asterisks* turned into <em>. */
const inline = (line) => escapeHtml(line).replace(/\*([^*]+)\*/g, '<em>$1</em>');
const lines = (list) => list.map(inline).join('<br>');

// ── Campaigns ──────────────────────────────────────────────────────────────

function campaignNames() {
  return readdirSync(CAMPAIGNS)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.slice(0, -'.json'.length))
    .sort();
}

/** Reads a campaign and refuses anything the template could not print. */
function readCampaign(name) {
  const file = join(CAMPAIGNS, `${name}.json`);
  if (!existsSync(file)) {
    throw new Error(`No campaign "${name}". Known: ${campaignNames().join(', ')}.`);
  }
  const campaign = JSON.parse(readFileSync(file, 'utf8'));
  const fail = (message) => {
    throw new Error(`${name}.json: ${message}`);
  };
  const text = (value) => typeof value === 'string' && value.trim() !== '';
  const textList = (value) => Array.isArray(value) && value.length > 0 && value.every(text);

  if (!text(campaign.title)) fail('"title" is missing.');
  if (!text(campaign.signature)) fail('"signature" is missing.');
  if (!Array.isArray(campaign.cards) || campaign.cards.length === 0) fail('"cards" is empty.');

  const seen = new Set();
  const cards = campaign.cards.map((card, index) => {
    const at = `card ${index + 1}${text(card.id) ? ` (${card.id})` : ''}`;
    const format = card.format ?? 'feed';
    const layout = card.layout ?? 'photo';
    // The id is the PNG's file name: plain ASCII travels through any upload.
    if (!text(card.id) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(card.id)) fail(`${at}: "id" must be lowercase letters, digits and hyphens.`);
    if (seen.has(card.id)) fail(`${at}: the id is used twice.`);
    seen.add(card.id);
    if (!FORMATS[format]) fail(`${at}: unknown format "${format}". Known: ${Object.keys(FORMATS).join(', ')}.`);
    if (!LAYOUTS.includes(layout)) fail(`${at}: unknown layout "${layout}". Known: ${LAYOUTS.join(', ')}.`);
    for (const field of ['tag', 'foot', 'mark']) if (!text(card[field])) fail(`${at}: "${field}" is missing.`);
    if (!textList(card.head)) fail(`${at}: "head" must be a list of lines.`);
    if (card.sub !== undefined && !textList(card.sub)) fail(`${at}: "sub" must be a list of lines.`);
    if (layout === 'list') {
      if (!textList(card.items)) fail(`${at}: a "list" card needs "items".`);
      if (card.photo !== undefined) fail(`${at}: a "list" card has no photograph.`);
    } else {
      if (!text(card.photo)) fail(`${at}: a "${layout}" card needs "photo" (a key of src/data/media/paths.ts).`);
      if (card.items !== undefined) fail(`${at}: only a "list" card has "items".`);
    }
    if (card.sticker !== undefined && format !== 'story') fail(`${at}: only a story keeps room for a sticker.`);
    return { ...card, format, layout };
  });
  return { ...campaign, cards };
}

/** "02 / 05" becomes the slide number in LED digits; anything else stays text. */
function markHtml(mark) {
  const count = /^(\d{1,2})\s*\/\s*(\d{1,2})$/.exec(mark);
  return count ? `${ledNumber(count[1])}<span>/ ${escapeHtml(count[2])}</span>` : escapeHtml(mark);
}

/** The whole campaign as one HTML document. */
function compose(campaign) {
  const cardTemplate = template('card.html');
  const wordmark = acrylicMark(BRAND_NAME);
  const dots = dotWordmark(DOT_WORDMARK_COLS);
  // Each file is embedded once per card that prints it; read it once.
  const photos = new Map();
  const photoOf = (key) => photos.get(key) ?? photos.set(key, photo(key)).get(key);

  const cards = campaign.cards
    .map((card) =>
      render(cardTemplate, {
        id: card.id,
        format: card.format,
        layout: card.layout,
        brandLine: BRAND_LINE,
        signature: campaign.signature,
        wordmark,
        tag: card.tag,
        head: lines(card.head),
        sub: card.sub ? lines(card.sub) : null,
        photo: card.photo ? { url: photoOf(card.photo).url, key: card.photo, alt: card.alt ?? PHOTO_ALT } : null,
        list: card.items
          ? { items: card.items.map((label, i) => ({ number: ledNumber(String(i + 1).padStart(2, '0')), label })), dots }
          : null,
        sticker: card.sticker ?? null,
        foot: card.foot,
        mark: markHtml(card.mark),
      }),
    )
    .join('\n');

  return render(template('page.html'), {
    title: `Freeband — ${campaign.title}`,
    fonts: fontFacesCss(),
    tokens: tokensCss(),
    styles: readFileSync(join(TEMPLATES, 'cards.css'), 'utf8'),
    defs: acrylicDefs(),
    cards,
  });
}

// ── Checks ─────────────────────────────────────────────────────────────────

/** Everything wrong with the page as measured, in words. Empty means it may be photographed. */
function problemsOf(audit, errors) {
  const problems = errors.map((error) => `page error: ${error}`);
  for (const [weight, loaded] of Object.entries(audit.fonts)) {
    if (!loaded) problems.push(`Outfit ${weight} did not load: the text would be set in a fallback font.`);
  }
  for (const card of audit.cards) {
    const size = FORMATS[card.format];
    if (card.width !== size.width || card.height !== size.height) {
      problems.push(`${card.id}: the card is ${card.width}×${card.height}, not ${size.width}×${size.height}.`);
    }
    if (card.overflow.length) problems.push(`${card.id}: text does not fit — ${card.overflow.join(', ')} (headline at ${card.head}px).`);
    if (card.photo && !card.photo.whole) {
      problems.push(`${card.id}: photograph "${card.photo.key}" is not whole (file ${card.photo.file.join('×')}, drawn ${card.photo.drawn.join('×')}).`);
    }
  }
  return problems;
}

/** Every card on one sheet, five to a row, each inside the same 9:16 cell. */
async function contactSheet(files, target) {
  const cell = { width: 324, height: 576 };
  const gap = 16;
  const perRow = 5;
  const rows = Math.ceil(files.length / perRow);
  const thumbs = await Promise.all(
    files.map(async (file, i) => ({
      input: await sharp(file)
        .resize(cell.width, cell.height, { fit: 'contain', background: toHex(tokens.palette['night-900']) })
        .png()
        .toBuffer(),
      left: gap + (i % perRow) * (cell.width + gap),
      top: gap + Math.floor(i / perRow) * (cell.height + gap),
    })),
  );
  await sharp({
    create: {
      width: gap + perRow * (cell.width + gap),
      height: gap + rows * (cell.height + gap),
      channels: 3,
      background: toHex(tokens.palette['night-800']),
    },
  })
    .composite(thumbs)
    .jpeg({ quality: 92 })
    .toFile(target);
}

// ── The build ──────────────────────────────────────────────────────────────

async function build(browser, name) {
  const campaign = readCampaign(name);
  const html = compose(campaign);

  const page = await browser.newPage();
  try {
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('requestfailed', (request) => errors.push(`request failed: ${request.url().slice(0, 120)}`));
    await page.setViewport({ width: FORMATS.feed.width + 48, height: 2000, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(async (weights) => {
      await Promise.all(weights.map((weight) => document.fonts.load(`${weight} 40px Outfit`)));
      await document.fonts.ready;
      await Promise.all([...document.images].map((image) => image.decode()));
    }, FONT_WEIGHTS);

    await page.evaluate(fitCards, FIT);
    const audit = await page.evaluate(auditCards, { weights: FONT_WEIGHTS });
    const problems = problemsOf(audit, errors);
    if (problems.length) {
      throw new Error(`${name}: ${problems.length} problem(s), nothing written.\n  - ${problems.join('\n  - ')}`);
    }

    const dir = join(OUT, name);
    mkdirSync(dir, { recursive: true });
    // The page after the fit: every size the browser settled on is in it.
    writeFileSync(join(dir, 'artes-editaveis.html'), await page.content());
    writeFileSync(join(dir, 'conteudo.json'), `${JSON.stringify(campaign, null, 2)}\n`);

    const manifest = [];
    for (const card of campaign.cards) {
      const file = join(dir, `${card.id}.png`);
      const element = await page.$(`[id="${card.id}"]`);
      await element.screenshot({ path: file, type: 'png' });
      // Measured from the file on disk, not from the page that produced it.
      const meta = await sharp(file).metadata();
      const size = FORMATS[card.format];
      if (meta.format !== 'png' || meta.width !== size.width || meta.height !== size.height) {
        throw new Error(`${name}/${card.id}.png is ${meta.format} ${meta.width}×${meta.height}, not png ${size.width}×${size.height}.`);
      }
      manifest.push({ file: `${card.id}.png`, width: meta.width, height: meta.height, bytes: statSync(file).size });
    }
    await contactSheet(manifest.map((entry) => join(dir, entry.file)), join(dir, 'PREVIA.jpg'));

    // PNGs a previous build left behind (a card renamed or removed) are
    // reported, not deleted: the folder may hold work nobody wants gone.
    const current = new Set(manifest.map((entry) => entry.file));
    const stale = readdirSync(dir).filter((file) => file.endsWith('.png') && !current.has(file));

    writeFileSync(
      join(dir, 'verificacao.json'),
      `${JSON.stringify(
        {
          campaign: name,
          generatedAt: new Date().toISOString(),
          expected: campaign.cards.length,
          count: manifest.length,
          errors,
          fonts: audit.fonts,
          checks: audit.cards,
          manifest,
          stale,
        },
        null,
        2,
      )}\n`,
    );
    return { name, dir, audit, manifest, stale };
  } finally {
    await page.close();
  }
}

function report({ name, dir, audit, manifest, stale }) {
  const photos = audit.cards.filter((card) => card.photo);
  console.log(`\n${name}: ${manifest.length} cards → ${dir}`);
  for (const entry of manifest) {
    const card = audit.cards.find((c) => `${c.id}.png` === entry.file);
    console.log(
      `  ${entry.file.padEnd(34)} ${entry.width}×${entry.height}  ${String(Math.round(entry.bytes / 1024)).padStart(5)} KB  headline ${card.head}px`,
    );
  }
  console.log(`  checks: text fits on every card · ${photos.length} photograph(s) whole · Outfit ${Object.keys(audit.fonts).join('/')} loaded · sizes confirmed with sharp`);
  if (stale.length) console.log(`  not from this build (left in place): ${stale.join(', ')}`);
}

async function main() {
  const args = process.argv.slice(2);
  const names = args.includes('--todas') ? campaignNames() : args.filter((arg) => !arg.startsWith('--'));
  if (names.length === 0) {
    console.error(`Usage: node scripts/social/build.mjs <campanha> [<campanha> …] | --todas\nCampaigns: ${campaignNames().join(', ')}`);
    process.exit(1);
  }

  const attached = Boolean(process.env.PUPPETEER_BROWSER_URL);
  const browser = attached
    ? await puppeteer.connect({ browserURL: process.env.PUPPETEER_BROWSER_URL })
    : await puppeteer.launch({ headless: true });
  const failures = [];
  try {
    for (const name of names) {
      try {
        report(await build(browser, name));
      } catch (error) {
        failures.push(error.message);
        console.error(`\n✗ ${error.message}`);
      }
    }
  } finally {
    // A browser this script did not start is left running.
    if (attached) browser.disconnect();
    else await browser.close();
  }
  if (failures.length) process.exit(1);
}

await main();
