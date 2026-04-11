// src/components/ui/Marquee.tsx
// Parameterised infinite horizontal marquee.
// Replaces the copy-pasted marquee logic in Artistas + Parceiros.
//
// Props:
//   speed       seconds for a full loop (smaller = faster)
//   direction   "l" | "r"
//   variant     "solid" | "italic" | "outline" | "mono"
//   pauseOnHover
//   kbdControl  enable Left/Right arrow nudge (5% each press)
//   ariaLabel   required — exposed as aria-label on the region
//
// Accessibility:
//   - Focusable region (tabIndex=0) with role="region",
//     aria-roledescription="desfile"
//   - Pauses on hover and focus-within (via .marquee-region:hover rule)
//   - Reduced-motion freezes the track (via global CSS)
//   - Arrow keys translate the track by ±5% (reversible)
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type MarqueeItem = string | ReactNode;

type Variant = "solid" | "italic" | "outline" | "mono";

interface MarqueeProps {
  items: MarqueeItem[];
  speed?: number;
  direction?: "l" | "r";
  variant?: Variant;
  kbdControl?: boolean;
  ariaLabel: string;
  className?: string;
}

const variantItemClass: Record<Variant, string> = {
  solid:
    "font-display font-semibold text-text -tracking-[0.02em] leading-[0.9]",
  italic:
    "font-display italic font-medium text-text -tracking-[0.01em] leading-[0.9]",
  outline:
    "font-mono uppercase tracking-[0.2em] text-transparent [-webkit-text-stroke:1px_var(--color-border-strong)]",
  mono: "font-mono uppercase tracking-[0.28em] text-text-muted",
};

const variantItemSize: Record<Variant, string> = {
  solid: "text-[clamp(2.5rem,4vw,4rem)]",
  italic: "text-[clamp(2.25rem,3.8vw,3.75rem)]",
  outline: "text-[clamp(1.75rem,3vw,3rem)]",
  mono: "text-[clamp(0.85rem,1.2vw,1.1rem)]",
};

export function Marquee({
  items,
  speed = 60,
  direction = "l",
  variant = "solid",
  kbdControl = false,
  ariaLabel,
  className = "",
}: MarqueeProps) {
  const regionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // Duplicate content for the seamless loop — rendered track is 2× items.
  const doubled = useMemo(() => [...items, ...items], [items]);

  const handleKey = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (!kbdControl) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      const track = trackRef.current;
      if (!track) return;
      const current = parseFloat(track.dataset.nudge ?? "0");
      const delta = e.key === "ArrowRight" ? -5 : 5;
      const next = current + delta;
      track.dataset.nudge = String(next);
      track.style.setProperty("--nudge", `${next}%`);
    },
    [kbdControl],
  );

  // Pause CSS animation while user is nudging via keyboard
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = "translate3d(var(--nudge, 0%), 0, 0)";
  }, []);

  return (
    <div
      ref={regionRef}
      className={`marquee-region marquee-fade overflow-hidden py-4 ${className}`}
      role="region"
      aria-roledescription="desfile"
      aria-label={ariaLabel}
      tabIndex={kbdControl ? 0 : -1}
      onKeyDown={handleKey}
    >
      {/* Screen-reader canonical list */}
      <ul className="sr-only">
        {items.map((item, i) => (
          <li key={`${typeof item === "string" ? item : "item"}-${i}`}>
            {item}
          </li>
        ))}
      </ul>
      {/* Visible duplicated track, hidden from a11y */}
      <div
        ref={trackRef}
        className="marquee-track"
        data-direction={direction}
        aria-hidden="true"
        style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-8 whitespace-nowrap ${variantItemClass[variant]} ${variantItemSize[variant]}`}
          >
            {item}
            <span
              aria-hidden
              className="inline-block h-1 w-1 rotate-45 bg-brand"
            />
          </span>
        ))}
      </div>
    </div>
  );
}
