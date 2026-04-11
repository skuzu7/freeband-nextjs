// src/components/ui/SnapProgress.tsx
// Progress indicator for a horizontal scroll-snap container (Ato IV services).
// Takes a ref to the snap container and renders count pills with the active
// one highlighted. Keyboard: Left/Right arrow steps the snap.
"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

interface SnapProgressProps {
  targetRef: RefObject<HTMLElement | null>;
  count: number;
  labels?: string[];
  className?: string;
}

export function SnapProgress({
  targetRef,
  count,
  labels,
  className = "",
}: SnapProgressProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const update = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (children.length === 0) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActiveIndex(best);
  }, [targetRef]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    update();
    let raf: number | null = null;
    const onScroll = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [targetRef, update]);

  const step = useCallback(
    (delta: number) => {
      const el = targetRef.current;
      if (!el) return;
      const children = Array.from(el.children) as HTMLElement[];
      const next = Math.max(0, Math.min(children.length - 1, activeIndex + delta));
      children[next]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [targetRef, activeIndex],
  );

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [targetRef, step]);

  return (
    <div
      className={`flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted ${className}`.trim()}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            onClick={() => step(i - activeIndex)}
            className={`flex items-center gap-2 transition-colors ${
              isActive ? "text-brand" : "hover:text-text"
            }`}
          >
            <span
              className={`inline-block h-px transition-all ${
                isActive ? "w-10 bg-brand" : "w-4 bg-border"
              }`}
            />
            <span>{String(i + 1).padStart(2, "0")}</span>
            {labels?.[i] ? (
              <span
                className={`normal-case tracking-normal ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              >
                {labels[i]}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
