// src/lib/led/glyphs.ts
// The wordmark as a panel of dots, computed from the vector itself: which
// cells of a grid laid over the mark fall under its strokes, and how much.
// Pure arithmetic — no canvas, no DOM — so the server renders the dots into
// the HTML and the PDF, the social cards and the Open Graph image light the
// very same cells.
import { GLYPHS, WORDMARK } from '../../design/wordmark.ts';

type Point = readonly [number, number];

/** A stroke's centreline as straight pieces. `closed` joins the last point to the first. */
interface Polyline {
  points: Point[];
  closed: boolean;
}

/** Longest straight piece an arc is cut into, in wordmark units. */
const ARC_STEP = 3;

/**
 * Centre of the circle through `from` and `to` with radius `r`, picked by the
 * SVG arc flags. Every arc in the mark is circular and unrotated, which is
 * the only case handled.
 */
function arcCentre(from: Point, to: Point, r: number, large: boolean, sweep: boolean): { c: Point; r: number } {
  const hx = (from[0] - to[0]) / 2;
  const hy = (from[1] - to[1]) / 2;
  const half2 = hx * hx + hy * hy;
  // A radius too short to span the chord is grown to fit, as SVG does.
  const radius = Math.max(r, Math.sqrt(half2));
  const k = Math.sqrt(Math.max(0, radius * radius - half2) / half2) * (large !== sweep ? 1 : -1);
  return { c: [(from[0] + to[0]) / 2 + k * hy, (from[1] + to[1]) / 2 - k * hx], r: radius };
}

function arcPoints(from: Point, to: Point, r: number, large: boolean, sweep: boolean): Point[] {
  const { c, r: radius } = arcCentre(from, to, r, large, sweep);
  const a0 = Math.atan2(from[1] - c[1], from[0] - c[0]);
  let delta = Math.atan2(to[1] - c[1], to[0] - c[0]) - a0;
  // In SVG's y-down space a positive sweep is an increasing angle.
  if (sweep && delta < 0) delta += 2 * Math.PI;
  if (!sweep && delta > 0) delta -= 2 * Math.PI;
  const n = Math.max(2, Math.ceil((Math.abs(delta) * radius) / ARC_STEP));
  const out: Point[] = [];
  for (let i = 1; i <= n; i++) {
    const a = a0 + (delta * i) / n;
    out.push([c[0] + radius * Math.cos(a), c[1] + radius * Math.sin(a)]);
  }
  return out;
}

/**
 * Flattens path data into polylines. Understands the three commands the mark
 * is drawn with — absolute M, L and A — and throws on anything else, so a
 * glyph redrawn with a curve fails here and not as a silently missing letter.
 */
export function flattenPath(d: string, dx = 0): Polyline[] {
  const tokens = d.trim().split(/[\s,]+/);
  const lines: Polyline[] = [];
  let current: Point[] | null = null;
  let i = 0;
  const num = () => {
    const v = Number(tokens[i++]);
    if (Number.isNaN(v)) throw new Error(`flattenPath: expected a number in "${d}"`);
    return v;
  };
  while (i < tokens.length) {
    const cmd = tokens[i++];
    if (cmd === 'M') {
      current = [[num() + dx, num()]];
      lines.push({ points: current, closed: false });
    } else if (cmd === 'L' && current) {
      current.push([num() + dx, num()]);
    } else if (cmd === 'A' && current) {
      const r = num();
      const ry = num();
      const rotation = num();
      if (ry !== r || rotation !== 0) throw new Error(`flattenPath: only circular arcs are supported ("${d}")`);
      const large = num() === 1;
      const sweep = num() === 1;
      const to: Point = [num() + dx, num()];
      current.push(...arcPoints(current[current.length - 1], to, r, large, sweep));
    } else {
      throw new Error(`flattenPath: unsupported command "${cmd}" in "${d}"`);
    }
  }
  return lines;
}

function circle(cx: number, cy: number, r: number): Polyline {
  const n = Math.ceil((2 * Math.PI * r) / ARC_STEP);
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    const a = (2 * Math.PI * i) / n;
    points.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return { points, closed: true };
}

