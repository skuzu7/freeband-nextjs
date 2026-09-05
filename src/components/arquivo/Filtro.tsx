// src/components/arquivo/Filtro.tsx
// The category filter: one pressed button per category, each carrying the
// number of flyers behind it, so the archive's size is legible at a glance.
import { cn } from '@/lib/cn';
import { arquivo, type FilterKey } from '@/data/copy/arquivo';

interface FiltroProps {
  value: FilterKey;
  counts: Record<FilterKey, number>;
  onChange: (key: FilterKey) => void;
}

export function Filtro({ value, counts, onChange }: FiltroProps) {
  return (
    <div role="group" aria-label={arquivo.filterLabel} className="flex flex-wrap gap-2">
      {arquivo.filters.map((f) => {
        const active = f.key === value;
        return (
          <button
            key={f.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(f.key)}
            className={cn(
              'label-caps transition-quick inline-flex items-center gap-2 border px-3.5 py-2.5',
              active
                ? 'border-led bg-surface-raise text-ink'
                : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
            )}
          >
            {f.label}{' '}
            <span className={cn('tabular-nums', active ? 'text-led-text' : 'text-ink-low')}>
              {counts[f.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
