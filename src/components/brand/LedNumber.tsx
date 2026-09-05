// src/components/brand/LedNumber.tsx
// A number set in a real 5×7 dot matrix — the way a LED sign would show it —
// not a font pretending to be one. Static SVG, server-renderable; each lit
// dot switches on with a small stagger (CSS, killed under reduced motion).
// The digits are read by assistive tech from the visually hidden text.
import { cn } from '@/lib/cn';

// 5 columns × 7 rows, top to bottom. 1 = lit.
const MATRIX: Record<string, string[]> = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
};

const COLS = 5;
const ROWS = 7;
/** One blank column between characters. */
const ADVANCE = COLS + 1;

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
  const chars = Array.from(value);
  const width = chars.length * ADVANCE - 1;
  const dots: Array<{ x: number; y: number; on: boolean; i: number }> = [];
  let lit = 0;
  chars.forEach((ch, ci) => {
    const glyph = MATRIX[ch] ?? MATRIX[' '];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const on = glyph[y][x] === '1';
        dots.push({ x: ci * ADVANCE + x, y, on, i: on ? lit++ : -1 });
      }
    }
  });

  return (
    <span className={cn('inline-flex items-end gap-4', className)}>
      <span className="sr-only">{value}</span>
      <svg
        viewBox={`0 0 ${width} ${ROWS}`}
        className={cn('w-auto text-led', matrixClassName)}
        aria-hidden
        focusable="false"
        style={{ aspectRatio: `${width} / ${ROWS}` }}
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
