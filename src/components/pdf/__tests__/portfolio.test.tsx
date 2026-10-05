// @vitest-environment node
//
// The portfolio must stay seven pages: a page that overflows silently adds an
// eighth, and every footer goes on printing "/ 07". Only a real render shows
// it, so this file lays the whole document out in Node with the real fonts and
// photographs, read from public/ through setPdfAssetBase. The last case checks
// that the site still resolves them against its own origin.
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { renderToBuffer } from '@react-pdf/renderer';
import { PAGE_COUNT } from '../portfolio/chrome';
import { PortfolioDocument } from '../portfolio/PortfolioDocument';
import { pdfUrl, registerPdfFonts, setPdfAssetBase } from '../theme';

const PUBLIC = path.resolve(__dirname, '../../../../public');

// The file weighs about 2.5 MB with its photographs and under 0.4 MB without
// them: anything below this floor lost them.
const MIN_BYTES = 1_500_000;

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
