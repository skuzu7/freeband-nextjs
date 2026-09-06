// @vitest-environment node
//
// Media integrity. Every photograph the site renders must exist on disk,
// declare its REAL aspect ratio (±2%), clear the resolution floor for the
// gallery it appears in, and have a blur placeholder in the generated
// src/data/blur.ts. Photographs are never cropped by their boxes, so a wrong
// aspect is a visible layout bug — this is the test that catches it.
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { images } from '@/data/media/paths';
import { stageFrames, retratoPaete, STAGE_CATEGORIES } from '@/data/media/frames';
import { figurinos } from '@/data/media/figurinos';
import { estrutura } from '@/data/media/estrutura';
import { reels } from '@/data/media/reels';
import { posters, POSTER_CATEGORIES } from '@/data/media/posters';
import { heroMedia } from '@/data/media/hero';
import { timeline } from '@/data/band';
import { blocos } from '@/data/copy/home';
import { blurMap } from '@/data/blur';
import { pdfPhotoList } from '@/components/pdf/portfolio/images';

const PUBLIC = path.resolve(__dirname, '../../../public');
const toDisk = (url: string) => path.join(PUBLIC, url.replace(/^\//, ''));

/** Long-edge floor for the big galleries (Palco, Blocos). */
const GALLERY_MIN_LONG_EDGE = 900;
/** Long-edge floor for the smaller frames (eras, posters). */
const FRAME_MIN_LONG_EDGE = 640;
const TOLERANCE = 0.02;

async function real(url: string) {
  const meta = await sharp(toDisk(url)).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  return { width, height, ratio: width / height, longEdge: Math.max(width, height) };
}

function declared(aspect: string) {
  const [w, h] = aspect.split('/').map(Number);
  return w / h;
}

async function expectAspect(url: string, aspect: string, label: string) {
  const r = await real(url);
  expect(
    Math.abs(r.ratio - declared(aspect)) / declared(aspect),
    `${label}: declared ${aspect} but file is ${r.width}x${r.height}`,
  ).toBeLessThan(TOLERANCE);
  return r;
}

describe('files', () => {
  it('every path in the images registry points at a real file', () => {
    for (const [key, url] of Object.entries(images)) {
      expect(existsSync(toDisk(url)), `images.${key} → ${url} missing on disk`).toBe(true);
    }
  });

  it('every reel and its poster exist and carry alt + caption', () => {
    expect(reels.length).toBeGreaterThanOrEqual(4);
    for (const reel of reels) {
      expect(existsSync(toDisk(reel.src)), `${reel.src} missing`).toBe(true);
      expect(existsSync(toDisk(reel.poster)), `${reel.poster} missing`).toBe(true);
      expect(reel.alt).toBeTruthy();
      expect(reel.caption).toBeTruthy();
    }
  });

  it('the hero loop and its poster exist', async () => {
    expect(existsSync(toDisk(heroMedia.video))).toBe(true);
    expect(existsSync(toDisk(heroMedia.poster))).toBe(true);
    expect(heroMedia.alt).toBeTruthy();
    await expectAspect(heroMedia.poster, heroMedia.aspect, 'hero poster');
  });
});

describe('aspect ratios and resolution', () => {
  it('stageFrames — 14 frames in three acts, gallery floor', async () => {
    expect(stageFrames.length).toBe(14);
    for (const frame of stageFrames) {
      const r = await expectAspect(frame.src, frame.aspect, frame.id);
      expect(r.longEdge, `${frame.id} below gallery floor`).toBeGreaterThanOrEqual(GALLERY_MIN_LONG_EDGE);
      expect(frame.alt).toBeTruthy();
      expect(frame.caption).toBeTruthy();
      expect(frame.plate).toBeGreaterThanOrEqual(0);
      expect(STAGE_CATEGORIES).toContain(frame.category);
    }
    for (const cat of STAGE_CATEGORIES) {
      expect(stageFrames.some((f) => f.category === cat), `act ${cat} is empty`).toBe(true);
    }
  });

  it('timeline — five eras, each with its own whole photograph', async () => {
    expect(timeline.length).toBe(5);
    for (const era of timeline) {
      const r = await expectAspect(era.image.src, era.image.aspect, era.year);
      expect(r.longEdge, `${era.year} photo below floor`).toBeGreaterThanOrEqual(FRAME_MIN_LONG_EDGE);
      expect(era.image.alt).toBeTruthy();
      expect(era.image.caption).toBeTruthy();
    }
  });

  it('figurinos, estrutura and the paetê portrait', async () => {
    expect(figurinos.length).toBe(3);
    for (const shot of figurinos) await expectAspect(shot.src, shot.aspect, shot.caption);
    expect(estrutura.length).toBe(3);
    for (const shot of estrutura) await expectAspect(shot.src, shot.aspect, shot.caption);
    await expectAspect(retratoPaete.src, retratoPaete.aspect, 'retratoPaete');
  });

  it('posters — nine flyers, each with town, event, category and real aspect', async () => {
    // No resolution floor: five of the flyers only survive as 400×300 scans,
    // and they are artefacts printed small, not gallery photographs.
    expect(posters.length).toBe(9);
    for (const poster of posters) {
      await expectAspect(poster.src, poster.aspect, poster.town);
      expect(poster.alt).toBeTruthy();
      expect(poster.town).toBeTruthy();
      expect(poster.event).toBeTruthy();
      expect(POSTER_CATEGORIES).toContain(poster.category);
    }
  });

  it('portfolio PDF — every frame declares its real aspect, so plate rows print it whole', async () => {
    expect(pdfPhotoList.length).toBeGreaterThan(0);
    for (const frame of pdfPhotoList) await expectAspect(frame.src, frame.aspect, `pdf ${frame.src}`);
  });

  it('blocos temáticos — one big photo each, gallery floor', async () => {
    expect(blocos.items.length).toBe(4);
    for (const bloco of blocos.items) {
      const r = await expectAspect(bloco.photo.src, bloco.photo.aspect, bloco.title);
      expect(r.longEdge).toBeGreaterThanOrEqual(GALLERY_MIN_LONG_EDGE);
      if (bloco.figurino) await expectAspect(bloco.figurino.src, bloco.figurino.aspect, `${bloco.title} figurino`);
    }
  });
});

describe('next/image quality values', () => {
  it('every quality literal in src/ is whitelisted in next.config.ts', async () => {
    const config = await readFile(path.resolve(__dirname, '../../../next.config.ts'), 'utf8');
    const allowed = (config.match(/qualities:\s*\[([^\]]+)\]/)?.[1] ?? '')
      .split(',')
      .map((n) => Number(n.trim()));
    expect(allowed.length).toBeGreaterThan(0);

    const src = path.resolve(__dirname, '../..');
    const entries = await readdir(src, { recursive: true });
    const offenders: string[] = [];
    for (const relative of entries) {
      if (!relative.endsWith('.tsx')) continue;
      const file = path.join(src, relative);
      const source = await readFile(file, 'utf8');
      for (const match of source.matchAll(/quality=\{(\d+)\}/g)) {
        const value = Number(match[1]);
        if (!allowed.includes(value)) offenders.push(`${path.basename(file)}: quality={${value}}`);
      }
    }
    expect(offenders, `not in images.qualities [${allowed}]`).toEqual([]);
  });
});

describe('blur placeholders', () => {
  it('cover every photograph the site renders', () => {
    const rendered = [
      ...stageFrames.map((f) => f.src),
      ...figurinos.map((f) => f.src),
      ...estrutura.map((f) => f.src),
      ...timeline.map((e) => e.image.src),
      ...posters.map((p) => p.src),
      ...reels.map((r) => r.poster),
      ...blocos.items.flatMap((b) => [b.photo.src, b.figurino?.src].filter((s): s is string => !!s)),
      retratoPaete.src,
      heroMedia.poster,
    ];
    for (const src of rendered) {
      expect(blurMap[src], `no blur placeholder for ${src} — run scripts/generate-blur.mjs`).toMatch(
        /^data:image\/webp;base64,/,
      );
    }
  });
});
