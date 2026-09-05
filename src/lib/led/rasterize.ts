// src/lib/led/rasterize.ts
// Pure arithmetic behind the LED panel: turn a pixel buffer into a grid of
// dot intensities, decide how big and what colour each dot is, and in what
// order the panel lights up. No DOM here — see sources.ts for the canvas side.

export interface Grid {
  cols: number;
  rows: number;
}

/** Rec. 709 luma of an sRGB triple, 0..255. */
export function luma(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Box-filters an RGBA buffer of `width`×`height` into `cols`×`rows` cells.
 * Each cell is the mean alpha-weighted luma of the pixels it covers, 0..255.
 * Cell edges are computed in floating point so uneven divisions still cover
 * the whole image.
 */
export function sampleGrid(
  rgba: ArrayLike<number>,
  width: number,
  height: number,
  cols: number,
  rows: number,
): Uint8Array {
  const out = new Uint8Array(cols * rows);
  const cellW = width / cols;
  const cellH = height / rows;
  for (let row = 0; row < rows; row++) {
    const y0 = Math.floor(row * cellH);
    const y1 = Math.max(y0 + 1, Math.floor((row + 1) * cellH));
    for (let col = 0; col < cols; col++) {
      const x0 = Math.floor(col * cellW);
      const x1 = Math.max(x0 + 1, Math.floor((col + 1) * cellW));
      let sum = 0;
      let n = 0;
      for (let y = y0; y < y1 && y < height; y++) {
        for (let x = x0; x < x1 && x < width; x++) {
          const i = (y * width + x) * 4;
          const a = rgba[i + 3] / 255;
          sum += luma(rgba[i], rgba[i + 1], rgba[i + 2]) * a;
          n++;
        }
      }
      out[row * cols + col] = n ? Math.round(sum / n) : 0;
    }
  }
  return out;
}

/**
 * Picks a grid for a box of the given aspect (w/h) with about `cols` columns,
 * scaled down until cols×rows ≤ maxDots. The cap is what keeps the canvas
 * cheap on a weak phone: never more than a few thousand arcs per frame.
 */
export function fitGrid(aspect: number, cols: number, maxDots = 6000): Grid {
  let c = Math.max(1, Math.round(cols));
  let r = Math.max(1, Math.round(c / aspect));
  if (c * r > maxDots) {
    const scale = Math.sqrt(maxDots / (c * r));
    c = Math.max(1, Math.floor(c * scale));
    r = Math.max(1, Math.floor(r * scale));
  }
  return { cols: c, rows: r };
}

export type LightUpMode = 'sweep' | 'radial' | 'scatter';

/** Deterministic 0..1 noise (mulberry32). */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Per-cell delay, normalised to [0, 1], for the light-up animation.
 * sweep: left → right. radial: centre → edges. scatter: seeded random.
 */
export function lightUpOrder(cols: number, rows: number, mode: LightUpMode, seed = 1): Float32Array {
  const out = new Float32Array(cols * rows);
  if (mode === 'sweep') {
    const denom = Math.max(1, cols - 1);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out[r * cols + c] = c / denom;
    return out;
  }
  if (mode === 'radial') {
    const cx = (cols - 1) / 2;
    const cy = (rows - 1) / 2;
    const maxD = Math.hypot(cx, cy) || 1;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) out[r * cols + c] = Math.hypot(c - cx, r - cy) / maxD;
    return out;
  }
  const next = rng(seed);
  for (let i = 0; i < out.length; i++) out[i] = next();
  return out;
}

/**
 * Dot radius for an intensity 0..255. An unlit dot keeps `minRatio` of the
 * maximum so the panel reads as a panel even where nothing is drawn.
 */
export function dotRadius(intensity: number, maxRadius: number, minRatio = 0.22): number {
  const t = Math.min(255, Math.max(0, intensity)) / 255;
  return maxRadius * (minRatio + (1 - minRatio) * t);
}

/**
 * Auto-levels: stretches the grid so its darkest cell is 0 and its brightest
 * 255, then applies a gamma (γ < 1 lifts the mid-tones). Photographs sampled
 * into a few thousand cells come out muddy without it. A flat grid is
 * returned unchanged.
 */
export function levels(grid: Uint8Array, gamma = 1): Uint8Array {
  let min = 255;
  let max = 0;
  for (const v of grid) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const out = new Uint8Array(grid.length);
  if (max <= min) {
    out.set(grid);
    return out;
  }
  const range = max - min;
  for (let i = 0; i < grid.length; i++) {
    const t = (grid[i] - min) / range;
    out[i] = Math.round(255 * t ** gamma);
  }
  return out;
}

/** 0..255 → 0..levels-1. */
export function quantize(intensity: number, levels: number): number {
  return Math.min(levels - 1, Math.round((intensity / 255) * (levels - 1)));
}

export interface DotLayout {
  /** Distance between dot centres, in box units. */
  pitch: number;
  /** Where the first dot centre sits (left/top inset), so the grid is centred. */
  offsetX: number;
  offsetY: number;
  /** Largest radius a fully lit dot may have. */
  maxRadius: number;
}

/** Centres a cols×rows grid in a width×height box with square pitch. */
export function layoutDots(cols: number, rows: number, width: number, height: number): DotLayout {
  const pitch = Math.min(width / cols, height / rows);
  const gridW = pitch * cols;
  const gridH = pitch * rows;
  return {
    pitch,
    offsetX: (width - gridW) / 2 + pitch / 2,
    offsetY: (height - gridH) / 2 + pitch / 2,
    maxRadius: pitch * 0.42,
  };
}

/**
 * A CSS <time> in milliseconds. Computed custom properties come back
 * normalised ("900ms" → ".9s"), so the unit has to be honoured — parseFloat
 * alone read 0.9 ms and finished every light-up in a single frame.
 */
export function parseDurationMs(raw: string, fallback = 900): number {
  const m = /^\s*([\d.]+)\s*(ms|s)?\s*$/i.exec(raw);
  if (!m) return fallback;
  const value = parseFloat(m[1]);
  if (!Number.isFinite(value)) return fallback;
  return m[2]?.toLowerCase() === 's' ? value * 1000 : value;
}
