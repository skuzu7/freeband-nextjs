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
//
// The panel fails open: whatever stops it from lighting — no 2D context, no
// IntersectionObserver, a colour token the mixer rejects, an exception — ends
// in `onLit`, so the content the caller hides behind the dots is never lost.
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { buildPalette, readLedColors } from '@/lib/led/palette';
import {
  dotRadius,
  fitGrid,
  layoutDots,
  levels,
  lightUpOrder,
  parseDurationMs,
  quantize,
  sampleGrid,
  type LightUpMode,
} from '@/lib/led/rasterize';
import { glyphsToPixels, imageToPixels, textToPixels } from '@/lib/led/sources';
import { GLYPHS, WORDMARK } from './Wordmark';
import { DotGrid } from './DotGrid';

export type LedSource =
  | { kind: 'text'; text: string; weight?: number; align?: 'left' | 'center'; tracking?: number }
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
  /**
   * Draw the unlit cells as dim dots (the panel switched off). Off when the
   * panel sits over a photograph: only the lit dots should appear.
   */
  dimDots?: boolean;
  /** Paint the CSS dot field under the canvas. Off over a photograph. */
  field?: boolean;
  /**
   * Fade the dots out once lit, so what the caller renders on top (the sharp
   * vector) takes over — the LED wall becoming the acrylic sign.
   */
  fadeWhenLit?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const LEVELS = 16;
const MAX_DOTS = 6000;
/** Slack after the light-up's own duration before the watchdog reveals the content. */
const WATCHDOG_SLACK_MS = 1500;

/** Ease-out cubic for each dot's own switch-on. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function LedPanel({
  source,
  aspect,
  cols = 96,
  mode,
  still = false,
  onLit,
  dimDots = true,
  field = true,
  fadeWhenLit = false,
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

    // The way out when the panel cannot run: behave as if it had lit, so the
    // caller shows its content at once.
    const reveal = () => {
      if (litRef.current) return;
      litRef.current = true;
      if (fadeWhenLit) canvas.style.opacity = '0';
      onLitRef.current?.();
    };

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reveal();
      return;
    }

    let raf = 0;
    let watchdog = 0;
    let disposed = false;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;

    try {
      const src: LedSource = JSON.parse(sourceKey);
      const grid = fitGrid(aspect, cols, MAX_DOTS);
      const order = lightUpOrder(grid.cols, grid.rows, mode ?? (src.kind === 'image' ? 'radial' : 'sweep'));
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const durationMs = parseDurationMs(getComputedStyle(box).getPropertyValue('--dur-light'));
      const { led: ledColor, dim: dimColor } = readLedColors(box);
      const palette = buildPalette(dimColor, ledColor, LEVELS);

      // Until the source arrives the panel is switched off: every cell 0. The
      // light-up may run on that (a dark panel coming on), so nothing the
      // caller stacks on top ever waits on the network.
      let intensity: Uint8Array | null = null;
      const unlit = new Uint8Array(grid.cols * grid.rows);
      let startedAt = 0;
      let cssW = 0;
      let cssH = 0;

      const fontFamily = getComputedStyle(box).fontFamily || 'sans-serif';

      const draw = (t: number) => {
        if (cssW === 0 || cssH === 0) return;
        const cells = intensity ?? unlit;
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
            const v = cells[i] * p;
            // Over a photograph the switched-off cells are not drawn at all.
            if (!dimDots && v <= 0) continue;
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
        window.clearTimeout(watchdog);
        cancelAnimationFrame(raf);
        raf = 0;
        draw(1);
        // Hand over to whatever sits on top: the dots fade on the same curve
        // the caller uses to fade its vector in.
        reveal();
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
        if (disposed || litRef.current) return;
        if (reduced || still) {
          finish();
          return;
        }
        cancelAnimationFrame(raf);
        startedAt = 0;
        raf = requestAnimationFrame(tick);
        // If frames never come (a throttled tab, a lost context), the content
        // is revealed anyway once the light-up should long have ended.
        watchdog = window.setTimeout(finish, durationMs * 2 + WATCHDOG_SLACK_MS);
      };

      const resize = () => {
        const rect = box.getBoundingClientRect();
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        const w = Math.max(1, Math.round(rect.width * dpr));
        const h = Math.max(1, Math.round(rect.height * dpr));
        if (w === canvas.width && h === canvas.height && cssW === rect.width && cssH === rect.height) return;
        cssW = rect.width;
        cssH = rect.height;
        // Sizing the bitmap clears it: redraw the frame the panel is showing.
        // Mid-animation the next tick repaints, so nothing to do here.
        canvas.width = w;
        canvas.height = h;
        if (!raf) draw(litRef.current ? 1 : 0);
      };
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(resize);
        ro.observe(box);
      }
      resize();

      // Start when the panel is actually in view; a panel below the fold should
      // not spend frames lighting up unseen. Without the observer, at once.
      if (typeof IntersectionObserver === 'undefined') {
        start();
      } else {
        io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              io?.disconnect();
              start();
            }
          },
          // Anything near the viewport comes on — a frame peeking in from the
          // side of a strip included.
          { threshold: 0.05, rootMargin: '15% 25%' },
        );
        io.observe(box);
      }

      const load = async () => {
        let pixels = null;
        if (src.kind === 'text') {
          // The raster must use the site face, not a fallback that happens to
          // be ready first.
          await document.fonts?.ready;
          if (disposed) return;
          pixels = textToPixels(src.text, grid.cols, grid.rows, {
            fontFamily,
            weight: src.weight,
            align: src.align,
            tracking: src.tracking,
          });
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
        if (!raf) draw(0);
      };
      load().catch(() => {
        // The source never arrived: the panel lights up dark, and the content
        // takes over on schedule.
        intensity = null;
      });
    } catch {
      // Nothing the panel does is worth a broken page.
      reveal();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(watchdog);
      ro?.disconnect();
      io?.disconnect();
    };
  }, [sourceKey, aspect, cols, mode, still, dimDots, fadeWhenLit]);

  return (
    <div
      ref={boxRef}
      className={cn('relative isolate overflow-hidden', className)}
      style={{ aspectRatio: String(aspect) }}
    >
      {field && <DotGrid />}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 h-full w-full transition-opacity duration-700 ease-light"
      />
      {children}
    </div>
  );
}
