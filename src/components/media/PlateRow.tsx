// src/components/media/PlateRow.tsx
// One equal-height row of whole photographs. Column widths are fr values
// proportional to each photo's ratio, so every box ends at the same height and
// no picture is cropped. On phones a row of portraits stays side by side;
// anything else stacks.
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { ratioOf, type Photo as PhotoData } from '@/data/media/paths';
import { Photo } from './Photo';

export type PlateFrame = PhotoData & { caption?: string };

interface PlateRowProps {
  frames: PlateFrame[];
  className?: string;
  /** Render the caption under each frame. */
  captions?: boolean;
  priority?: boolean;
  /** Fraction of the viewport the whole row occupies on desktop (1 = full). */
  rowFraction?: number;
}

/** `sizes` for a frame taking `fraction` of a row that itself takes `rowFraction` of the viewport. */
function sizesFor(fraction: number, rowFraction: number, splitOnMobile: boolean): string {
  const desktop = Math.ceil(fraction * rowFraction * 100);
  const capped = Math.ceil(fraction * rowFraction * 1408);
  const mobile = splitOnMobile ? Math.ceil(fraction * 100) : 100;
  return `(min-width: 1408px) ${capped}px, (min-width: 640px) ${desktop}vw, ${mobile}vw`;
}

export function PlateRow({ frames, className, captions = true, priority = false, rowFraction = 1 }: PlateRowProps) {
  const ratios = frames.map((f) => ratioOf(f.aspect));
  const total = ratios.reduce((a, b) => a + b, 0);
  const cols = ratios.map((r) => `${r.toFixed(4)}fr`).join(' ');
  const allPortrait = frames.length > 1 && ratios.every((r) => r < 1);
  const style = { '--plate-cols': cols, '--plate-cols-m': allPortrait ? cols : '1fr' } as CSSProperties;

  return (
    <div className={cn('plate', className)} style={style}>
      {frames.map((frame, i) => (
        <figure key={frame.src} className="m-0 flex flex-col gap-2">
          <Photo
            photo={frame}
            sizes={sizesFor(ratios[i] / total, rowFraction, allPortrait)}
            priority={priority && i === 0}
          />
          {captions && frame.caption && (
            <figcaption className="label-caps text-ink-low">{frame.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
