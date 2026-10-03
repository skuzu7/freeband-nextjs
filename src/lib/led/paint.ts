// src/lib/led/paint.ts
// The one loop that paints a grid of LED dots onto a 2D context, shared by
// the panel and the marquee. Dots are batched into one path per palette level
// so a frame costs `palette.length` fills, not one per dot.
import { dotRadius, quantize, type DotLayout, type Grid } from './rasterize';

interface PaintOptions {
  /** Leave out cells whose intensity is 0 instead of drawing them dim. */
  skipUnlit?: boolean;
  /** Per-cell multiplier 0..1 (the light-up); omitted means fully on. */
  progress?: (i: number) => number;
}

/**
 * Paints `cells` (row-major intensities 0..255) as dots laid out by `layout`,
 * coloured by `palette` (dimmest first). The caller owns the transform and
 * clears the canvas; this only fills.
 */
export function paintDots(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  cells: ArrayLike<number>,
  grid: Grid,
  layout: DotLayout,
  palette: readonly string[],
  opts: PaintOptions = {},
): void {
  const { skipUnlit = false, progress } = opts;
  const paths = Array.from({ length: palette.length }, () => new Path2D());
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const i = r * grid.cols + c;
      const v = progress ? cells[i] * progress(i) : cells[i];
      // Over a photograph the switched-off cells are not drawn at all.
      if (skipUnlit && v <= 0) continue;
      const level = quantize(v, palette.length);
      const radius = dotRadius(v, layout.maxRadius);
      const x = layout.offsetX + c * layout.pitch;
      const y = layout.offsetY + r * layout.pitch;
      paths[level].moveTo(x + radius, y);
      paths[level].arc(x, y, radius, 0, Math.PI * 2);
    }
  }
  for (let l = 0; l < palette.length; l++) {
    ctx.fillStyle = palette[l];
    ctx.fill(paths[l]);
  }
}
