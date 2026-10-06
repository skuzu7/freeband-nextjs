// src/components/media/player/Clip.tsx
// One clip as the page prints it: the player, then its title and what it
// shows, in text. A Server Component — the poster's blur placeholder is
// looked up here and handed to the player, which never imports the blur map.
import { blurMap } from '@/data/blur';
import type { VideoClip } from '@/data/media/videos';
import { cn } from '@/lib/cn';
import { Player } from './Player';

interface ClipProps {
  clip: VideoClip;
  /** next/image `sizes` of the poster: how wide the clip renders at each breakpoint. */
  sizes: string;
  className?: string;
}

export function Clip({ clip, sizes, className }: ClipProps) {
  // The clip's own address on the page: /palco#video-solo-de-guitarra.
  const id = `video-${clip.id}`;
  const titleId = `${id}-title`;
  return (
    <figure id={id} className={cn('m-0 flex min-w-0 flex-col gap-4', className)}>
      <Player clip={clip} sizes={sizes} blur={blurMap[clip.poster]} labelledBy={titleId} />
      <figcaption>
        <h3 id={titleId} className="text-xl font-semibold tracking-tight text-ink">
          {clip.title}
        </h3>
        <p className="mt-2 max-w-[60ch] text-sm text-ink-muted">{clip.description}</p>
      </figcaption>
    </figure>
  );
}