/** Every centreline of the mark, in viewBox units with the overhang applied. */
export function wordmarkCentrelines(): Polyline[] {
  const out: Polyline[] = [];
  for (const glyph of GLYPHS) {
    const dx = glyph.x + WORDMARK.overhang;
    if (glyph.circle) out.push(circle(WORDMARK.bowl.cx + dx, WORDMARK.bowl.cy, WORDMARK.bowl.r));
    for (const d of glyph.d) out.push(...flattenPath(d, dx));
  }
  return out;
}

/** How far along the piece a→b the point (x, y) projects: 0 at a, 1 at b. */
function along(x: number, y: number, a: Point, b: Point): number {
  const ex = b[0] - a[0];
  const ey = b[1] - a[1];
  return ((x - a[0]) * ex + (y - a[1]) * ey) / (ex * ex + ey * ey);
}

/**
 * Whether (x, y) lies under a stroke of half-width `hw` drawn along `line`
 * with butt caps: inside the band beside a piece, or in the wedge a joint
 * opens between two pieces (past the end of one and short of the start of the
 * next). The two free ends have no such wedge, so a stroke stops flat exactly
 * on its endpoint — a stem on the baseline, the r's shoulder short of the e.
 */
function underStroke(x: number, y: number, line: Polyline, hw: number): boolean {
  const { points, closed } = line;
  const hw2 = hw * hw;
  const n = points.length;
  const pieces = closed ? n : n - 1;
  // Position along the piece before the current one; none before an open start.
  let before = closed ? along(x, y, points[n - 1], points[0]) : Number.NaN;
  for (let i = 0; i < pieces; i++) {
    const a = points[i];
    const b = points[(i + 1) % n];
    const t = along(x, y, a, b);
    const px = x - a[0];
    const py = y - a[1];
    if (t >= 0 && t <= 1) {
      const qx = px - t * (b[0] - a[0]);
      const qy = py - t * (b[1] - a[1]);
      if (qx * qx + qy * qy <= hw2) return true;
    } else if (t < 0 && before > 1 && px * px + py * py <= hw2) {
      return true;
    }
    before = t;
  }
  return false;
}

export interface DotGrid {
  cols: number;
  rows: number;
  /** Height of the box in cell units; a little more than `rows`, the rest is margin. */
  height: number;
  /** Top margin in cell units, so the rows sit centred in the box. */
  offsetY: number;
  /** Per cell, row-major: 0 (unlit) to `levels` (fully under a stroke). */
  cells: Uint8Array;
  levels: number;
}

/** Sub-samples per cell side: coverage is counted on an n×n lattice. */
const SAMPLES = 3;

/**
 * The mark sampled into `cols` columns of square cells. Each cell's value is
 * how much of it the strokes cover, quantised to `levels` steps, so the edge
 * of a letter gets a smaller dot than its body — the same thing a real panel
 * does with brightness.
 */
export function wordmarkCells(cols: number, levels = 3): DotGrid {
  const { viewBox, stroke } = WORDMARK;
  const cell = viewBox.width / cols;
  const height = viewBox.height / cell;
  const rows = Math.floor(height);
  const offsetY = (height - rows) / 2;
  const lines = wordmarkCentrelines();
  const cells = new Uint8Array(cols * rows);
  const total = SAMPLES * SAMPLES;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let hits = 0;
      for (let sy = 0; sy < SAMPLES; sy++) {
        for (let sx = 0; sx < SAMPLES; sx++) {
          const x = viewBox.x + (col + (sx + 0.5) / SAMPLES) * cell;
          const y = viewBox.y + (offsetY + row + (sy + 0.5) / SAMPLES) * cell;
          if (lines.some((line) => underStroke(x, y, line, stroke / 2))) hits++;
        }
      }
      cells[row * cols + col] = Math.round((hits / total) * levels);
    }
  }
  return { cols, rows, height, offsetY, cells, levels };
}
