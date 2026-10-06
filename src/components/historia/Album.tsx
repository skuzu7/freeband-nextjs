// src/components/historia/Album.tsx
// An era's photographs as plates: each row is whole photographs at one height
// (the plate rule, src/lib/plates.ts), and every one of them opens in the
// photo viewer at its own address, /historia/foto/<id>.
//
// A plate grows as tall as its width allows, so a row of two portraits would
// tower over the text beside it. Each row is therefore held to a width that
// keeps it under ROW_MAX_REM tall: the sum of its ratios times that height.
import type { EraImage } from '@/data/band';
import { gallery } from '@/data/media/gallery';
import { ratioOf } from '@/data/media/paths';
import { cn } from '@/lib/cn';
import { linkFor } from '@/lib/gallery/sets';
import { PlateRow } from '@/components/media/PlateRow';

/** Tallest a row of archive photographs stands, in rem. */
const ROW_MAX_REM = 26;

interface AlbumProps {
  /** One inner list per plate, in reading order. */
  rows: EraImage[][];
  /** The first photograph of the first row is the route's LCP image. */
  preload?: boolean;
  /** Must be one of next.config.ts `images.qualities`. */
  quality?: 75 | 90;
  className?: string;
}

export function Album({ rows, preload = false, quality, className }: AlbumProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {rows.map((row, i) => {
        const widthRem = row.reduce((sum, photo) => sum + ratioOf(photo.aspect), 0) * ROW_MAX_REM;
        return (
          <div key={row[0].id} style={{ maxWidth: `min(100%, ${widthRem.toFixed(2)}rem)` }}>
            <PlateRow
              frames={row.map((photo) => ({ ...photo, link: linkFor(gallery.historia, photo.id) }))}
              rowFraction={0.6}
              preload={preload && i === 0}
              quality={quality}
              led={!(preload && i === 0)}
            />
          </div>
        );
      })}
    </div>
  );
}
