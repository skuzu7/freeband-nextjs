// @vitest-environment node
//
// The portfolio must stay seven pages: a page that overflows silently adds an
// eighth, and every footer goes on printing "/ 07". Only a real render shows
// it, so this file lays the whole document out in Node with the real fonts and
// photographs, read from public/ through setPdfAssetBase. The last case checks
// that the site still resolves them against its own origin.
//
// To look at what it renders, run it with PDF_OUT_DIR set to a folder: the
// file is written there as portfolio-led2.pdf.
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderToBuffer } from '@react-pdf/renderer';
import { timeline } from '@/data/band';
import { PAGE_COUNT } from '../portfolio/chrome';
import { eraDigits, eraTops, erasHeight } from '../portfolio/eras';
import { PortfolioDocument } from '../portfolio/PortfolioDocument';
import { pdfUrl, registerPdfFonts, setPdfAssetBase } from '../theme';

const PUBLIC = path.resolve(__dirname, '../../../../public');

// The file weighs about 4 MB with its photographs and under 0.5 MB without
// them: anything below this floor lost them.
const MIN_BYTES = 2_500_000;
// It is sent by WhatsApp and downloaded on a phone: 5 MB is the ceiling. A
// photograph swapped for a heavier one fails here, not in someone's data plan.
const MAX_BYTES = 5_000_000;

/** Pages, counted two ways so a slip in one pattern cannot pass alone. */
function countPages(pdf: Buffer) {
  const text = pdf.toString('latin1');
  return {
    // Page objects: /Type /Page, not the /Pages node that lists them.
    objects: (text.match(/\/Type\s*\/Page\b/g) ?? []).length,
    // The total the page tree declares.
    declared: Number(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/.exec(text)?.[1]),
  };
}

describe('portfolio PDF', () => {
  let pdf: Buffer;
  // Whatever react-pdf had to say while rendering.
  const complaints: string[] = [];

  beforeAll(async () => {
    for (const level of ['warn', 'error'] as const) {
      vi.spyOn(console, level).mockImplementation((...args: unknown[]) => {
        complaints.push(`${level}: ${args.map(String).join(' ')}`);
      });
    }
    // The two bases differ on purpose. Given a URL, react-pdf fetches a font,
    // and Node's fetch has no file:// — the fonts take the plain path. Given a
    // Windows path, it fetches a photograph too (the drive letter reads as a
    // scheme) — the photographs take the file:// URL, which it reads from
    // disk on every platform.
    registerPdfFonts(PUBLIC);
    setPdfAssetBase(pathToFileURL(PUBLIC).href);
    pdf = await renderToBuffer(<PortfolioDocument />);
    const out = process.env.PDF_OUT_DIR;
    if (out) {
      mkdirSync(out, { recursive: true });
      writeFileSync(path.join(out, 'portfolio-led2.pdf'), pdf);
    }
  }, 60_000);

  afterAll(() => {
    setPdfAssetBase(null);
    vi.restoreAllMocks();
  });

  it('is exactly seven pages, the total every footer prints', () => {
    expect(PAGE_COUNT).toBe(7);
    expect(countPages(pdf)).toEqual({ objects: 7, declared: 7 });
  });

  it('prints every photograph', () => {
    // react-pdf does not fail on a photograph it cannot load: it warns, lays
    // the page out without it, and the page count still comes out right.
    expect(complaints, 'react-pdf complained while rendering').toEqual([]);
    expect(pdf.byteLength, 'the photographs are not in the file').toBeGreaterThan(MIN_BYTES);
  });

  it('stays under 5 MB', () => {
    expect(pdf.byteLength, `the file weighs ${(pdf.byteLength / 1e6).toFixed(2)} MB`).toBeLessThanOrEqual(MAX_BYTES);
  });
});

describe('the timeline axis', () => {
  const thisYear = 2026;

  it('puts every era on the dot matrix, which only has digits', () => {
    const digits = timeline.map((era) => eraDigits(era.year, thisYear));
    for (const value of digits) expect(value).toMatch(/^\d+( \d+)*$/);
    // A year reads as itself; an era named in words keeps its digits; one
    // named without any is the year the document is made.
    expect(eraDigits('1969', thisYear)).toBe('1969');
    expect(eraDigits('Anos 80–90', thisYear)).toBe('80 90');
    expect(eraDigits('Anos 2000', thisYear)).toBe('2000');
    expect(eraDigits('Hoje', thisYear)).toBe('2026');
  });

  it('gives each era a node of its own, in order, inside the rail', () => {
    const tops = eraTops(timeline.length);
    expect(tops).toHaveLength(timeline.length);
    expect(tops[0]).toBe(0);
    for (let i = 1; i < tops.length; i++) expect(tops[i]).toBeGreaterThan(tops[i - 1]);
    expect(tops.at(-1)).toBeLessThan(erasHeight(timeline.length));
  });
});

describe('pdfUrl', () => {
  afterEach(() => {
    setPdfAssetBase(null);
    vi.unstubAllGlobals();
  });

  it('stays on the page origin unless a base is set', () => {
    vi.stubGlobal('window', { location: { origin: 'https://site.test' } });
    expect(pdfUrl('/images/a.jpeg')).toBe('https://site.test/images/a.jpeg');

    setPdfAssetBase('file:///srv/public');
    expect(pdfUrl('/images/a.jpeg')).toBe('file:///srv/public/images/a.jpeg');

    setPdfAssetBase(null);
    expect(pdfUrl('/images/a.jpeg')).toBe('https://site.test/images/a.jpeg');
  });
});
