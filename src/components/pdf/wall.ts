// src/components/pdf/wall.ts
// The wall behind the wordmark, as path data: which dots of a panel larger
// than the mark are unlit, and which ones glow because a letter stands in
// front of them. Pure arithmetic over the grid src/lib/led/glyphs.ts samples
// from the vector — no react-pdf in here, so it is tested without a render.
import type { DotGrid } from '@/lib/led/glyphs';
import { dotsPath } from '@/lib/led/svg';

/** How far the wall runs past the mark, in dots. */
export interface WallPad {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface WallLayers {
  /** In dots. Dot centres fall on integers; the mark's first cell is (0, 0). */
  viewBox: { x: number; y: number; width: number; height: number };
  /** Unlit dots, one path per size: `scale` is 1 for a whole dot and falls to 0 where the wall fades out. */
  field: { d: string; scale: number }[];
  /** `glow[k]` holds the dots k + 1 away from a letter: the light it throws on the wall. */
  glow: string[];
}

/** Rows over which the unlit dots shrink towards an edge of the wall. */
export interface WallFade {
  top?: number;
  bottom?: number;
}

/** Sizes the fading edge of the wall is quantised to: one path each. */
const FADE_STEPS = 4;

/**
 * Lays a wall of dots around the mark. Every dot of the wall is in exactly
 * one layer: under a letter (those are `gridPaths(grid)`, not repeated here),
 * within `rings` dots of one (`glow`), or unlit (`field`). Along a fading
 * edge the unlit dots shrink row by row, so the panel ends in the dark
 * instead of on a ruled line.
 */
export function wallLayers(grid: DotGrid, pad: WallPad, rings = 3, fade: WallFade = {}): WallLayers {
  const width = pad.left + grid.cols + pad.right;
  const height = pad.top + grid.rows + pad.bottom;
  const at = (col: number, row: number) => (row + pad.top) * width + (col + pad.left);

  // Distance in dots from each wall cell to the nearest lit one, measured only
  // as far as the glow reaches.
  const distance = new Float32Array(width * height).fill(Number.POSITIVE_INFINITY);
  const reach = Math.ceil(rings + 0.5);
  for (let row = 0; row < grid.rows; row++) {
    for (let col = 0; col < grid.cols; col++) {
      if (grid.cells[row * grid.cols + col] === 0) continue;
      for (let dy = -reach; dy <= reach; dy++) {
        const y = row + dy;
        if (y < -pad.top || y >= grid.rows + pad.bottom) continue;
        for (let dx = -reach; dx <= reach; dx++) {
          const x = col + dx;
          if (x < -pad.left || x >= grid.cols + pad.right) continue;
          const d = Math.hypot(dx, dy);
          const i = at(x, y);
          if (d < distance[i]) distance[i] = d;
        }
      }
    }
  }

  const glow: [number, number][][] = Array.from({ length: rings }, () => []);
  const field: [number, number][][] = Array.from({ length: FADE_STEPS }, () => []);
  const firstRow = -pad.top;
  const lastRow = grid.rows + pad.bottom - 1;
  for (let row = firstRow; row <= lastRow; row++) {
    // 1 well inside the wall, down to 1/FADE_STEPS on the row at a fading edge.
    const size = Math.min(
      1,
      fade.top ? (row - firstRow + 1) / fade.top : 1,
      fade.bottom ? (lastRow - row + 1) / fade.bottom : 1,
    );
    const step = Math.max(0, Math.ceil(size * FADE_STEPS) - 1);
    for (let col = -pad.left; col < grid.cols + pad.right; col++) {
      const d = distance[at(col, row)];
      if (d === 0) continue;
      const ring = Math.round(d);
      if (ring >= 1 && ring <= rings) glow[ring - 1].push([col, row]);
      else field[step].push([col, row]);
    }
  }

  return {
    viewBox: { x: -pad.left - 0.5, y: -pad.top - 0.5, width, height },
    field: field
      .map((dots, step) => ({ d: dotsPath(dots), scale: (step + 1) / FADE_STEPS }))
      .filter((layer) => layer.d !== ''),
    glow: glow.map((dots) => dotsPath(dots)),
  };
}
