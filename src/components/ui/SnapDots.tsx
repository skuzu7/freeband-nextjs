'use client';

// src/components/ui/SnapDots.tsx
// Position indicator for a scroll-snap row: one LED per item, the current one
// lit. Reads the row by id so the row itself can stay a server component.
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

interface SnapDotsProps {
  /** id of the `.snap-row` element. */
  rowId: string;
  count: number;
  label: string;
  className?: string;
}

export function SnapDots({ rowId, count, label, className }: SnapDotsProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const row = document.getElementById(rowId);
    if (!row) return;
    const update = () => {
      const items = Array.from(row.children) as HTMLElement[];
      if (items.length === 0) return;
      const left = row.scrollLeft + row.clientWidth * 0.25;
      let index = 0;
      items.forEach((item, i) => {
        if (item.offsetLeft <= left) index = i;
      });
      setActive(Math.min(count - 1, index));
    };
    update();
    row.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      row.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [rowId, count]);

  return (
    <div className={cn('flex items-center gap-2', className)} role="img" aria-label={`${label} ${active + 1} / ${count}`}>
      {Array.from({ length: count }, (_, i) => (
        <i
          key={i}
          aria-hidden
          className={cn(
            'transition-quick rounded-pill',
            i === active ? 'size-2 bg-led' : 'size-1.5 bg-led-dim',
          )}
        />
      ))}
    </div>
  );
}
