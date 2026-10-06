// src/components/media/PhotoView.tsx
// A photograph at its own aspect ratio. The box takes the file's real "W/H",
// so object-cover never has anything to crop. This is the presentation half:
// it takes the blur placeholder as a prop, so a Client Component can render a
// photograph without pulling the whole generated blur map into its bundle.
// Server Components use `Photo`, which looks the placeholder up.
import Image from 'next/image';
import { cn } from '@/lib/cn';
import type { Photo as PhotoData } from '@/data/media/paths';
import type { ImageGrade } from '@/data/band';

export interface PhotoViewProps {
  photo: PhotoData;
  /** next/image `sizes` — how wide the box renders at each breakpoint. */
  sizes: string;
  /** Blur placeholder as a data URL (src/data/blur.ts). */
  blur?: string;
  /** The route's LCP image: preloaded from <head>. One per page. */
  preload?: boolean;
  /** Above the fold without being the LCP: fetched at once, ahead of the rest. */
  eager?: boolean;
  /** Must be one of next.config.ts `images.qualities`. */
  quality?: 75 | 90;
  grade?: ImageGrade;
  /** Arrive out of the LED wall as it scrolls into view (.led-resolve). */
  led?: boolean;
  className?: string;
}

export function PhotoView({
  photo,
  sizes,
  blur,
  preload = false,
  eager = false,
  quality = 75,
  grade,
  led = false,
  className,
}: PhotoViewProps) {
  return (
    <div
      className={cn('relative w-full overflow-hidden bg-surface-raise', led && 'led-resolve', className)}
      style={{ aspectRatio: photo.aspect.replace('/', ' / ') }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        preload={preload}
        loading={eager && !preload ? 'eager' : undefined}
        fetchPriority={eager && !preload ? 'high' : undefined}
        quality={quality}
        placeholder={blur ? 'blur' : 'empty'}
        blurDataURL={blur}
        className={cn('object-cover', grade === 'vintage' && 'grade-vintage')}
      />
    </div>
  );
}
