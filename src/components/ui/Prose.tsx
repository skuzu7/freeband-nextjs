import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ProseProps {
  children: ReactNode;
  className?: string;
}

/** Running text: measure, leading and paragraph spacing in one place. */
export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        'max-w-[62ch] text-base leading-[1.65] text-ink-muted [&>p+p]:mt-5 [&_strong]:font-semibold [&_strong]:text-ink',
        className,
      )}
    >
      {children}
    </div>
  );
}
