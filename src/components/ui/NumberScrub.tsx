// src/components/ui/NumberScrub.tsx
// Oversized scroll-driven number. Two variants:
//   - "counter": animates --n from 0 → value as the element crosses the viewport
//   - "phone":   static render, monospace digits (counting a phone number up
//                would be corny — phone just renders big and proud)
//
// Implementation uses CSS `counter()` + `@property --n` for the counter variant.
// Fallback: static final value. Reduced-motion: static final value.
import type { CSSProperties, ReactNode } from "react";

interface NumberScrubProps {
  value: number | string;
  variant?: "counter" | "phone";
  label?: ReactNode;
  className?: string;
}

export function NumberScrub({
  value,
  variant = "counter",
  label,
  className = "",
}: NumberScrubProps) {
  if (variant === "phone") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label ? (
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-text-muted">
            {label}
          </span>
        ) : null}
        <span
          className="font-display font-semibold text-text -tracking-[0.03em] leading-[0.85] [font-variant-numeric:tabular-nums]"
          style={{ fontSize: "clamp(2.75rem, 7vi, 6rem)" }}
        >
          {value}
        </span>
      </div>
    );
  }

  const numeric =
    typeof value === "string" ? parseInt(value, 10) || 0 : value;

  const style = {
    "--n-target": String(numeric),
    counterReset: `n ${numeric}`,
  } as CSSProperties;

  return (
    <div className={`flex flex-col items-start leading-none ${className}`}>
      <span
        aria-hidden
        className="number-scrub font-display font-semibold text-brand -tracking-[0.06em] leading-[0.75]"
        style={{
          ...style,
          fontSize: "clamp(6rem, 22vi, 22rem)",
        }}
      >
        {numeric}
      </span>
      {label ? (
        <span className="mt-4 font-mono text-[0.72rem] uppercase tracking-[0.3em] text-text-muted">
          {label}
        </span>
      ) : null}
    </div>
  );
}
