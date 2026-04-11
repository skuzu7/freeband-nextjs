"use client";

import { useEffect, useRef } from "react";

/**
 * Radial-gradient spotlight that follows the pointer inside its parent.
 * - Disabled on touch (`pointer: coarse`)
 * - Disabled under `prefers-reduced-motion: reduce`
 * - Throttles via `requestAnimationFrame`
 * - Single listener, single CSS var write per frame
 * Mount only inside sections that benefit from it (e.g. Hero).
 */
export function SpotlightCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let rafId = 0;
    let pendingX = 50;
    let pendingY = 35;
    const flush = () => {
      el.style.setProperty("--spot-x", `${pendingX}%`);
      el.style.setProperty("--spot-y", `${pendingY}%`);
      rafId = 0;
    };
    const onMove = (event: PointerEvent) => {
      pendingX = (event.clientX / window.innerWidth) * 100;
      pendingY = (event.clientY / window.innerHeight) * 100;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ref} className="stage-spot" aria-hidden />;
}
