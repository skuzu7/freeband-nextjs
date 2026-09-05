'use client';

// src/components/brand/LedPanel.tsx
// A panel of LED dots that "comes on" with whatever it is showing: a line of
// text, the wordmark, a photograph. The canvas is decoration (aria-hidden);
// the real content is whatever the caller renders alongside.
//
// Budget: at most ~6 000 dots, one requestAnimationFrame loop that runs only
// while the panel is in view and only until the light-up finishes, then a
// single static frame. Under prefers-reduced-motion the final frame is drawn
// once and nothing moves. Before hydration (or without canvas) the box shows
// the CSS dot field.
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { mix, toRgba } from '@/design/color';
import {
  dotRadius,
  fitGrid,
  layoutDots,
  levels,
  lightUpOrder,
  quantize,
  sampleGrid,
  type LightUpMode,
} from '@/lib/led/rasterize';
import { glyphsToPixels, imageToPixels, textToPixels } from '@/lib/led/sources';
import { GLYPHS, WORDMARK } from './Wordmark';
import { DotGrid } from './DotGrid';

export type LedSource =
  | { kind: 'text'; text: string; weight?: number }
  | { kind: 'wordmark' }
  | { kind: 'image'; src: string; fit?: 'cover' | 'contain' };

interface LedPanelProps {
  source: LedSource;
  /** Box aspect ratio, width / height. */
  aspect: number;
  /** Columns of dots; rows follow the aspect. Capped at ~6 000 dots total. */
  cols?: number;
  mode?: LightUpMode;
  /** Skip the animation and draw the lit panel at once. */
  still?: boolean;
  /** Fired once, after the panel has finished lighting up. */
  onLit?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const LEVELS = 16;
const MAX_DOTS = 6000;
const FALLBACK_LED = '#4fa3ff';
const FALLBACK_DIM = '#17304f';

/** Ease-out cubic for each dot's own switch-on. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

function readVar(el: Element, name: string, fallback: string): string {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  if (!raw) return fallback;
  try {
    return toRgba(raw);
  } catch {
    return fallback;
  }
}

export function LedPanel({
  source,
  aspect,
  cols = 96,
  mode,
  still = false,
  onLit,
  className,
  children,
}: LedPanelProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const litRef = useRef(false);
  const onLitRef = useRef(onLit);
  useEffect(() => {
    onLitRef.current = onLit;
  }, [onLit]);

  // Structural props are read once per mount; a serialised key restarts the
  // effect if they change.
  const sourceKey = JSON.stringify(source);

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const src: LedSource = JSON.parse(sourceKey);
    const grid = fitGrid(aspect, cols, MAX_DOTS);
    const order = lightUpOrder(grid.cols, grid.rows, mode ?? (src.kind === 'image' ? 'radial' : 'sweep'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const durationMs = parseFloat(getComputedStyle(box).getPropertyValue('--dur-light')) || 900;
    const ledColor = readVar(box, '--color-led', FALLBACK_LED);
    const dimColor = readVar(box, '--color-led-dim', FALLBACK_DIM);
    const palette = Array.from({ length: LEVELS }, (_, i) => mix(dimColor, ledColor, i / (LEVELS - 1)));

    let intensity: Uint8Array | null = null;
    let raf = 0;
    let startedAt = 0;
    let disposed = false;
    let cssW = 0;
    let cssH = 0;

    const fontFamily = getComputedStyle(box).fontFamily || 'sans-serif';

    const draw = (t: number) => {
      if (!intensity || cssW === 0 || cssH === 0) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const layout = layoutDots(grid.cols, grid.rows, cssW, cssH);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      const paths = Array.from({ length: LEVELS }, () => new Path2D());
      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          const i = r * grid.cols + c;
          // Each dot switches on over the last 30% of the timeline after its
          // own delay, so the sweep reads as a wave, not a hard edge.
          const p = t >= 1 ? 1 : easeOut(Math.min(1, Math.max(0, (t - order[i] * 0.7) / 0.3)));
          const v = intensity[i] * p;
          const level = quantize(v, LEVELS);
          const radius = dotRadius(v, layout.maxRadius);
          const x = layout.offsetX + c * layout.pitch;
          const y = layout.offsetY + r * layout.pitch;
          paths[level].moveTo(x + radius, y);
          paths[level].arc(x, y, radius, 0, Math.PI * 2);
        }
      }
      for (let l = 0; l < LEVELS; l++) {
        ctx.fillStyle = palette[l];
        ctx.fill(paths[l]);
      }
    };

    const finish = () => {
      draw(1);
      if (!litRef.current) {
        litRef.current = true;
        onLitRef.current?.();
      }
    };

    const tick = (now: number) => {
      if (disposed) return;
      if (!startedAt) startedAt = now;
      const t = (now - startedAt) / durationMs;
      if (t >= 1) {
        finish();
        return;
      }
      draw(t);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (disposed || !intensity) return;
      if (reduced || still) {
        finish();
        return;
      }
      cancelAnimationFrame(raf);
      startedAt = 0;
      raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      const rect = box.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      if (litRef.current) draw(1);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);
    resize();

    // Start when the panel is actually in view; a panel below the fold should
    // not spend frames lighting up unseen.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          start();
        }
      },
      { threshold: 0.25 },
    );

    const load = async () => {
      let pixels = null;
      if (src.kind === 'text') {
        pixels = textToPixels(src.text, grid.cols, grid.rows, { fontFamily, weight: src.weight });
      } else if (src.kind === 'wordmark') {
        pixels = glyphsToPixels(
          GLYPHS,
          WORDMARK.viewBox,
          WORDMARK.stroke,
          WORDMARK.overhang,
          WORDMARK.bowl,
          grid.cols,
          grid.rows,
        );
      } else {
        pixels = await imageToPixels(src.src, grid.cols, grid.rows, src.fit);
      }
      if (disposed) return;
      const sampled = pixels
        ? sampleGrid(pixels.data, pixels.width, pixels.height, grid.cols, grid.rows)
        : new Uint8Array(grid.cols * grid.rows);
      // Text and glyphs are already binary; photographs need their range
      // stretched and mid-tones lifted or the panel reads as mud.
      intensity = src.kind === 'image' ? levels(sampled, 0.65) : sampled;
      if (litRef.current) {
        draw(1);
        return;
      }
      // Unlit panel first, so the box is never blank while waiting for view.
      draw(0);
      io.observe(box);
    };
    void load();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [sourceKey, aspect, cols, mode, still]);

  return (
    <div
      ref={boxRef}
      className={cn('relative isolate overflow-hidden', className)}
      style={{ aspectRatio: String(aspect) }}
    >
      <DotGrid />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
      {children}
    </div>
  );
}
