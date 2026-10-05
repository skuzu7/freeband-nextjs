// @vitest-environment node
//
// react-pdf hands the page's line height down as a fixed box (page font size
// × its line height), not as a multiplier. A text set larger than that box
// and given no line height of its own spills over whatever comes next: the
// portfolio's figures sat on their labels, and the phone on its link. Every
// style in the PDF components with a font size above the box has to carry a
// lineHeight.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { pdfStyles } from '../theme';

const PDF_DIR = path.resolve(__dirname, '..');
const INHERITED_BOX = Number(pdfStyles.page.fontSize) * Number(pdfStyles.page.lineHeight);

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === '__tests__' ? [] : sources(full);
    return /\.tsx?$/.test(entry.name) ? [full] : [];
  });
}

/** The object literal around `index`: from its opening brace to the matching close. */
function enclosingObject(text: string, index: number): string {
  let depth = 0;
  let start = index;
  for (; start >= 0; start--) {
    if (text[start] === '}') depth++;
    else if (text[start] === '{') {
      if (depth === 0) break;
      depth--;
    }
  }
  depth = 0;
  let end = start;
  for (; end < text.length; end++) {
    if (text[end] === '{') depth++;
    else if (text[end] === '}' && --depth === 0) break;
  }
  return text.slice(start, end + 1);
}

describe('PDF type larger than the inherited line box', () => {
  it('knows the box it is checking against', () => {
    expect(INHERITED_BOX).toBeGreaterThan(10);
    expect(INHERITED_BOX).toBeLessThan(20);
  });

  it('always sets its own line height', () => {
    const offenders: string[] = [];
    let checked = 0;
    for (const file of sources(PDF_DIR)) {
      const text = readFileSync(file, 'utf8');
      for (const match of text.matchAll(/fontSize:\s*(\d+(?:\.\d+)?)/g)) {
        if (Number(match[1]) <= INHERITED_BOX) continue;
        checked++;
        if (!/\blineHeight\b/.test(enclosingObject(text, match.index))) {
          const line = text.slice(0, match.index).split('\n').length;
          offenders.push(`${path.relative(PDF_DIR, file)}:${line} — fontSize ${match[1]} without lineHeight`);
        }
      }
    }
    // The cover's kicker, the page title, the figures, the phone and the two
    // proposal values: if this drops to zero the scan itself has gone blind.
    expect(checked).toBeGreaterThanOrEqual(6);
    expect(offenders).toEqual([]);
  });
});
