// @vitest-environment node
//
// Image integrity: every photograph the landing page references must exist on
// disk, match its declared aspect ratio, and clear the resolution floor.
// This is the test that catches a 600×400 thumbnail being declared as
// "1600/1066" — which has happened.
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {
  images,
  stageFrames,
  posters,
  figurinos,
  estrutura,
  reels,
  manifestoFrame,
  heroMedia,
} from '@/data/images';
import { timeline } from '@/data/content';
import { blurMap } from '@/data/blur';

const PUBLIC = path.resolve(__dirname, '../../../public');
const toDisk = (url: string) => path.join(PUBLIC, url.replace(/^\//, ''));

/** Long-edge floor for anything the WEB galleries render. */
const WEB_MIN_LONG_EDGE = 640;

async function realRatio(url: string) {
  const meta = await sharp(toDisk(url)).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  return { width, height, ratio: width / height, longEdge: Math.max(width, height) };
}

function declaredRatio(aspect: string) {
  const [w, h] = aspect.split('/').map(Number);
  return w / h;
}

describe('image files', () => {
  it('every path in the images map points at a real file', () => {
    for (const [key, url] of Object.entries(images)) {
      expect(existsSync(toDisk(url)), `images.${key} → ${url} missing on disk`).toBe(true);
    }
  });

  it('every reel and its poster exist', () => {
    expect(reels.length).toBeGreaterThanOrEqual(4);
    for (const reel of reels) {
      expect(existsSync(toDisk(reel.src)), `${reel.src} missing`).toBe(true);
      expect(existsSync(toDisk(reel.poster)), `${reel.poster} missing`).toBe(true);
      expect(reel.alt).toBeTruthy();
      expect(reel.caption).toBeTruthy();
    }
  });

  it('the hero loop and its poster exist', () => {
    expect(existsSync(toDisk(heroMedia.video))).toBe(true);
    expect(existsSync(toDisk(heroMedia.poster))).toBe(true);
    expect(heroMedia.alt).toBeTruthy();
  });
});

describe('declared aspect ratios match the real files', () => {
  const TOLERANCE = 0.02;

  it('stageFrames', async () => {
    expect(stageFrames.length).toBeGreaterThanOrEqual(12);
    for (const frame of stageFrames) {
      const real = await realRatio(frame.src);
      const declared = declaredRatio(frame.aspect);
      expect(
        Math.abs(real.ratio - declared) / declared,
        `${frame.id}: declared ${frame.aspect} but file is ${real.width}x${real.height}`,
      ).toBeLessThan(TOLERANCE);
      expect(
        real.longEdge,
        `${frame.id}: ${real.width}x${real.height} is below the web gallery floor`,
      ).toBeGreaterThanOrEqual(900);
      expect(frame.alt).toBeTruthy();
      expect(frame.caption).toBeTruthy();
      expect(frame.plate).toBeGreaterThanOrEqual(0);
    }
  });

  it('timeline era photographs', async () => {
    expect(timeline.length).toBe(5);
    for (const era of timeline) {
      const real = await realRatio(era.image);
      const declared = declaredRatio(era.imageAspect);
      expect(
        Math.abs(real.ratio - declared) / declared,
        `${era.year}: declared ${era.imageAspect} but file is ${real.width}x${real.height}`,
      ).toBeLessThan(TOLERANCE);
      expect(real.longEdge, `${era.year} photo below floor`).toBeGreaterThanOrEqual(
        WEB_MIN_LONG_EDGE,
      );
      expect(era.imageAlt).toBeTruthy();
      expect(era.imageCaption).toBeTruthy();
      expect(['live', 'poster', 'vintage']).toContain(era.imageGrade);
    }
  });

  it('estrutura and manifesto frames', async () => {
    expect(estrutura.length).toBeGreaterThanOrEqual(3);
    for (const shot of estrutura) {
      const real = await realRatio(shot.src);
      const declared = declaredRatio(shot.aspect);
      expect(
        Math.abs(real.ratio - declared) / declared,
        `${shot.src}: declared ${shot.aspect} but file is ${real.width}x${real.height}`,
      ).toBeLessThan(TOLERANCE);
    }
    const manifesto = await realRatio(manifestoFrame.src);
    expect(
      Math.abs(manifesto.ratio - declaredRatio(manifestoFrame.aspect)),
    ).toBeLessThan(0.02);
  });

  it('figurinos are close to the 3/4 box they render in', async () => {
    expect(figurinos.length).toBeGreaterThanOrEqual(3);
    for (const shot of figurinos) {
      const real = await realRatio(shot.src);
      expect(
        Math.abs(real.ratio - 0.75) / 0.75,
        `${shot.src} is ${real.width}x${real.height} — too far from 3/4 to render uncropped`,
      ).toBeLessThan(0.03);
    }
  });
});

describe('posters archive', () => {
  it('contains valid entries with town, event, and category', () => {
    expect(posters.length).toBeGreaterThan(0);
    for (const poster of posters) {
      expect(existsSync(toDisk(poster.src)), `${poster.src} missing`).toBe(true);
      expect(poster.alt).toBeTruthy();
      expect(poster.town).toBeTruthy();
      expect(poster.event).toBeTruthy();
      expect(['todos', 'municipal', 'clube', 'reveillon']).toContain(poster.category);
    }
  });
});

describe('blur placeholders', () => {
  it('cover every photograph the landing page renders', () => {
    const rendered = [
      ...stageFrames.map((f) => f.src),
      ...figurinos.map((f) => f.src),
      ...estrutura.map((f) => f.src),
      ...timeline.map((e) => e.image),
      ...posters.map((p) => p.src),
      manifestoFrame.src,
      heroMedia.poster,
    ];
    for (const src of rendered) {
      expect(blurMap[src], `no blur placeholder for ${src} — run scripts/generate-blur.mjs`).toMatch(
        /^data:image\/webp;base64,/,
      );
    }
  });
});
