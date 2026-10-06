// scripts/import-archive.mjs
// Brings the band's own archive prints into public/images. The sources are
// phone photographs of paper prints — on a table, in a frame, in a plastic
// sleeve, some lying sideways — so each one is stood upright and trimmed to
// the print itself: what leaves is the table, never part of the picture. The
// trim is a preparation of the file, like a scan; on the site the photograph
// is then shown whole, as every other one is.
//
// The table below IS the record of what was done to each file: rotation in
// degrees clockwise, then the box kept, in percent of the rotated image
// (left, top, right, bottom). Re-running it rewrites the same files.
//
//   node scripts/import-archive.mjs            import every print
//   node scripts/import-archive.mjs --check    only report what would be written
//
// Sources live outside the repository, in the workspace's fontes/ (read-only):
// FREEBAND_FONTES overrides where that is. After importing, run `npm run blur`.
import { existsSync, mkdirSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const APP = path.resolve(import.meta.dirname, '..');
const FONTES = process.env.FREEBAND_FONTES ?? path.resolve(APP, '..', 'fontes');
const OUT = path.join(APP, 'public', 'images');
/** Longest side written. The prints carry no more detail than this. */
const MAX_EDGE = 1600;
const QUALITY = 90;

const BATCH = 'fotos/recebidas/2026-10-06';

/** @type {{ from: string, to: string, rotate?: number, keep: [number, number, number, number] }[]} */
const PRINTS = [
  { from: `${BATCH}/wa-20261005-174742.jpeg`, to: 'arquivo-bateria-e-metais.jpeg', keep: [3.5, 0, 95, 100] },
  { from: `${BATCH}/wa-20261005-174741.jpeg`, to: 'arquivo-formacao-de-branco.jpeg', rotate: 270, keep: [5, 4, 83, 89] },
  { from: `${BATCH}/wa-20261005-174740.jpeg`, to: 'arquivo-cartaz-de-branco.jpeg', keep: [0, 4, 100, 91.5] },
  { from: `${BATCH}/wa-20261005-174645.jpeg`, to: 'arquivo-guitarra-e-teclado.jpeg', keep: [0, 0, 100, 94] },
  { from: `${BATCH}/wa-20261005-174738.jpeg`, to: 'arquivo-palco-de-branco.jpeg', rotate: 270, keep: [7, 0, 100, 97] },
  { from: `${BATCH}/wa-20261005-174739.jpeg`, to: 'arquivo-guitarrista-fev-85.jpeg', keep: [2, 1, 97, 97] },
  { from: `${BATCH}/wa-20261005-174743-1.jpeg`, to: 'arquivo-vozes-fev-85.jpeg', keep: [5, 2, 97, 97] },
  { from: `${BATCH}/wa-20261005-174743.jpeg`, to: 'arquivo-grupo-de-vermelho.jpeg', keep: [0, 0, 100, 97] },
  { from: `${BATCH}/wa-20261005-174739-1.jpeg`, to: 'arquivo-palco-cortina-vermelha.jpeg', keep: [0, 0, 100, 100] },
  { from: `${BATCH}/wa-20261005-174744.jpeg`, to: 'arquivo-palco-e-mesa-de-som.jpeg', keep: [0, 0, 99, 100] },
];

const check = process.argv.includes('--check');
if (!existsSync(FONTES)) {
  console.error(`Sources not found at ${FONTES} — set FREEBAND_FONTES.`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

let failed = false;
for (const print of PRINTS) {
  const source = path.join(FONTES, print.from);
  if (!existsSync(source)) {
    console.error(`missing source: ${print.from}`);
    failed = true;
    continue;
  }
  // Rotate first, in its own pass: the box below is measured on the upright image.
  const upright = await sharp(source).rotate(print.rotate ?? 0).toBuffer({ resolveWithObject: true });
  const { width, height } = upright.info;
  const [l, t, r, b] = print.keep;
  const box = {
    left: Math.round((width * l) / 100),
    top: Math.round((height * t) / 100),
    width: Math.round((width * (r - l)) / 100),
    height: Math.round((height * (b - t)) / 100),
  };
  const pipeline = sharp(upright.data)
    .extract(box)
    .resize(MAX_EDGE, MAX_EDGE, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true });
  const target = path.join(OUT, print.to);
  if (check) {
    const { info } = await pipeline.toBuffer({ resolveWithObject: true });
    console.log(`${print.to}  ${info.width}/${info.height}  ${info.size} B  (not written)`);
  } else {
    const info = await pipeline.toFile(target);
    console.log(`${print.to}  ${info.width}/${info.height}  ${statSync(target).size} B`);
  }
}
if (failed) process.exit(1);
