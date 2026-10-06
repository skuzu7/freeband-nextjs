// src/components/brand/LedWordmark.tsx
// The fold's wordmark: the wall of dots lights the name, then the red acrylic
// takes over — the backdrop, as the audience sees it.
//
// Both drawings are in the HTML the server sends. The dots are computed here,
// from the same vector the acrylic is drawn with (src/lib/led/glyphs.ts), and
// the hand-over is a pair of CSS keyframes (src/styles/led.css). No canvas, no
// script, no state: without JavaScript, or under reduced motion, the acrylic
// mark is simply there.
import { cn } from '@/lib/cn';
import { WORDMARK_ASPECT } from '@/design/wordmark';
import { wordmarkCells } from '@/lib/led/glyphs';
import { gridPaths } from '@/lib/led/svg';
import { Wordmark } from './Wordmark';

/** Columns of dots across the mark: a stroke is a little over three dots wide. */
const COLS = 128;

// Module scope: sampled once per server process, not per request.
const grid = wordmarkCells(COLS);
const levels = gridPaths(grid);

interface LedWordmarkProps {
  /** Accessible name of the mark. */
  label: string;
  className?: string;
}

export function LedWordmark({ label, className }: LedWordmarkProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn('led-wordmark w-full', className)}
      style={{ aspectRatio: String(WORDMARK_ASPECT) }}
    >
      <svg
        viewBox={`0 0 ${grid.cols} ${grid.height}`}
        aria-hidden
        focusable="false"
        className="led-wordmark-dots text-led-hot drop-shadow-[0_0_6px_var(--color-led)]"
      >
        <g fill="none" stroke="currentColor" strokeLinecap="round" transform={`translate(0.5 ${grid.offsetY + 0.5})`}>
          {levels.map((level) => (
            <path key={level.width} d={level.d} strokeWidth={level.width} />
          ))}
        </g>
      </svg>
      <Wordmark acrylic glow className="led-wordmark-acrylic text-red" />
    </div>
  );
}
