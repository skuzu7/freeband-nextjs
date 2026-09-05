import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface SectionProps {
  children: ReactNode;
  id?: string;
  /** Re-points the semantic colours for this block (the 1969 chapter uses sepia). */
  theme?: 'paper' | 'sepia';
  /** Accessible name for the landmark, usually the id of the heading inside. */
  labelledBy?: string;
  className?: string;
}

/** A page block with the standard vertical rhythm. Its own stacking context,
 *  so a DotGrid inside sits over the block's background, not behind it. */
export function Section({ children, id, theme, labelledBy, className }: SectionProps) {
  return (
    <section
      id={id}
      data-theme={theme}
      aria-labelledby={labelledBy}
      className={cn('section-gap relative isolate', theme && 'bg-surface text-ink', className)}
    >
      {children}
    </section>
  );
}
