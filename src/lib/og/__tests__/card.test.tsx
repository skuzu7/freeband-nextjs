// @vitest-environment node
//
// The share cards, rendered for real. Each route's opengraph-image.tsx is
// called the way Next calls it and the PNG it returns is measured: the right
// size, and light enough to survive as a link preview. Satori only reports an
// unsupported style or a missing file when it draws, so nothing short of a
// render proves a card exists.
import { describe, expect, it } from 'vitest';
import * as home from '@/app/(site)/opengraph-image';
import * as arquivo from '@/app/(site)/arquivo/opengraph-image';
import * as historia from '@/app/(site)/historia/opengraph-image';
import * as palco from '@/app/(site)/palco/opengraph-image';
import * as portfolio from '@/app/(site)/portfolio/opengraph-image';
import { timeline } from '@/data/band';
import { stageFrames } from '@/data/media/frames';
import { images, ratioOf } from '@/data/media/paths';
import { posters } from '@/data/media/posters';
import { CARD_BYTES_MAX, fitWhole, ogAlt, ogContentType, ogSize, photoBySrc } from '../card';

const routes = [
  { path: '/', image: home },
  { path: '/palco', image: palco },
  { path: '/arquivo', image: arquivo },
  { path: '/historia', image: historia },
  { path: '/portfolio', image: portfolio },
];

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/** Pixel size from a PNG's IHDR, the chunk that always comes first. */
function pngSize(png: Buffer): { width: number; height: number } {
  expect(png.subarray(0, 8).equals(PNG_SIGNATURE), 'PNG signature').toBe(true);
  expect(png.toString('latin1', 12, 16)).toBe('IHDR');
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

describe.each(routes)('share card of $path', ({ image }) => {
  it('renders a 1200×630 PNG of at most 300 KB', async () => {
    const response = await image.default();
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(ogContentType);

    const png = Buffer.from(await response.arrayBuffer());
    expect(pngSize(png)).toEqual(ogSize);
    expect(pngSize(png)).toEqual({ width: 1200, height: 630 });
    expect(png.byteLength, 'bytes').toBeLessThanOrEqual(CARD_BYTES_MAX);
  });
});

describe('the ceiling', () => {
  it('is 300 KB', () => {
    // WhatsApp's link preview is where these cards matter most; read the
    // note on CARD_BYTES_MAX in card.tsx before raising this.
    expect(CARD_BYTES_MAX).toBe(300_000);
  });
});

describe('fitWhole', () => {
  // Every photograph a card may be handed: the stage, the archive, the eras.
  const photos = [...stageFrames, ...posters, ...timeline.map((era) => era.lead[0])];

  it.each(photos)('keeps $src whole: the box has the file’s own ratio', ({ aspect }) => {
    const ratio = ratioOf(aspect);
    const box = fitWhole(ratio, 72_000);
    // Rounding to whole pixels is the only difference allowed.
    expect(Math.abs(box.width / box.height / ratio - 1)).toBeLessThan(0.01);
  });

  it('gives a portrait and a landscape the same area', () => {
    const area = (box: { width: number; height: number }) => box.width * box.height;
    expect(Math.abs(area(fitWhole(3 / 4, 72_000)) / 72_000 - 1)).toBeLessThan(0.02);
    expect(Math.abs(area(fitWhole(16 / 9, 72_000)) / 72_000 - 1)).toBeLessThan(0.02);
  });
});

describe('photoBySrc', () => {
  it('returns the collection’s own entry, with its checked aspect', () => {
    const photo = photoBySrc(stageFrames, images.nauticoBandaTriangulo);
    expect(photo.aspect).toBe('1465/888');
    expect(photo.alt.length).toBeGreaterThan(0);
  });

  it('fails loudly when the photograph left the collection', () => {
    expect(() => photoBySrc(posters, images.vocalDouradoPalco)).toThrow(/no photograph/);
  });
});

describe('ogAlt', () => {
  it('names the page as it is shared, then what the photograph shows', () => {
    expect(ogAlt('O palco', { alt: 'Banda no palco' })).toBe('O palco — Internacional Freeband. Banda no palco.');
  });
});
