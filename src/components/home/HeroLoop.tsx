'use client';

// src/components/home/HeroLoop.tsx
// The fold's backdrop, the only part of the fold that needs the browser.
// Three layers, each the fallback of the one above it:
//
//   poster   the stage photograph, sent by the server (it is the LCP)
//   loop     the silent stage loop, attached on idle, never under reduced motion
//   wall     a WebGL canvas that redraws the two as a wall of LED dots:
//            it resolves into the picture on arrival, breaks back into dots
//            under the pointer and as the fold scrolls away, and its dots
//            swell with the music when a clip is playing
//
// No WebGL2, a lost context, reduced motion or Save-Data all end the same
// way: the canvas stays transparent and the poster or the loop shows through.
// One control pauses the loop (WCAG 2.2.2).
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { toHex } from '@/design/color';
import { tokens } from '@/design/tokens';
import {
  createLedWall,
  hexToRgb,
  stageStateForScroll,
  type StageViewMode,
  type WallPalette,
} from '@/lib/led/wall';
import { getLevel } from '@/lib/media/level';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PlayToggle } from '@/components/ui/PlayToggle';

const PALETTE: WallPalette = {
  dim: hexToRgb(toHex(tokens.palette['led-900'])),
  led: hexToRgb(toHex(tokens.palette['led-500'])),
  hot: hexToRgb(toHex(tokens.palette['led-200'])),
  ground: hexToRgb(toHex(tokens.palette['night-950'])),
  red: hexToRgb(toHex(tokens.palette['red-500'])),
};

/** How long the wall takes to resolve into the picture on arrival. */
const INTRO_MS = 1800;
/** Backing-store scale cap: the shader is cheap, a 3× phone screen is not. */
const MAX_DPR = 1.5;

const DEFAULT_STAGE_MODES: ReadonlyArray<{ id: StageViewMode; label: string }> = [
  { id: 'auto', label: 'Auto 3D' },
  { id: 'matrix', label: 'Matriz LED' },
  { id: 'stage', label: 'Vídeo Puro' },
];

/**
 * Runs `task` once the page is idle; returns the way to call it off. Safari
 * still has no requestIdleCallback, so a short timer stands in.
 */
