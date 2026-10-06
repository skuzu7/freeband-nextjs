// src/lib/led/matrix.ts
// The 5×7 dot matrix behind LedNumber: which cells of a string are lit, in
// cell units. Pure data and arithmetic — no DOM, no React — so the site's SVG
// and the PDF draw the same layout.

// 5 columns × 7 rows, top to bottom. 1 = lit.
//
// The zero is an open oval, with no slash through it. A slash tells a zero
// from the letter O, and this matrix has no letters; what it cost was the
// zero itself: set small (a year on the timeline of the PDF, the date on a
// proposal) the diagonal closed the counter and "2000" read as "2888". Zero
// and eight now differ where it shows — the middle row, open or shut.
const MATRIX: Record<string, string[]> = {
  '0': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

const COLS = 5;
const ROWS = 7;
/** One blank column between characters. */
const ADVANCE = COLS + 1;

export interface LedDot {
  x: number;
  y: number;
  on: boolean;
  /** Index among the lit dots (for staggering), -1 when unlit. */
  i: number;
}

/**
 * The dot layout for a string, in cell units. Shared with the PDF, which
 * draws the same matrix with react-pdf's Svg/Circle.
 */
export function ledDots(value: string): { width: number; rows: number; dots: LedDot[] } {
  const chars = Array.from(value);
  const width = chars.length * ADVANCE - 1;
  const dots: LedDot[] = [];
  let lit = 0;
  chars.forEach((ch, ci) => {
    const glyph = MATRIX[ch] ?? MATRIX[' '];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const on = glyph[y][x] === '1';
        dots.push({ x: ci * ADVANCE + x, y, on, i: on ? lit++ : -1 });
      }
    }
  });
  return { width, rows: ROWS, dots };
}

/**
 * The same layout as two SVG paths — every cell, and the lit ones — each dot
 * a zero-length segment (stroke it with round caps). Cell centres fall on
 * integers: draw inside `<g transform="translate(0.5 0.5)">`.
 */
export function ledPath(value: string): { width: number; rows: number; all: string; lit: string } {
  const { width, rows, dots } = ledDots(value);
  let all = '';
  let lit = '';
  for (const d of dots) {
    const dot = `M${d.x} ${d.y}h0`;
    all += dot;
    if (d.on) lit += dot;
  }
  return { width, rows, all, lit };
}
