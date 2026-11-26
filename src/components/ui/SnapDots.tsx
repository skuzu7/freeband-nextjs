'use client';

// src/components/ui/SnapDots.tsx
// Touch-friendly position indicator & step controls for horizontal scroll-snap
// carousels on both mobile and desktop: interactive dot jumps, tabular counter
// (01 / 04), and accessible Prev/Next buttons.
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { prefersReducedMotion } from '@/hooks/useReducedMotion';
import { Icon } from './Icon';

interface SnapDotsProps {
  /** id of the scroll-snap row element. */
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
      const left = row.scrollLeft + row.clientWidth * 0.28;
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

  const scrollToIndex = (targetIndex: number) => {
    const found = itemsOf(rowId);
    if (!found) return;
    const { row, items } = found;
    const clamped = Math.max(0, Math.min(items.length - 1, targetIndex));
    const target = items[clamped];
    if (!target) return;
    const reduce = prefersReducedMotion();
    row.scrollTo({
      left: target.offsetLeft - (items[0]?.offsetLeft ?? 0),
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const arrows = prev !== undefined && next !== undefined;

  return (
    <div className={cn('flex items-center justify-between gap-4 sm:justify-start sm:gap-5', className)}>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium tabular-nums text-ink-muted" aria-live="polite">
          {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-1.5" role="group" aria-label={label}>
          {Array.from({ length: count }, (_, i) => {
            const isCurrent = i === active;
            return (
              <button
                key={i}
                type="button"
                aria-label={`${label} ${i + 1} de ${count}`}
                aria-current={isCurrent ? 'true' : undefined}
                onClick={() => scrollToIndex(i)}
                className="flex h-8 items-center justify-center px-1 focus-visible:outline-offset-2"
              >
                <span
                  aria-hidden
                  className={cn(
                    'transition-quick block h-1.5 rounded-pill',
                    isCurrent ? 'w-5 bg-led' : 'w-1.5 bg-line-strong hover:bg-ink-muted',
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      {arrows && (
        <div className="flex items-center gap-1.5">
          <StepButton label={prev} disabled={active === 0} onClick={() => scrollToIndex(active - 1)} dir={-1} />
          <StepButton label={next} disabled={active >= count - 1} onClick={() => scrollToIndex(active + 1)} dir={1} />
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
      className="transition-quick tap flex items-center justify-center rounded-sm border border-line text-ink hover:border-line-strong hover:text-led-text disabled:cursor-default disabled:opacity-30 disabled:hover:border-line disabled:hover:text-ink"
    >
      <Icon name={dir < 0 ? 'chevron-left' : 'chevron-right'} className="size-4" />
    </button>
  );
}
