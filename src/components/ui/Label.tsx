// src/components/ui/Label.tsx
// Caps label with tracking, optionally led by a lit dot. Section kickers,
// captions, metadata. Text colour is a prop so the label can sit on any theme.
import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface LabelProps {
  children: ReactNode;
  /** Draws a single LED dot before the text. */
  dot?: boolean;
  as?: ElementType;
  className?: string;
}

export function Label({ children, dot = false, as: Tag = 'span', className }: LabelProps) {
  return (
    <Tag className={cn('label-caps inline-flex items-center gap-2.5 text-led-text', className)}>
      {dot && <i aria-hidden className="inline-block size-1.5 shrink-0 rounded-pill bg-led" />}
      {children}
    </Tag>
  );
}
