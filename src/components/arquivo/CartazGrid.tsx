'use client';

// src/components/arquivo/CartazGrid.tsx
// The filter and the rows of whole flyers, laid out by the plate rule. Each
// flyer is a link to its own address, which opens it in the photo viewer; the
// viewer walks all nine whatever the filter shows, because a photograph's
// neighbours belong to its address, not to the state of this page.
import { useState } from 'react';
import { arquivo, type FilterKey } from '@/data/copy/arquivo';
import type { Photo as PhotoData } from '@/data/media/paths';
import type { PosterCategory } from '@/data/media/posters';
import type { PhotoLinkTarget } from '@/lib/gallery/sets';
import { plateLayout } from '@/lib/plates';
import { Label } from '@/components/ui/Label';
import { PhotoLink } from '@/components/media/lightbox/PhotoLink';
import { Filtro } from './Filtro';

/** One flyer as the grid prints it. Built on the server (Cartazes). */
export interface Cartaz {
  id: string;
  photo: PhotoData;
  blur?: string;
  link: PhotoLinkTarget;
  title: string;
  meta: string;
  municipal: boolean;
  category: PosterCategory;
}

interface CartazGridProps {
  cartazes: Cartaz[];
  counts: Record<FilterKey, number>;
}

const PER_ROW = 3;

function chunk<T>(list: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
}

export function CartazGrid({ cartazes, counts }: CartazGridProps) {
  const [filter, setFilter] = useState<FilterKey>('todos');
  const visible = filter === 'todos' ? cartazes : cartazes.filter((c) => c.category === filter);

  return (
    <div className="flex flex-col gap-10">
      <Filtro value={filter} counts={counts} onChange={setFilter} />

      <div className="flex flex-col gap-10">
        {chunk(visible, PER_ROW).map((row) => {
          const layout = plateLayout(row.map((c) => c.photo));
          return (
            <ul key={row.map((c) => c.id).join()} className="plate m-0 list-none p-0" style={layout.style}>
              {row.map((c, i) => (
                <li key={c.id} className="flex flex-col gap-3">
                  <PhotoLink link={c.link} photo={c.photo} blur={c.blur} sizes={layout.sizes[i]} />
                  <div>
                    <p className="font-medium text-ink">{c.title}</p>
                    <p className="mt-0.5 text-sm text-ink-muted">{c.meta}</p>
                    {c.municipal && <Label className="mt-2">{arquivo.municipalNote}</Label>}
                  </div>
                </li>
              ))}
            </ul>
          );
        })}
      </div>

      <p className="text-sm text-ink-low">{arquivo.footnote}</p>
    </div>
  );
}
