// src/components/ui/MagneticField.tsx
// Wraps children (typically the Hero wordmark) in a cursor-reactive field.
// Single rAF-throttled pointermove listener translates the child up to
// `strength` pixels toward the cursor with a spring-eased return.
//
// Feature detection:
//   - `(hover: hover) and (pointer: fine)` AND not prefers-reduced-motion
//   - One-shot touchstart listener force-disables magnetism (handles iPad
//     with Magic Keyboard which reports pointer:fine)
"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface MagneticFieldProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function MagneticField({
  children,
  strength = 24,
  className = "",
}: MagneticFieldProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    setActive(mq.matches);
    const update = () => setActive(mq.matches);
    mq.addEventListener("change", update);
    const killOnTouch = () => setActive(false);
    window.addEventListener("touchstart", killOnTouch, {
      once: true,
      passive: true,
    });
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("touchstart", killOnTouch);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const node = wrapRef.current;
    if (!node) return;

    const handleMove = (e: PointerEvent) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        // Clamp the influence to [-1, 1] so distant cursors don't over-drag
        const clamp = (n: number) => Math.max(-1, Math.min(1, n));
        node.style.setProperty("--mag-x", `${clamp(dx) * strength}px`);
        node.style.setProperty("--mag-y", `${clamp(dy) * strength}px`);
      });
    };

    const handleLeave = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      node.style.setProperty("--mag-x", "0px");
      node.style.setProperty("--mag-y", "0px");
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, strength]);

  return (
    <div
      ref={wrapRef}
      className={`mag-field ${className}`.trim()}
      style={
        active
          ? {
              transform: "translate3d(var(--mag-x, 0), var(--mag-y, 0), 0)",
              transition: "transform 600ms var(--ease-spring)",
              willChange: "transform",
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
