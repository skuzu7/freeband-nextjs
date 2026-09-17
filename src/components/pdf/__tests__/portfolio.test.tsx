// @vitest-environment node
//
// The portfolio must stay seven pages: a page that overflows silently adds an
// eighth, and every footer would then print the wrong count. Nothing but a
// real render can check that, so this test renders the whole document with
// the real fonts and photographs. It is the slowest test in the suite.
import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { renderToBuffer } from '@react-pdf/renderer';
import { registerPdfFonts, setPdfAssetBase } from '../theme';
import { PAGE_COUNT } from '../portfolio/chrome';
import { PortfolioDocument } from '../portfolio/PortfolioDocument';

const PUBLIC = path.resolve(__dirname, '../../../../public');

/** Page objects in the PDF, counted two ways so a parsing slip cannot pass. */
function countPages(pdf: Buffer): { objects: number; declared: number } {
  const text = pdf.toString('latin1');
  const objects = (text.match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;
  const declared = Number(/\/Type\s*\/Pages[\s\S]{0,300}?\/Count\s+(\d+)/.exec(text)?.[1] ?? NaN);
  return { objects, declared };
}

beforeAll(() => {
  // A plain path, not file://, so react-pdf opens the fonts and photographs
  // from disk instead of trying to fetch them.
  setPdfAssetBase(PUBLIC);
  registerPdfFonts(PUBLIC);
});

describe('portfolio PDF', () => {
  it(`renders exactly ${PAGE_COUNT} pages, as every footer claims`, async () => {
    const pdf = await renderToBuffer(<PortfolioDocument />);
    expect(pdf.byteLength).toBeGreaterThan(50_000);
    const pages = countPages(pdf);
    expect(pages.declared).toBe(PAGE_COUNT);
    expect(pages.objects).toBe(PAGE_COUNT);
  }, 60_000);
});
