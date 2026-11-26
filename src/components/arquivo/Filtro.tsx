// src/components/arquivo/Filtro.tsx
// Horizontally scrollable touch-first filter strip on mobile; clean wrapped
// segmented buttons on desktop with tabular counts.
import { cn } from '@/lib/cn';
import { arquivo, type FilterKey } from '@/data/copy/arquivo';

interface FiltroProps {
  value: FilterKey;
  counts: Record<FilterKey, number>;
  onChange: (key: FilterKey) => void;
}

export function Filtro({ value, counts, onChange }: FiltroProps) {
  return (
    <div
      role="group"
      aria-label={arquivo.filterLabel}
      className="scroll-strip -mx-[var(--pad-inline)] gap-2 px-[var(--pad-inline)] pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
    >
      {arquivo.filters.map((f) => {
        const active = f.key === value;
        return (
          <button
            key={f.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(f.key)}
            className={cn(
              'label-caps transition-quick tap inline-flex shrink-0 items-center gap-2 whitespace-nowrap border px-3.5 py-2.5',
              active
                ? 'border-led bg-surface-raise text-ink'
                : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
            )}
          >
            <span>{f.label}</span>{' '}
            <span className={cn('tabular-nums', active ? 'text-led-text' : 'text-ink-low')}>
              {counts[f.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
