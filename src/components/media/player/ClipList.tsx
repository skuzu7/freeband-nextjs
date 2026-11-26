// src/components/media/player/ClipList.tsx
// A set of clips. When `carouselId` is passed, phones get a smooth horizontal
// peek scroll-snap strip while tablet/desktop keep the multi-column editorial grid.
import type { VideoClip } from '@/data/media/videos';
import { cn } from '@/lib/cn';
import { Clip } from './Clip';

const GRID = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
} as const;

/** How wide a clip's poster renders: the page column is 88rem at most. */
const SIZES = {
  2: '(min-width: 88rem) 40rem, (min-width: 48rem) 50vw, 86vw',
  3: '(min-width: 88rem) 27rem, (min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 86vw',
  lead: '(min-width: 88rem) 27rem, (min-width: 64rem) 33vw, 86vw',
} as const;

interface ClipListProps {
  clips: VideoClip[];
  /** Clips abreast on a desktop. */
  columns?: 2 | 3;
  /** Optional id enabling a horizontal touch snap carousel below md:. */
  carouselId?: string;
  className?: string;
}

export function ClipList({ clips, columns = 2, carouselId, className }: ClipListProps) {
  if (carouselId) {
    return (
      <div
        id={carouselId}
        className={cn(
          'scroll-strip -mx-[var(--pad-inline)] gap-4 px-[var(--pad-inline)] pb-2 md:mx-0 md:grid md:gap-x-5 md:gap-y-12 md:overflow-visible md:px-0 md:pb-0',
          GRID[columns],
          className,
        )}
      >
        {clips.map((clip, i) => {
          const lead = columns === 3 && i === 0;
          return (
            <Clip
              key={clip.id}
              clip={clip}
              sizes={lead ? SIZES.lead : SIZES[columns]}
              className={cn(
                'w-[86vw] max-w-[26rem] md:w-auto md:max-w-none',
                lead && 'md:max-lg:col-span-2',
              )}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('grid gap-x-5 gap-y-12', GRID[columns], className)}>
      {clips.map((clip, i) => {
        const lead = columns === 3 && i === 0;
        return (
          <Clip
            key={clip.id}
            clip={clip}
            sizes={lead ? SIZES.lead : SIZES[columns]}
            className={lead ? 'md:max-lg:col-span-2' : undefined}
          />
        );
      })}
    </div>
  );
}