function whenIdle(task: () => void, timeout: number, fallbackMs: number): () => void {
  const idle = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (idle.requestIdleCallback && idle.cancelIdleCallback) {
    const id = idle.requestIdleCallback(task, { timeout });
    return () => idle.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(task, fallbackMs);
  return () => window.clearTimeout(id);
}

function savesData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

interface HeroLoopProps {
  /** The stage loop. */
  video: string;
  pauseLabel: string;
  playLabel: string;
  stageModeLabel?: string;
  stageModes?: ReadonlyArray<{ id: StageViewMode; label: string }>;
  /** The poster: a next/image marked `data-backdrop`, rendered by the server. */
  children: ReactNode;
}

export function HeroLoop({
  video,
  pauseLabel,
  playLabel,
  stageModeLabel = 'Modo de projeção do painel LED',
  stageModes = DEFAULT_STAGE_MODES,
  children,
}: HeroLoopProps) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [viewMode, setViewMode] = useState<StageViewMode>('auto');
  const viewModeRef = useRef<StageViewMode>('auto');
  const wakeRef = useRef<(() => void) | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Sync interactive stage projection mode into the WebGL loop without re-creating the context.
  useEffect(() => {
    viewModeRef.current = viewMode;
    wakeRef.current?.();
  }, [viewMode]);

  // The loop attaches once the page is idle: the poster is the LCP and the
  // video must not compete with it.
  useEffect(() => {
    if (reduced) return;
    const el = videoRef.current;
    if (!el) return;
    const attach = () => {
      if (el.getAttribute('src')) return;
      el.setAttribute('src', video);
      el.play().catch(() => {});
    };
    return whenIdle(attach, 4000, 1500);
  }, [reduced, video]);

  // The pause control: the loop stays attached and resumes where it stopped.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !el.getAttribute('src')) return;
    if (paused) el.pause();
    else el.play().catch(() => {});
  }, [paused]);

  // The wall. It starts once the page is idle, as the loop does: creating a
  // WebGL context and compiling its shader is real work on a slow phone (up to
  // ~290 ms measured with the CPU slowed four times), and none of it should
  // land on hydration or on a first tap.
  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (reduced || !box || !canvas || savesData()) return;

    const start = (): (() => void) | undefined => {
      const wall = createLedWall(canvas, PALETTE);
      if (!wall) return undefined;

      const { tier } = wall;
      canvas.dataset.stageTier = tier;

      const poster = box.querySelector<HTMLImageElement>('img[data-backdrop]');
      const fold = box.parentElement ?? box;
      let cancelNextFrame: (() => void) | null = null;
      let inView = true;
      let dead = false;
      let hasPoster = false;
      let startedAt = 0;
      let height = 1;
      let pointerX = 0;
      let pointerY = 0;
      let smoothX = 0;
      let smoothY = 0;
      let pointerOn = 0;
      let pointerGoal = 0;

      const measure = () => {
        const { width, height: h } = box.getBoundingClientRect();
        height = Math.max(1, h);
        const dprCap = tier === 'A' ? MAX_DPR : 1;
        wall.resize(width, h, Math.min(window.devicePixelRatio || 1, dprCap));
        if (!smoothX && !smoothY) {
          pointerX = width * 0.5;
          pointerY = h * 0.5;
          smoothX = pointerX;
          smoothY = pointerY;
        }
      };

      // A frame of the loop when it is running, the poster until then.
      const feed = (): boolean => {
        const loop = videoRef.current;
        try {
          if (loop && loop.readyState >= 2 && loop.videoWidth && !(loop.paused && hasPoster && startedAt)) {
            wall.upload(loop, loop.videoWidth, loop.videoHeight);
            return true;
          }
          if (!hasPoster && poster?.complete && poster.naturalWidth) {
            wall.upload(poster, poster.naturalWidth, poster.naturalHeight);
            hasPoster = true;
          }
        } catch {
          // A source the GPU will not take (a tainted image, say): give the
          // fold back to the layers underneath.
          dead = true;
          delete canvas.dataset.live;
          return false;
        }
        return hasPoster;
      };

      const draw = (now: number) => {
        cancelNextFrame = null;
        if (dead) return;
        if (feed()) {
          if (!startedAt) startedAt = now;
          const elapsedSec = (now - startedAt) / 1000;
          const t = Math.min(1, (now - startedAt) / INTRO_MS);
          // Ease-out: the picture arrives fast and settles, like a LED coming on.
          const intro = 1 - (1 - t) ** 3;
          pointerOn += (pointerGoal - pointerOn) * 0.12;
          smoothX += (pointerX - smoothX) * 0.14;
          smoothY += (pointerY - smoothY) * 0.14;

          const stage = stageStateForScroll(window.scrollY / height, viewModeRef.current);
          const effectiveResolve =
            viewModeRef.current === 'stage' ? stage.resolve : intro * stage.resolve;

          wall.draw({
            resolve: effectiveResolve,
            pointerX: smoothX,
            pointerY: smoothY,
            pointerOn,
            level: getLevel(),
            time: elapsedSec,
            curvature: stage.curvature,
            beamPower: stage.beamPower,
          });
          canvas.dataset.live = '';
          canvas.dataset.stageState = stage.id;
        }
        if (inView && !document.hidden) {
          cancelNextFrame = wall.scheduleNextFrame(draw);
        }
      };

      const wake = () => {
        if (!cancelNextFrame && !dead && inView && !document.hidden) {
          cancelNextFrame = wall.scheduleNextFrame(draw);
        }
      };
      wakeRef.current = wake;

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return;
        const rect = canvas.getBoundingClientRect();
        pointerX = event.clientX - rect.left;
        pointerY = event.clientY - rect.top;
        pointerGoal = 1;
        wake();
      };
      const onLeave = () => {
        pointerGoal = 0;
      };
      const onLost = (event: Event) => {
        event.preventDefault();
        dead = true;
        cancelNextFrame?.();
        cancelNextFrame = null;
        delete canvas.dataset.live;
      };
      const onRestored = () => {
        dead = false;
        hasPoster = false;
        wake();
      };

      const sizes = new ResizeObserver(measure);
      sizes.observe(box);
      const views = new IntersectionObserver((entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
        wake();
      });
      views.observe(box);
      measure();
      fold.addEventListener('pointermove', onMove, { passive: true });
      fold.addEventListener('pointerleave', onLeave);
      canvas.addEventListener('webglcontextlost', onLost);
      canvas.addEventListener('webglcontextrestored', onRestored);
      document.addEventListener('visibilitychange', wake);
      poster?.addEventListener('load', wake);
      wake();

      return () => {
        dead = true;
        wakeRef.current = null;
        cancelNextFrame?.();
        sizes.disconnect();
        views.disconnect();
        fold.removeEventListener('pointermove', onMove);
        fold.removeEventListener('pointerleave', onLeave);
        canvas.removeEventListener('webglcontextlost', onLost);
        canvas.removeEventListener('webglcontextrestored', onRestored);
        document.removeEventListener('visibilitychange', wake);
        poster?.removeEventListener('load', wake);
        delete canvas.dataset.live;
        wall.dispose();
      };
    };

    let stop: (() => void) | undefined;
    const callOff = whenIdle(
      () => {
        stop = start();
      },
      2000,
      300,
    );
    return () => {
      callOff();
      stop?.();
    };
  }, [reduced]);

  return (
    <>
      <div ref={boxRef} className="fold-backdrop absolute inset-0 -z-10 will-change-transform">
        {children}
        {!reduced && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            onPlaying={(event) => {
              event.currentTarget.dataset.playing = '';
            }}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[1200ms] ease-light data-playing:opacity-100"
          />
        )}
        {!reduced && (
          <canvas
            ref={canvasRef}
            aria-hidden
            data-stage-mode={viewMode}
            className="led-wall"
          />
        )}
        <div aria-hidden className="hero-scrim absolute inset-0" />
      </div>
      {!reduced && (
        <div className="absolute inset-x-[var(--pad-inline)] top-4 z-10 flex flex-wrap items-center justify-between gap-2 sm:top-6">
          <div className="hidden items-center gap-2 border border-led/35 bg-surface/80 px-3 py-2 backdrop-blur-md lg:inline-flex">
            <span aria-hidden className="size-2 rounded-pill bg-led shadow-[0_0_8px_var(--color-led)]" />
            <span className="label-caps text-2xs text-led-text">Palco 3D Volumétrico · Interativo</span>
          </div>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
            <div
              role="group"
              aria-label={stageModeLabel}
              className="hidden items-center gap-1 border border-led/40 bg-surface/85 px-1.5 shadow-[0_0_24px_color-mix(in_oklab,var(--color-led),transparent_84%)] backdrop-blur-md sm:inline-flex"
            >
              {stageModes.map((mode) => {
                const active = viewMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setViewMode(mode.id)}
                    className={cn(
                      'label-caps transition-quick tap inline-flex items-center gap-1.5 px-2.5 text-2xs',
                      active
                        ? 'bg-led/15 text-led-text'
                        : 'text-ink-muted hover:text-ink',
                    )}
                  >
                    <i
                      aria-hidden
                      className={cn('size-1.5 rounded-pill', active ? 'bg-led shadow-[0_0_6px_var(--color-led)]' : 'bg-ink-low/50')}
                    />
                    {mode.label}
                  </button>
                );
              })}
            </div>
            <PlayToggle
              paused={paused}
              onToggle={() => setPaused((p) => !p)}
              pauseLabel={pauseLabel}
              playLabel={playLabel}
              className="border border-line bg-surface/85 px-3 text-ink backdrop-blur-md"
            />
          </div>
        </div>
      )}
    </>
  );
}
