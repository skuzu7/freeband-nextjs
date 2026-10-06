'use client';

// src/components/brand/LedStageDriver.tsx
// The light on the wall. Three layers under the stage's dot mask, each driven
// through `transform` or `opacity` alone, so a frame costs the compositor a
// layer move and the page nothing: no layout, no paint, no canvas.
//
//   pointer   a pool of lit dots under a mouse (never under a finger)
//   level     a wash from the foot of the screen, as loud as what is playing
//   sweep     a band that crosses the wall once when the route changes
//
// Nothing here runs under prefers-reduced-motion or Save-Data; the layers
// stay in the markup, unlit.
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { onLevel } from '@/lib/media/level';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** How much of the level wash a full-scale signal lights. */
const LEVEL_GAIN = 0.7;

function savesData(): boolean {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return connection?.saveData === true;
}

export function LedStageDriver() {
  const pointerRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    const pool = pointerRef.current;
    if (!pool || reduced || savesData()) return;
    if (typeof matchMedia !== 'function' || !matchMedia('(pointer: fine)').matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    const place = () => {
      frame = 0;
      pool.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      pool.dataset.on = '';
      if (!frame) frame = requestAnimationFrame(place);
    };
    const onLeave = () => {
      delete pool.dataset.on;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      delete pool.dataset.on;
    };
  }, [reduced]);

  useEffect(() => {
    const wash = levelRef.current;
    if (!wash || reduced) return;
    const stop = onLevel((level) => {
      wash.style.opacity = String(level * LEVEL_GAIN);
    });
    return () => {
      stop();
      wash.style.opacity = '';
    };
  }, [reduced]);

  // Only a change of route sweeps the wall: not the page arriving, not an
  // effect running twice, not the motion preference settling after hydration.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    const band = sweepRef.current;
    if (!band || reduced) return;
    // Restart the keyframes: drop the flag, force a style flush, set it again.
    delete band.dataset.run;
    void band.offsetWidth;
    band.dataset.run = '';
  }, [pathname, reduced]);

  return (
    <>
      <div ref={pointerRef} className="led-stage-pointer" />
      <div ref={levelRef} className="led-stage-level" />
      <div ref={sweepRef} className="led-stage-sweep" />
    </>
  );
}
