'use client';

import { useEffect, useRef } from 'react';

/**
 * Global cursor-following neon glow. Subtle radial gradient that tracks
 * the pointer across the entire viewport. Disabled on touch devices
 * and under reduced-motion preferences.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    let rafId = 0;
    let px = 50;
    let py = 50;

    const flush = () => {
      el.style.background = `radial-gradient(600px circle at ${px}% ${py}%, oklch(62% 0.26 25 / 0.04), transparent 40%)`;
      rafId = 0;
    };

    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 100;
      py = (e.clientY / window.innerHeight) * 100;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[9998] mix-blend-screen"
      aria-hidden
    />
  );
}
