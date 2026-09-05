import { cn } from '@/lib/cn';

/** A single row of the panel: the dotted rule between blocks. */
export function Divider({ className }: { className?: string }) {
  return <hr aria-hidden className={cn('dot-line w-full', className)} />;
}
