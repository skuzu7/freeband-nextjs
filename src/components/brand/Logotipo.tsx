// src/components/brand/Logotipo.tsx
// The full lock-up as printed on the backdrop: "INTERNACIONAL" in caps over a
// rule, the wordmark beneath. The wordmark takes the red; the caps line takes
// the muted ink so the red is the only saturated thing in the block.
import { cn } from '@/lib/cn';
import { Wordmark } from './Wordmark';

interface LogotipoProps {
  className?: string;
  /** Sizing for the wordmark itself — pass a height, leave the width auto. */
  markClassName?: string;
  /** Hides the "INTERNACIONAL" line and its rule (tight spots, e.g. the nav). */
  compact?: boolean;
  title?: string;
}

export function Logotipo({
  className,
  markClassName = 'h-[clamp(2.5rem,7vi,5.5rem)] w-auto',
  compact = false,
  title,
}: LogotipoProps) {
  return (
    <span className={cn('flex flex-col items-start gap-2', className)}>
      {!compact && (
        <span className="flex w-full items-center gap-3 text-ink-muted">
          <span className="label-caps">Internacional</span>
          <span aria-hidden className="dot-line flex-1" />
        </span>
      )}
      <Wordmark className={cn('text-red', markClassName)} title={title} />
    </span>
  );
}
