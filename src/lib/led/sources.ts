// src/lib/led/sources.ts
// Browser-side pixel sources for the LED panel. Each one paints something —
// text, the wordmark's vector glyphs, a photograph — white on transparent
// into an offscreen canvas a few pixels per LED cell, and hands back the RGBA
// buffer for sampleGrid() in rasterize.ts to box-filter.
import type { Glyph } from '@/components/brand/Wordmark';

export interface PixelSource {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/** Pixels painted per LED cell on each axis. 3 gives a clean box filter. */
export const SUPERSAMPLE = 3;

type Ctx2D = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

function makeContext(width: number, height: number): Ctx2D | null {
  if (typeof OffscreenCanvas !== 'undefined') {
    const c = new OffscreenCanvas(width, height);
    return c.getContext('2d', { willReadFrequently: true });
  }
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  return c.getContext('2d', { willReadFrequently: true });
}

function read(ctx: Ctx2D, width: number, height: number): PixelSource {
  const img = ctx.getImageData(0, 0, width, height);
  return { data: img.data, width, height };
}

export interface TextOptions {
  fontFamily: string;
  weight?: number;
  /** Fraction of the canvas width the text may occupy. */
  fill?: number;
  /** Where the lines sit. Headlines are left-aligned like the HTML they replace. */
  align?: 'left' | 'center';
  /** Negative tracking, as a fraction of the font size (display type is set tight). */
  tracking?: number;
}

/**
 * Renders text, sized to fit the grid. Lines are split on "\n" and stacked;
 * the font is sized from the row height and shrunk until the widest line
 * fits too, so the raster and the HTML headline it stands in for share the
 * same line breaks.
 */
export function textToPixels(text: string, cols: number, rows: number, opts: TextOptions): PixelSource | null {
  const width = cols * SUPERSAMPLE;
  const height = rows * SUPERSAMPLE;
  const ctx = makeContext(width, height);
  if (!ctx) return null;
  const weight = opts.weight ?? 600;
  const align = opts.align ?? 'center';
  const fill = opts.fill ?? (align === 'left' ? 1 : 0.92);
  const lines = text.split('\n');
  const lineH = height / lines.length;
  let size = lineH * 0.82;
  const setFont = () => {
    ctx.font = `${weight} ${size}px ${opts.fontFamily}`;
    if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = `${(opts.tracking ?? 0) * size}px`;
  };
  setFont();
  const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
  if (widest > width * fill) {
    size *= (width * fill) / widest;
    setFont();
  }
  ctx.fillStyle = '#fff';
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  const x = align === 'left' ? 0 : width / 2;
  lines.forEach((line, i) => ctx.fillText(line, x, lineH * (i + 0.5)));
  return read(ctx, width, height);
}

/**
 * Renders one line of text at a given row count and lets the width follow
 * the text: the strip a LED sign scrolls. Returns the pixels and how many
 * columns the strip spans.
 */
export function textStripToPixels(
  text: string,
  rows: number,
  opts: Pick<TextOptions, 'fontFamily' | 'weight' | 'tracking'>,
): (PixelSource & { cols: number }) | null {
  const height = rows * SUPERSAMPLE;
  const size = height * 0.8;
  const probe = makeContext(1, 1);
  if (!probe) return null;
  const weight = opts.weight ?? 600;
  const font = `${weight} ${size}px ${opts.fontFamily}`;
  probe.font = font;
  const measured = probe.measureText(text).width + (opts.tracking ?? 0) * size * text.length;
  const cols = Math.max(1, Math.ceil(measured / SUPERSAMPLE));
  const width = cols * SUPERSAMPLE;
  const ctx = makeContext(width, height);
  if (!ctx) return null;
  ctx.font = font;
  if ('letterSpacing' in ctx) (ctx as { letterSpacing: string }).letterSpacing = `${(opts.tracking ?? 0) * size}px`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, height / 2);
  return { ...read(ctx, width, height), cols };
}

export interface GlyphBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Strokes the wordmark glyphs into the grid. Same geometry as the SVG: the
 * paths are Path2D from the very same `d` strings, stroked at the grid's
 * stroke width with butt caps.
 */
export function glyphsToPixels(
  glyphs: Glyph[],
  box: GlyphBox,
  stroke: number,
  overhang: number,
  bowl: { cx: number; cy: number; r: number },
  cols: number,
  rows: number,
  fill = 0.94,
): PixelSource | null {
  if (typeof Path2D === 'undefined') return null;
  const width = cols * SUPERSAMPLE;
  const height = rows * SUPERSAMPLE;
  const ctx = makeContext(width, height);
  if (!ctx) return null;
  const scale = Math.min((width * fill) / box.width, (height * fill) / box.height);
  const drawnW = box.width * scale;
  const drawnH = box.height * scale;
  ctx.save();
  ctx.translate((width - drawnW) / 2, (height - drawnH) / 2);
  ctx.scale(scale, scale);
  ctx.translate(-box.x + overhang, -box.y);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = stroke;
  ctx.lineCap = 'butt';
  for (const glyph of glyphs) {
    ctx.save();
    ctx.translate(glyph.x, 0);
    if (glyph.circle) {
      ctx.beginPath();
      ctx.arc(bowl.cx, bowl.cy, bowl.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const d of glyph.d) ctx.stroke(new Path2D(d));
    ctx.restore();
  }
  ctx.restore();
  return read(ctx, width, height);
}

/** Loads an image and paints it to cover (or fit inside) the grid. */
export function imageToPixels(
  src: string,
  cols: number,
  rows: number,
  fit: 'cover' | 'contain' = 'cover',
): Promise<PixelSource | null> {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') return resolve(null);
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const width = cols * SUPERSAMPLE;
      const height = rows * SUPERSAMPLE;
      const ctx = makeContext(width, height);
      if (!ctx) return resolve(null);
      const scale =
        fit === 'cover'
          ? Math.max(width / img.naturalWidth, height / img.naturalHeight)
          : Math.min(width / img.naturalWidth, height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
      resolve(read(ctx, width, height));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
