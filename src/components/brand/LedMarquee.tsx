'use client';

// src/components/brand/LedMarquee.tsx
// A running LED sign — the names scrolling across a dot matrix, the way the
// band's own "letreiro" does it. The whole strip is drawn once to an
// offscreen canvas; each frame only blits a window of it, so scrolling costs
// nothing on a phone. Runs only while in view and not paused; the pause
// control satisfies WCAG 2.2.2. Under reduced motion it is a plain list.
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { mix, toRgba } from '@/design/color';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { dotRadius, quantize, sampleGrid } from '@/lib/led/rasterize';
import { textStripToPixels } from '@/lib/led/sources';
import { Ticker } from '@/components/ui/Ticker';

interface LedMarqueeProps {
  items: string[];
  label: string;
  pauseLabel: string;
  playLabel: string;
  /** Dot rows of the sign. */
  rows?: number;
  /** Scroll speed in dot columns per second. */
  speed?: number;
  className?: string;
}

const LEVELS = 12;
const SEPARATOR = '   ·   ';

function readVar(el: Element, name: string, fallback: string): string {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  try {
    return raw ? toRgba(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function LedMarquee({ items, label, pauseLabel, playLabel, rows = 11, speed = 26, className }: LedMarqueeProps) {
  const reduced = useReducedMotion();
  const [userPaused, setUserPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const paused = userPaused || hover;
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);
  const text = items.join(SEPARATOR) + SEPARATOR;

  useEffect(() => {
    if (reduced) return;
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let disposed = false;
    let raf = 0;
    let inView = false;
    let last = 0;
    let offset = 0;
    let strip: HTMLCanvasElement | OffscreenCanvas | null = null;
    let stripW = 0;
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;

    const led = readVar(box, '--color-led', '#4fa3ff');
    const dim = readVar(box, '--color-led-dim', '#17304f');
    const palette = Array.from({ length: LEVELS }, (_, i) => mix(dim, led, i / (LEVELS - 1)));
    const fontFamily = getComputedStyle(box).fontFamily || 'sans-serif';

    // Rasterise the text once into a dot strip the height of the sign.
    const buildStrip = () => {
      const pixels = textStripToPixels(text, rows, { fontFamily, weight: 600, tracking: 0.02 });
      if (!pixels) return;
      const grid = sampleGrid(pixels.data, pixels.width, pixels.height, pixels.cols, rows);
      const pitch = cssH / rows;
      stripW = pixels.cols * pitch;
      const w = Math.max(1, Math.ceil(stripW * dpr));
      const h = Math.max(1, Math.ceil(cssH * dpr));
      strip = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : document.createElement('canvas');
      if (strip instanceof HTMLCanvasElement) {
        strip.width = w;
        strip.height = h;
      }
      const sctx = strip.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
      if (!sctx) return;
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const maxR = pitch * 0.42;
      const paths = Array.from({ length: LEVELS }, () => new Path2D());
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < pixels.cols; c++) {
          const v = grid[r * pixels.cols + c];
          const radius = dotRadius(v, maxR);
          const x = c * pitch + pitch / 2;
          const y = r * pitch + pitch / 2;
          const p = paths[quantize(v, LEVELS)];
          p.moveTo(x + radius, y);
          p.arc(x, y, radius, 0, Math.PI * 2);
        }
      }
      paths.forEach((p, i) => {
        sctx.fillStyle = palette[i];
        sctx.fill(p);
      });
    };

    const draw = () => {
      if (!strip || !stripW) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const x = -((offset % stripW) * dpr);
      const w = stripW * dpr;
      // Two copies cover the window at any offset; the strip ends with a
      // separator, so the seam is invisible.
      ctx.drawImage(strip, x, 0);
      ctx.drawImage(strip, x + w, 0);
      if (x + 2 * w < canvas.width) ctx.drawImage(strip, x + 2 * w, 0);
    };

    const tick = (now: number) => {
      if (disposed) return;
      if (!inView || pausedRef.current) {
        raf = 0;
        return;
      }
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      offset += speed * (cssH / rows) * dt;
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || disposed) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      const rect = box.getBoundingClientRect();
      cssW = rect.width;
      cssH = rect.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));
      buildStrip();
      draw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(box);
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries.some((e) => e.isIntersecting);
        if (inView) start();
      },
      { threshold: 0.1 },
    );
    io.observe(box);

    void (async () => {
      await document.fonts?.ready;
      if (disposed) return;
      resize();
    })();

    // A paused sign resumes from where it stopped.
    const observer = new MutationObserver(() => {
      if (!pausedRef.current) start();
    });
    observer.observe(box, { attributes: true, attributeFilter: ['data-paused'] });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      observer.disconnect();
    };
  }, [reduced, text, rows, speed]);

  if (reduced) return <Ticker items={items} label={label} className={className} />;

  return (
    <div className={cn('flex flex-col gap-3', className)} role="region" aria-label={label}>
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div
        ref={boxRef}
        data-paused={paused ? '' : undefined}
        className="relative h-[clamp(3.25rem,6vi,5.5rem)] w-full overflow-hidden border-y border-line py-0"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          aria-pressed={userPaused}
          onClick={() => setUserPaused((p) => !p)}
          className="label-caps transition-quick inline-flex items-center gap-2.5 py-1 text-ink-muted hover:text-ink"
        >
          <i aria-hidden className={cn('size-1.5 rounded-pill', paused ? 'bg-ink-low' : 'bg-led')} />
          {paused ? playLabel : pauseLabel}
        </button>
      </div>
    </div>
  );
}
