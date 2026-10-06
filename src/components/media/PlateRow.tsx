// src/components/media/PlateRow.tsx
// One equal-height row of whole photographs, laid out by the plate rule
// (src/lib/plates.ts). On phones a row of portraits stays side by side; two
// frames still share the width; anything else stacks vertically so each
// photograph stays whole (see .plate in src/styles/motifs.css).
//
// A frame that carries a `link` opens itself in the photo viewer: the same
// box, wrapped in a link to the photograph's own address (PhotoLink). The
// blur placeholder is looked up here, on the server, and handed down.
import { blurMap } from '@/data/blur';
import { cn } from '@/lib/cn';
import type { PhotoLinkTarget } from '@/lib/gallery/sets';
import { plateLayout } from '@/lib/plates';
import type { ImageGrade } from '@/data/band';
import type { Photo as PhotoData } from '@/data/media/paths';
import { PhotoLink } from './lightbox/PhotoLink';
import { Photo } from './Photo';

export type PlateFrame = PhotoData & {
  caption?: string;
  /** How the print is treated (a faded one gets the vintage grade). */
  grade?: ImageGrade;
  /** Opens the frame in the photo viewer (see linkFor in src/lib/gallery/sets.ts). */
  link?: PhotoLinkTarget;
};

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
      {frames.map((frame, i) => {
        // Only the photograph crosses to the client: not the caption, not the act.
        const photo: PhotoData = { src: frame.src, alt: frame.alt, aspect: frame.aspect };
        const view = { photo, sizes: layout.sizes[i], preload: preload && i === 0, quality, led, grade: frame.grade };
        return (
          <figure key={frame.src} className="m-0 flex flex-col gap-2">
            {frame.link ? <PhotoLink link={frame.link} blur={blurMap[frame.src]} {...view} /> : <Photo {...view} />}
            {frame.caption && <figcaption className="label-caps text-ink-low">{frame.caption}</figcaption>}
          </figure>
        );
      })}
    </div>
  );
}
