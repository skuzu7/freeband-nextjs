'use client';

// src/components/arquivo/Cartazes.tsx
// The poster archive: filter, rows of whole flyers laid out by the plate rule,
// and a lightbox that walks only what the filter shows. Every fact printed
// under a flyer is transcribed from the artwork (src/data/media/posters.ts).
import { useMemo, useState } from 'react';
import { arquivo, type FilterKey } from '@/data/copy/arquivo';
import { posters, type Poster } from '@/data/media/posters';
import { Label } from '@/components/ui/Label';
import { Photo } from '@/components/media/Photo';
import { plateLayout } from '@/components/media/PlateRow';
import { Lightbox, type LightboxItem } from '@/components/media/Lightbox';
import { Filtro } from './Filtro';

const PER_ROW = 3;

function chunk<T>(list: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
}

const titleOf = (p: Poster) => `${p.town} · ${p.event}`;
const metaOf = (p: Poster) => [p.when !== '—' ? p.when : null, p.venue].filter(Boolean).join(' · ');

const counts = Object.fromEntries(
  arquivo.filters.map((f) => [
    f.key,
    f.key === 'todos' ? posters.length : posters.filter((p) => p.category === f.key).length,
  ]),
) as Record<FilterKey, number>;

export function Cartazes() {
  const [filter, setFilter] = useState<FilterKey>('todos');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === 'todos' ? posters : posters.filter((p) => p.category === filter)),
    [filter],
  );
  const items: LightboxItem[] = useMemo(
    () => visible.map((p) => ({ src: p.src, alt: p.alt, aspect: p.aspect, title: titleOf(p), meta: metaOf(p) })),
    [visible],
  );
  const rows = chunk(visible, PER_ROW);

  const select = (key: FilterKey) => {
    setFilter(key);
    setOpenIndex(null);
  };

  return (
    <div className="flex flex-col gap-10">
      <Filtro value={filter} counts={counts} onChange={select} />

      <div className="flex flex-col gap-10">
        {rows.map((row, r) => {
          const layout = plateLayout(row);
          return (
            <ul key={row.map((p) => p.src).join()} className="plate m-0 list-none p-0" style={layout.style}>
              {row.map((p, i) => {
                const index = r * PER_ROW + i;
                return (
                  <li key={p.src} className="flex flex-col gap-3">
                    <button
                      type="button"
                      aria-label={`${arquivo.lightbox.open}: ${titleOf(p)}`}
                      onClick={() => setOpenIndex(index)}
                      className="transition-quick block w-full cursor-zoom-in text-left hover:opacity-90"
                    >
                      <Photo photo={p} sizes={layout.sizes[i]} />
                    </button>
                    <div>
                      <p className="font-medium text-ink">{titleOf(p)}</p>
                      <p className="mt-0.5 text-sm text-ink-muted">{metaOf(p)}</p>
                      {p.municipal && <Label className="mt-2">{arquivo.municipalNote}</Label>}
                    </div>
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>

      <p className="text-sm text-ink-low">{arquivo.footnote}</p>

      <Lightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onChange={setOpenIndex}
        labels={arquivo.lightbox}
      />
    </div>
  );
}
