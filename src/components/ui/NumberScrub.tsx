// src/components/ui/NumberScrub.tsx
// Oversized editorial number. Two variants:
//   - "counter": big brand-colored figure with an optional label underneath
//   - "phone":   static render, monospace digits
import type { ReactNode } from "react";

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

  return (
    <div className={`flex flex-col items-start leading-none ${className}`}>
      <span
        className="font-display font-semibold text-brand -tracking-[0.06em] leading-[0.75]"
        style={{ fontSize: "clamp(6rem, 22vi, 22rem)" }}
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
