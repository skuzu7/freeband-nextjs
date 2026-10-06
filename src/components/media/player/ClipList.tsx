// src/components/media/player/ClipList.tsx
// A set of clips. One column on a phone, where a 16:9 picture needs the whole
// width; from 48rem two abreast, and a set of three takes three from 64rem.
// Between the two a set of three opens with its first clip across both
// columns, so no clip is left alone on a row.
import type { VideoClip } from '@/data/media/videos';
import { cn } from '@/lib/cn';
import { Clip } from './Clip';

const GRID = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
} as const;

/** How wide a clip's poster renders: the page column is 88rem at most. */
const SIZES = {
  2: '(min-width: 88rem) 40rem, (min-width: 48rem) 50vw, 100vw',
  3: '(min-width: 88rem) 27rem, (min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw',
  lead: '(min-width: 88rem) 27rem, (min-width: 64rem) 33vw, 100vw',
} as const;

interface ClipListProps {
  clips: VideoClip[];
  /** Clips abreast on a desktop. */
  columns?: 2 | 3;
  className?: string;
}

export function ClipList({ clips, columns = 2, className }: ClipListProps) {
  return (
    <div className={cn('grid gap-x-4 gap-y-12', GRID[columns], className)}>
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
