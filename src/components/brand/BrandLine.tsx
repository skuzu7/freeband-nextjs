// src/components/brand/BrandLine.tsx
// "INTERNACIONAL" in caps, optionally trailed by a dotted rule: the line that
// sits over the wordmark on the backdrop, the header, the fold and the footer.
import { cn } from '@/lib/cn';
import { bandInfo } from '@/data/band';

interface BrandLineProps {
  /** Draws the dotted rule after the word, filling the row. */
  rule?: boolean;
  className?: string;
  /** Classes for the word itself, to resize it. */
  textClassName?: string;
}

export function BrandLine({ rule = false, className, textClassName }: BrandLineProps) {
  return (
    <span className={cn('flex items-center gap-3 text-ink-muted', rule && 'w-full', className)}>
      <span className={cn('label-caps', textClassName)}>{bandInfo.brandLine}</span>
      {rule && <span aria-hidden className="dot-line flex-1" />}
    </span>
  );
}
