// scripts/optimize-images.mjs
// Recompresses oversized JPEGs in public/images in place: bakes EXIF
// orientation, resizes to a max width of 2560px and re-encodes with mozjpeg.
// Run it whenever new photos land in the repo (`npm run optimize:images`).
// Each processed original is copied to BACKUP_DIR first (default
// ./screenshots/originals — gitignored) so the result can be compared.
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  renameSync,
  statSync,
} from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMAGES_DIR = "public/images";
const THRESHOLD_BYTES = 400 * 1024;
const MAX_WIDTH = 2560;
const BACKUP_DIR = process.env.BACKUP_DIR ?? "screenshots/originals";

const candidates = readdirSync(IMAGES_DIR)
  .filter((name) => /\.(jpe?g)$/i.test(name))
  .map((name) => path.join(IMAGES_DIR, name))
  .filter((file) => statSync(file).size > THRESHOLD_BYTES);

if (candidates.length === 0) {
  console.log("Nothing to do — no JPEG above the size threshold.");
  process.exit(0);
}

mkdirSync(BACKUP_DIR, { recursive: true });

for (const file of candidates) {
  const before = statSync(file).size;
  copyFileSync(file, path.join(BACKUP_DIR, path.basename(file)));

  const tmp = `${file}.tmp`;
  await sharp(file)
    .rotate() // bake EXIF orientation before metadata is stripped
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true, progressive: true })
    .toFile(tmp);
  renameSync(tmp, file);

  const after = statSync(file).size;
  const pct = ((1 - after / before) * 100).toFixed(0);
  console.log(
    `${path.basename(file)}: ${(before / 1024 / 1024).toFixed(1)} MB -> ${(after / 1024 / 1024).toFixed(2)} MB (-${pct}%)`,
  );
}
