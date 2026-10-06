// src/lib/led/svg.ts
// Dots as SVG path data. A zero-length segment stroked with round caps is a
// dot whose diameter is the stroke width, so a whole panel is one <path> per
// dot size instead of one <circle> per dot: the home page went from 587
// circles to a dozen paths.
import type { DotGrid } from './glyphs.ts';

/** Radius of a fully lit dot, as a fraction of the pitch. */
export const MAX_RADIUS = 0.42;
/** Radius of the faintest lit dot. */
const MIN_RADIUS = 0.2;

/** A run of dots as path data, in cell units, cell centres on integers. */
export function dotsPath(dots: Iterable<readonly [number, number]>): string {
  let d = '';
  for (const [x, y] of dots) d += `M${x} ${y}h0`;
  return d;
}

export interface DotLevel {
  /** Path data: one zero-length segment per dot, on integer cell coordinates. */
  d: string;
  /** Stroke width for this level, in cell units (the dot's diameter). */
  width: number;
}

/**
 * One path per brightness level of a grid. Draw them in an
 * `<svg viewBox="0 0 {cols} {height}">` inside
 * `<g transform="translate(0.5 {offsetY + 0.5})">` with `fill="none"` and
 * `stroke-linecap="round"`.
 */
export function gridPaths(grid: DotGrid): DotLevel[] {
  const out: DotLevel[] = [];
  for (let level = 1; level <= grid.levels; level++) {
    const dots: [number, number][] = [];
    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        if (grid.cells[row * grid.cols + col] === level) dots.push([col, row]);
      }
    }
    if (!dots.length) continue;
    const radius = MIN_RADIUS + ((MAX_RADIUS - MIN_RADIUS) * (level - 1)) / Math.max(1, grid.levels - 1);
    out.push({ d: dotsPath(dots), width: +(radius * 2).toFixed(3) });
  }
  return out;
}
