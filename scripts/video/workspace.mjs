// scripts/video/workspace.mjs
// Where the video pipeline reads and writes. The camera masters and everything
// cut from them live outside the repo (they are far too heavy for git), so the
// workspace root is resolved from this file — never from an absolute path:
//
//   <root>/freeband-nextjs/   this repo
//   <root>/fontes/            irreplaceable sources (masters) — read only
//   <root>/saidas/            what the pipelines generate — always regenerable
//
// FREEBAND_FONTES and FREEBAND_SAIDAS point somewhere else when needed (an
// external disk with the masters, a CI cache).
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const ROOT = resolve(APP, '..');
export const FONTES = process.env.FREEBAND_FONTES ?? resolve(ROOT, 'fontes');
export const SAIDAS = process.env.FREEBAND_SAIDAS ?? resolve(ROOT, 'saidas');

/**
 * The band's AVCHD masters: 1440×1080 anamorphic (SAR 4:3 → 1920×1080),
 * 59.94i top field first, AC-3 5.1(side), plus a PGS subtitle track that every
 * command drops with -sn.
 */
export const MASTERS = {
  ok: resolve(FONTES, 'video', 'masters', 'ok.m2ts'),
  top: resolve(FONTES, 'video', 'masters', 'top.m2ts'),
  'top-1': resolve(FONTES, 'video', 'masters', 'top-1.m2ts'),
};

/** Contact sheets and loudness curves, one pair per master. */
export const ANALYSIS = resolve(SAIDAS, 'video', 'analise');
/** The clips, posters, level envelopes and manifest the site consumes. */
export const SITE = resolve(SAIDAS, 'video', 'site');

/**
 * Seek back this long before every cut and trim it off inside the filter
 * graph: the first frames after a jump in an .m2ts come without their
 * reference pictures (open GOPs), and the AC-3 decoder needs a frame to settle.
 */
export const PRE = 1.5;

/**
 * Field-aware deinterlace to one progressive frame per interlaced frame
 * (29.97p). It reads the neighbouring fields, so it goes before any filter
 * that drops frames.
 */
export const DEINTERLACE = 'bwdif=mode=send_frame:parity=tff:deint=all';

/** The master's path, or a clear error naming what is missing. */
export function masterPath(name) {
  const file = MASTERS[name];
  if (!file) throw new Error(`Unknown master "${name}". Known: ${Object.keys(MASTERS).join(', ')}.`);
  if (!existsSync(file)) throw new Error(`Master not found: ${file} (set FREEBAND_FONTES?).`);
  return file;
}

// Decoder chatter about the open GOP at the seek point; the PRE roll exists
// precisely so those frames never reach the output. Fontconfig complains about
// a missing config file on Windows and then draws with its built-in font.
const NOISE = /reference picture missing|Missing reference picture|mmco: unref short failure|Fontconfig error/;

/**
 * Runs ffmpeg/ffprobe to the end; throws with the real stderr on failure.
 * `binary` returns stdout as a Buffer (raw PCM), otherwise as text.
 */
export function run(bin, args, { binary = false } = {}) {
  const r = spawnSync(bin, args, { maxBuffer: 256 * 1024 * 1024 });
  if (r.error) throw new Error(`${bin} did not start: ${r.error.message}`);
  const stderr = r.stderr?.toString('utf8') ?? '';
  if (r.status !== 0) {
    const real = stderr.split('\n').filter((l) => l.trim() && !NOISE.test(l)).slice(-12).join('\n');
    throw new Error(`${bin} exited with ${r.status}:\n${real}`);
  }
  return { stdout: binary ? r.stdout : r.stdout.toString('utf8'), stderr };
}

/** ffprobe as parsed JSON. */
export function probe(file, entries, extra = []) {
  const { stdout } = run('ffprobe', ['-v', 'error', ...extra, '-show_entries', entries, '-of', 'json', file]);
  return JSON.parse(stdout);
}
