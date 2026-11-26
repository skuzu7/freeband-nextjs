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
  /** For `aria-labelledby` when the label doubles as a block's heading. */
  id?: string;
  className?: string;
}

export function Label({ children, dot: _dot = false, as: Tag = 'span', id, className }: LabelProps) {
  void _dot;
  return (
    <Tag id={id} className={cn('label-caps inline-flex items-center gap-2 text-led-text', className)}>
      {children}
    </Tag>
  );
}
