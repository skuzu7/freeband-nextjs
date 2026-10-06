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
import { toHex } from '@/design/color';
import { tokens } from '@/design/tokens';
import { createLedWall, hexToRgb, resolveForScroll, type WallPalette } from '@/lib/led/wall';
import { getLevel } from '@/lib/media/level';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PlayToggle } from '@/components/ui/PlayToggle';

const PALETTE: WallPalette = {
  dim: hexToRgb(toHex(tokens.palette['led-900'])),
  led: hexToRgb(toHex(tokens.palette['led-500'])),
  hot: hexToRgb(toHex(tokens.palette['led-200'])),
  ground: hexToRgb(toHex(tokens.palette['night-950'])),
};

/** How long the wall takes to resolve into the picture on arrival. */
const INTRO_MS = 1800;
/** Backing-store scale cap: the shader is cheap, a 3× phone screen is not. */
const MAX_DPR = 1.5;

function savesData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

interface HeroLoopProps {
  /** The stage loop. */
  video: string;
  pauseLabel: string;
  playLabel: string;
  /** The poster: a next/image marked `data-backdrop`, rendered by the server. */
  children: ReactNode;
}

export function HeroLoop({ video, pauseLabel, playLabel, children }: HeroLoopProps) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    // Safari still has no requestIdleCallback; a short timer stands in.
    const idle = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (idle.requestIdleCallback && idle.cancelIdleCallback) {
      const id = idle.requestIdleCallback(attach, { timeout: 4000 });
      return () => idle.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(attach, 1500);
    return () => window.clearTimeout(id);
  }, [reduced, video]);

  // The pause control: the loop stays attached and resumes where it stopped.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !el.getAttribute('src')) return;
    if (paused) el.pause();
    else el.play().catch(() => {});
  }, [paused]);

  // The wall.
  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (reduced || !box || !canvas || savesData()) return;
    const wall = createLedWall(canvas, PALETTE);
    if (!wall) return;

    const poster = box.querySelector<HTMLImageElement>('img[data-backdrop]');
    const fold = box.parentElement ?? box;
    let frameId = 0;
    let inView = true;
    let dead = false;
    let hasPoster = false;
    let startedAt = 0;
    let height = 1;
    let pointerX = 0;
    let pointerY = 0;
    let pointerOn = 0;
    let pointerGoal = 0;

    const measure = () => {
      const { width, height: h } = box.getBoundingClientRect();
      height = Math.max(1, h);
      wall.resize(width, h, Math.min(window.devicePixelRatio || 1, MAX_DPR));
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
      frameId = 0;
      if (dead) return;
      if (feed()) {
        if (!startedAt) startedAt = now;
        const t = Math.min(1, (now - startedAt) / INTRO_MS);
        // Ease-out: the picture arrives fast and settles, like a LED coming on.
        const intro = 1 - (1 - t) ** 3;
        pointerOn += (pointerGoal - pointerOn) * 0.12;
        wall.draw({
          resolve: intro * resolveForScroll(window.scrollY / height),
          pointerX,
          pointerY,
          pointerOn,
          level: getLevel(),
        });
        canvas.dataset.live = '';
      }
      if (inView && !document.hidden) frameId = requestAnimationFrame(draw);
    };
    const wake = () => {
      if (!frameId && !dead && inView && !document.hidden) frameId = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
      pointerGoal = 1;
    };
    const onLeave = () => {
      pointerGoal = 0;
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      dead = true;
      delete canvas.dataset.live;
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
    document.addEventListener('visibilitychange', wake);
    poster?.addEventListener('load', wake);
    wake();

    return () => {
      dead = true;
      cancelAnimationFrame(frameId);
      sizes.disconnect();
      views.disconnect();
      fold.removeEventListener('pointermove', onMove);
      fold.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('webglcontextlost', onLost);
      document.removeEventListener('visibilitychange', wake);
      poster?.removeEventListener('load', wake);
      delete canvas.dataset.live;
      wall.dispose();
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
        {!reduced && <canvas ref={canvasRef} aria-hidden className="led-wall" />}
        <div aria-hidden className="hero-scrim absolute inset-0" />
      </div>
      {!reduced && (
        <PlayToggle
          paused={paused}
          onToggle={() => setPaused((p) => !p)}
          pauseLabel={pauseLabel}
          playLabel={playLabel}
          className="absolute top-20 right-[var(--pad-inline)] z-10"
        />
      )}
    </>
  );
}
