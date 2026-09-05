// src/components/media/PlateRow.tsx
// One equal-height row of whole photographs. Column widths are fr values
// proportional to each photo's ratio, so every box ends at the same height and
// no picture is cropped. On phones a row of portraits stays side by side;
// anything else stacks.
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { ratioOf, type Photo as PhotoData } from '@/data/media/paths';
import { LedPhoto } from '@/components/brand/LedPhoto';
import { Photo } from './Photo';

export type PlateFrame = PhotoData & { caption?: string };

/** `sizes` for a frame taking `fraction` of a row that itself takes `rowFraction` of the viewport. */
function sizesFor(fraction: number, rowFraction: number, splitOnMobile: boolean): string {
  const desktop = Math.ceil(fraction * rowFraction * 100);
  const capped = Math.ceil(fraction * rowFraction * 1408);
  const mobile = splitOnMobile ? Math.ceil(fraction * 100) : 100;
  return `(min-width: 1408px) ${capped}px, (min-width: 640px) ${desktop}vw, ${mobile}vw`;
}

export interface PlateLayout {
  /** CSS variables for the `.plate` grid. */
  style: CSSProperties;
  /** next/image `sizes` per frame, in order. */
  sizes: string[];
}

/**
 * The grid template and image sizes for one row of frames. Exported so
 * anything that needs its own markup around each frame (a button opening a
 * lightbox, say) can still lay the row out by the same rule.
 */
export function plateLayout(frames: PhotoData[], rowFraction = 1): PlateLayout {
  const ratios = frames.map((f) => ratioOf(f.aspect));
  const total = ratios.reduce((a, b) => a + b, 0);
  const cols = ratios.map((r) => `${r.toFixed(4)}fr`).join(' ');
  const allPortrait = frames.length > 1 && ratios.every((r) => r < 1);
  return {
    style: { '--plate-cols': cols, '--plate-cols-m': allPortrait ? cols : '1fr' } as CSSProperties,
    sizes: ratios.map((r) => sizesFor(r / total, rowFraction, allPortrait)),
  };
}

interface PlateRowProps {
  frames: PlateFrame[];
  className?: string;
  /** Render the caption under each frame. */
  captions?: boolean;
  priority?: boolean;
  /** Fraction of the viewport the whole row occupies on desktop (1 = full). */
  rowFraction?: number;
  /** Must be one of next.config.ts `images.qualities`. */
  quality?: 75 | 90;
  /** Resolve each photograph out of the LED panel when it scrolls into view. */
  led?: boolean;
}

export function PlateRow({
  frames,
  className,
  captions = true,
  priority = false,
  rowFraction = 1,
  quality,
  led = false,
}: PlateRowProps) {
  const layout = plateLayout(frames, rowFraction);

  return (
    <div className={cn('plate', className)} style={layout.style}>
      {frames.map((frame, i) => (
        <figure key={frame.src} className="m-0 flex flex-col gap-2">
          {led ? (
            <LedPhoto photo={frame} sizes={layout.sizes[i]} priority={priority && i === 0} quality={quality} />
          ) : (
            <Photo photo={frame} sizes={layout.sizes[i]} priority={priority && i === 0} quality={quality} />
          )}
          {captions && frame.caption && (
            <figcaption className="label-caps text-ink-low">{frame.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
