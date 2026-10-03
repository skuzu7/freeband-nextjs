// src/components/brand/LedNumber.tsx
// A number set in a real 5×7 dot matrix — the way a LED sign would show it —
// not a font pretending to be one. Static SVG, server-renderable; each lit
// dot switches on with a small stagger (CSS, killed under reduced motion).
// The digits are read by assistive tech from the visually hidden text.
import { cn } from '@/lib/cn';
import { ledDots } from '@/lib/led/matrix';

interface LedNumberProps {
  /** Digits, "+" and spaces only; anything else renders as a blank cell. */
  value: string;
  /** Visible caption set beside the digits (e.g. "anos de estrada"). */
  label?: string;
  className?: string;
  /** Height of the matrix; width follows. */
  matrixClassName?: string;
  /** Whether the dots stagger on when rendered. */
  animate?: boolean;
  /** False keeps every dot unlit — flip to true to switch the number on. */
  on?: boolean;
}

export function LedNumber({
  value,
  label,
  className,
  matrixClassName = 'h-[clamp(2.5rem,6vi,4.5rem)]',
  animate = true,
  on = true,
}: LedNumberProps) {
  const { width, rows, dots } = ledDots(value);

  return (
    <span className={cn('inline-flex items-end gap-4', className)}>
      <span className="sr-only">{value}</span>
      <svg
        viewBox={`0 0 ${width} ${rows}`}
        className={cn('w-auto text-led', matrixClassName)}
        aria-hidden
        focusable="false"
        style={{ aspectRatio: `${width} / ${rows}` }}
      >
        {dots.map((d) => {
          const lit = d.on && on;
          return (
            <circle
              key={`${d.x}-${d.y}`}
              cx={d.x + 0.5}
              cy={d.y + 0.5}
              r={lit ? 0.42 : 0.16}
              fill={lit ? 'currentColor' : 'var(--color-led-dim)'}
              className={lit && animate ? 'animate-led-on' : undefined}
              style={
                lit && animate
                  ? { animationDelay: `${d.i * 14}ms`, transformBox: 'fill-box', transformOrigin: 'center' }
                  : undefined
              }
            />
          );
        })}
      </svg>
      {label && <span className="label-caps max-w-[10rem] text-ink-muted">{label}</span>}
    </span>
  );
}
