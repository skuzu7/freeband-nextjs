// src/components/media/PlateRow.tsx
// One equal-height row of whole photographs, laid out by the plate rule
// (src/lib/plates.ts). On phones a row of portraits stays side by side; two
// frames still share the width; anything else stacks vertically so each
// photograph stays whole (see .plate in src/styles/motifs.css).
import { cn } from '@/lib/cn';
import { plateLayout } from '@/lib/plates';
import type { Photo as PhotoData } from '@/data/media/paths';
import { Photo } from './Photo';

export type PlateFrame = PhotoData & { caption?: string };

interface PlateRowProps {
  frames: PlateFrame[];
  className?: string;
  /** The first frame is the route's LCP image. */
  preload?: boolean;
  /** Fraction of the viewport the whole row occupies on desktop (1 = full). */
  rowFraction?: number;
  /** Must be one of next.config.ts `images.qualities`. */
  quality?: 75 | 90;
  /** Resolve each photograph out of the LED wall when it scrolls into view. */
  led?: boolean;
}

export function PlateRow({ frames, className, preload = false, rowFraction = 1, quality, led = false }: PlateRowProps) {
  const layout = plateLayout(frames, rowFraction);

  return (
    <div className={cn('plate', className)} style={layout.style}>
      {frames.map((frame, i) => (
        <figure key={frame.src} className="m-0 flex flex-col gap-2">
          <Photo photo={frame} sizes={layout.sizes[i]} preload={preload && i === 0} quality={quality} led={led} />
          {frame.caption && <figcaption className="label-caps text-ink-low">{frame.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
