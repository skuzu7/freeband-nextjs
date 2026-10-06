// src/components/brand/LedNumber.tsx
// A number set in a real 5×7 dot matrix — the way a LED sign would show it —
// not a font pretending to be one. Static SVG, server-rendered: the unlit
// panel is one path, the lit dots another (src/lib/led/matrix.ts), and the
// lit ones switch on in a single CSS sweep, killed under reduced motion.
// The digits are read by assistive tech from the visually hidden text.
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { ledPath } from '@/lib/led/matrix';

interface LedNumberProps {
  /** Digits, "+" and spaces only; anything else renders as a blank cell. */
  value: string;
  /** Visible caption set beside the digits (e.g. "anos de estrada"). */
  label?: string;
  className?: string;
  /** Height of the matrix; width follows. */
  matrixClassName?: string;
  /** Whether the dots sweep on when rendered. */
  animate?: boolean;
  /** Delay before the sweep, to stagger a row of numbers. */
  delayMs?: number;
}

/** Dot diameters in cell units: lit and unlit. */
const LIT = 0.84;
const UNLIT = 0.32;

export function LedNumber({
  value,
  label,
  className,
  matrixClassName = 'h-[clamp(2.5rem,6vi,4.5rem)]',
  animate = true,
  delayMs = 0,
}: LedNumberProps) {
  const { width, rows, all, lit } = ledPath(value);
  const box = { viewBox: `0 0 ${width} ${rows}`, 'aria-hidden': true, focusable: 'false' as const };

  return (
    <span className={cn('inline-flex items-end gap-4', className)}>
      <span className="sr-only">{value}</span>
      {/* Two stacked drawings of the same matrix: an outer <svg> has a CSS
          box, so the sweep's clip-path lands where it should. */}
      <span className={cn('grid w-auto', matrixClassName)} style={{ aspectRatio: `${width} / ${rows}` }}>
        <svg {...box} className="col-start-1 row-start-1 size-full">
          <path d={all} fill="none" strokeLinecap="round" strokeWidth={UNLIT} transform="translate(0.5 0.5)" style={{ stroke: 'var(--color-led-dim)' }} />
        </svg>
        <svg
          {...box}
          className={cn('col-start-1 row-start-1 size-full text-led', animate && 'led-number-on')}
          style={delayMs ? ({ '--led-delay': `${delayMs}ms` } as CSSProperties) : undefined}
        >
          <path d={lit} fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={LIT} transform="translate(0.5 0.5)" />
        </svg>
      </span>
      {label && <span className="label-caps max-w-[10rem] text-ink-muted">{label}</span>}
    </span>
  );
}
