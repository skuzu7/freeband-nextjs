'use client';

// src/components/ui/SnapDots.tsx
// Position indicator for a scroll-snap row: one LED per item, the current one
// lit — and, when labels are given, a pair of step buttons for pointer
// devices (touch users swipe; the row is a native scroller). Reads the row by
// id so the row itself can stay a server component.
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

interface SnapDotsProps {
  /** id of the `.snap-row` element. */
  rowId: string;
  count: number;
  label: string;
  /** Accessible names for the step buttons; both are needed for them to render. */
  prev?: string;
  next?: string;
  className?: string;
}

function itemsOf(rowId: string): { row: HTMLElement; items: HTMLElement[] } | null {
  const row = document.getElementById(rowId);
  if (!row) return null;
  return { row, items: Array.from(row.children) as HTMLElement[] };
}

export function SnapDots({ rowId, count, label, prev, next, className }: SnapDotsProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const found = itemsOf(rowId);
    if (!found) return;
    const { row } = found;
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

  const step = (dir: -1 | 1) => {
    const found = itemsOf(rowId);
    if (!found) return;
    const { row, items } = found;
    const target = items[Math.max(0, Math.min(items.length - 1, active + dir))];
    if (!target) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    row.scrollTo({ left: target.offsetLeft - (items[0]?.offsetLeft ?? 0), behavior: reduce ? 'auto' : 'smooth' });
  };

  const arrows = prev !== undefined && next !== undefined;

  return (
    <div className={cn('flex items-center gap-5', className)}>
      <div className="flex items-center gap-2" role="img" aria-label={`${label} ${active + 1} / ${count}`}>
        {Array.from({ length: count }, (_, i) => (
          <i
            key={i}
            aria-hidden
            className={cn('transition-quick rounded-pill', i === active ? 'size-2 bg-led' : 'size-1.5 bg-led-dim')}
          />
        ))}
      </div>
      {arrows && (
        <div className="hidden items-center gap-2 md:flex">
          <StepButton label={prev} disabled={active === 0} onClick={() => step(-1)} dir={-1} />
          <StepButton label={next} disabled={active >= count - 1} onClick={() => step(1)} dir={1} />
        </div>
      )}
    </div>
  );
}

function StepButton({ label, disabled, onClick, dir }: { label: string; disabled: boolean; onClick: () => void; dir: -1 | 1 }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="transition-quick flex size-10 items-center justify-center rounded-sm border border-line text-ink hover:border-line-strong hover:text-led-text disabled:cursor-default disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={dir < 0 ? 'M10 3 5 8l5 5' : 'M6 3l5 5-5 5'} />
      </svg>
    </button>
  );
}
