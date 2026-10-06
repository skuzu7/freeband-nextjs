// @vitest-environment node
//
// The wordmark in dots is computed from the vector. These pin the geometry:
// arcs land where SVG puts them, strokes end flat (butt caps), and the grid
// lights the cells a reader of the mark would expect.
import { describe, expect, it } from 'vitest';
import { GLYPHS, WORDMARK } from '@/design/wordmark';
import { flattenPath, wordmarkCells, wordmarkCentrelines } from '../led/glyphs';

describe('flattenPath', () => {
  it('follows M and L exactly and applies the offset', () => {
    const [line] = flattenPath('M 9.5 200 L 9.5 117', 100);
    expect(line.closed).toBe(false);
    expect(line.points).toEqual([
      [109.5, 200],
      [109.5, 117],
    ]);
  });

  it('keeps every point of an arc on its circle and ends on the endpoint', () => {
    // The hook of the f: a quarter turn about (44, 117) with radius 34.5.
    const [line] = flattenPath('M 9.5 117 A 34.5 34.5 0 0 1 44 82.5');
    for (const [x, y] of line.points) {
      expect(Math.hypot(x - 44, y - 117)).toBeCloseTo(34.5, 6);
    }
    const [endX, endY] = line.points[line.points.length - 1];
    expect(endX).toBeCloseTo(44, 6);
    expect(endY).toBeCloseTo(82.5, 6);
    // It bends up and to the right: nothing strays left of the stem or below it.
    for (const [x, y] of line.points) {
      expect(x).toBeGreaterThanOrEqual(9.5 - 1e-6);
      expect(y).toBeLessThanOrEqual(117 + 1e-6);
    }
  });

  it('takes the long way round when the large-arc flag is set', () => {
    // The ring of the e: more than half a turn about (50, 150).
    const [line] = flattenPath('M 90.3 153.5 A 40.5 40.5 0 1 0 73.2 183.2');
    const xs = line.points.map(([x]) => x);
    expect(Math.min(...xs)).toBeCloseTo(50 - 40.5, 0);
  });

  it('refuses a command the mark is not drawn with', () => {
    expect(() => flattenPath('M 0 0 C 1 1 2 2 3 3')).toThrow(/unsupported command/);
    expect(() => flattenPath('M 0 0 A 10 20 0 0 1 5 5')).toThrow(/circular/);
  });
});

describe('wordmarkCentrelines', () => {
  it('has one closed bowl per b, a and d and understands every glyph', () => {
    const lines = wordmarkCentrelines();
    expect(lines.filter((l) => l.closed)).toHaveLength(GLYPHS.filter((g) => g.circle).length);
    expect(lines.length).toBeGreaterThanOrEqual(GLYPHS.length);
  });
});

describe('wordmarkCells', () => {
  const grid = wordmarkCells(128);
  const at = (col: number, row: number) => grid.cells[row * grid.cols + col];
  /** Column of a given x in wordmark units (overhang already applied). */
  const colOf = (x: number) => Math.floor(x / (WORDMARK.viewBox.width / grid.cols));

  it('sizes the grid to the box of the mark with square cells', () => {
    expect(grid.cols).toBe(128);
    expect(grid.rows).toBe(Math.floor(grid.height));
    expect(grid.height).toBeCloseTo(128 * (WORDMARK.viewBox.height / WORDMARK.viewBox.width), 6);
    expect(grid.offsetY).toBeGreaterThanOrEqual(0);
    expect(grid.offsetY).toBeLessThan(0.5);
    expect(grid.cells).toHaveLength(grid.cols * grid.rows);
  });

  it('lights a readable share of the panel, never beyond the top level', () => {
    const lit = grid.cells.filter((v) => v > 0).length;
    expect(lit / grid.cells.length).toBeGreaterThan(0.15);
    expect(lit / grid.cells.length).toBeLessThan(0.6);
    expect(Math.max(...grid.cells)).toBe(grid.levels);
  });

  it('runs the stem of the b from the ascender to the baseline', () => {
    const b = GLYPHS[4];
    const col = colOf(b.x + WORDMARK.overhang + 9.5);
    for (let row = 0; row < grid.rows; row++) expect(at(col, row), `row ${row}`).toBeGreaterThan(0);
  });

  it('stops the n at the x-height: the rows above it stay dark', () => {
    const n = GLYPHS[6];
    const col = colOf(n.x + WORDMARK.overhang + 9.5);
    expect(at(col, 0)).toBe(0);
    expect(at(col, grid.rows - 1)).toBeGreaterThan(0);
  });

  it('leaves the gap between two letters unlit', () => {
    // Between the r (ends at x=95) and the first e (starts at x=105).
    const col = colOf(WORDMARK.overhang + 100);
    for (let row = 0; row < grid.rows; row++) expect(at(col, row), `row ${row}`).toBe(0);
  });

  it('is the same grid every time', () => {
    expect(Array.from(wordmarkCells(128).cells)).toEqual(Array.from(grid.cells));
  });
});
