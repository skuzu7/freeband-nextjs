// src/components/brand/Logotipo.tsx
// The full lock-up as printed on the backdrop: "INTERNACIONAL" in caps over a
// rule, the wordmark beneath. The wordmark takes the red; the caps line takes
// the muted ink so the red is the only saturated thing in the block.
import { cn } from '@/lib/cn';
import { BrandLine } from './BrandLine';
import { Wordmark } from './Wordmark';

interface LogotipoProps {
  className?: string;
  /** Sizing for the wordmark itself — pass a height, leave the width auto. */
  markClassName?: string;
  /** Renders wordmark with authentic extruded red acrylic stage lighting. */
  acrylic?: boolean;
  /** Adds soft ambient stage glow. */
  glow?: boolean;
  title?: string;
}

export function Logotipo({
  className,
  markClassName = 'h-[clamp(2.5rem,7vi,5.5rem)] w-auto',
  acrylic = false,
  glow = false,
  title,
}: LogotipoProps) {
  return (
    <span className={cn('flex flex-col items-start gap-2', className)}>
      <BrandLine rule />
      <Wordmark acrylic={acrylic} glow={glow} className={cn('text-red', markClassName)} title={title} />
    </span>
  );
}
