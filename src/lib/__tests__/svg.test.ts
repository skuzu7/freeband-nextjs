// @vitest-environment node
//
// Dots as path data: one zero-length segment per dot, one path per size.
import { describe, expect, it } from 'vitest';
import type { DotGrid } from '../led/glyphs';
import { ledPath } from '../led/matrix';
import { MAX_RADIUS, dotsPath, gridPaths } from '../led/svg';

const countDots = (d: string) => (d.match(/M/g) ?? []).length;

describe('dotsPath', () => {
  it('writes one zero-length segment per dot, on the given coordinates', () => {
    expect(
      dotsPath([
        [0, 0],
        [12, 3],
      ]),
    ).toBe('M0 0h0M12 3h0');
  });

  it('is empty for no dots', () => {
    expect(dotsPath([])).toBe('');
  });
});

describe('gridPaths', () => {
  const grid: DotGrid = {
    cols: 3,
    rows: 2,
    height: 2,
    offsetY: 0,
    levels: 3,
    // row 0: off, level 1, level 3 — row 1: level 3, off, level 3
    cells: Uint8Array.from([0, 1, 3, 3, 0, 3]),
  };

  it('groups the lit cells by level and skips a level nobody has', () => {
    const paths = gridPaths(grid);
    expect(paths).toHaveLength(2);
    expect(paths.map((p) => countDots(p.d))).toEqual([1, 3]);
    expect(paths[0].d).toBe('M1 0h0');
    expect(paths[1].d).toBe('M2 0h0M0 1h0M2 1h0');
  });

  it('gives a brighter level a bigger dot, up to the full radius', () => {
    const [faint, full] = gridPaths(grid);
    expect(faint.width).toBeLessThan(full.width);
    expect(full.width).toBeCloseTo(MAX_RADIUS * 2, 3);
  });
});

describe('ledPath', () => {
  it('draws every cell of the matrix and, apart, the lit ones', () => {
    const { width, rows, all, lit } = ledPath('1969');
    // Four characters of 5 columns with one blank column between them.
    expect(width).toBe(4 * 6 - 1);
    expect(rows).toBe(7);
    expect(countDots(all)).toBe(4 * 5 * 7);
    expect(countDots(lit)).toBeGreaterThan(0);
    expect(countDots(lit)).toBeLessThan(countDots(all));
  });

  it('lights nothing for a blank', () => {
    expect(ledPath(' ').lit).toBe('');
  });
});
