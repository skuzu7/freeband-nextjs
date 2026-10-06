// src/components/brand/BrandLine.tsx
// "INTERNACIONAL" in caps, optionally trailed by a dotted rule: the line that
// sits over the wordmark on the backdrop, the header, the fold and the footer.
import { cn } from '@/lib/cn';
import { bandInfo } from '@/data/band';

const SIZES = {
  /** Over the small wordmark in the header. */
  sm: 'text-2xs',
  /** The lock-up in the footer and on the login. */
  md: 'text-xs',
  /** Over the wordmark on the fold. */
  lg: 'text-xs sm:text-sm',
} as const;

interface BrandLineProps {
  size?: keyof typeof SIZES;
  /** Draws the dotted rule after the word, filling the row. */
  rule?: boolean;
  className?: string;
}

export function BrandLine({ size = 'md', rule = false, className }: BrandLineProps) {
  return (
    <span className={cn('flex items-center gap-3 text-ink-muted', rule && 'w-full', className)}>
      <span className={cn('font-semibold uppercase leading-none tracking-label', SIZES[size])}>{bandInfo.brandLine}</span>
      {rule && <span aria-hidden className="dot-line flex-1" />}
    </span>
  );
}
