// src/components/media/Photo.tsx
// A photograph at its own aspect ratio. The box takes the file's real "W/H",
// so object-cover never has anything to crop; the blur placeholder comes from
// the generated blur.ts. Every photo on the site goes through here.
import Image from 'next/image';
import { cn } from '@/lib/cn';
import { blurMap } from '@/data/blur';
import type { Photo as PhotoData } from '@/data/media/paths';
import type { ImageGrade } from '@/data/band';

interface PhotoProps {
  photo: PhotoData;
  /** next/image `sizes` — how wide the box renders at each breakpoint. */
  sizes: string;
  priority?: boolean;
  /** Must be one of next.config.ts `images.qualities`. */
  quality?: 75 | 90;
  grade?: ImageGrade;
  className?: string;
  imgClassName?: string;
}

export function Photo({
  photo,
  sizes,
  priority = false,
  quality = 75,
  grade,
  className,
  imgClassName,
}: PhotoProps) {
  const blur = blurMap[photo.src];
  return (
    <div
      className={cn('relative w-full overflow-hidden bg-surface-raise', className)}
      style={{ aspectRatio: photo.aspect.replace('/', ' / ') }}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={blur ? 'blur' : 'empty'}
        blurDataURL={blur}
        className={cn('object-cover', grade === 'vintage' && 'grade-vintage', imgClassName)}
      />
    </div>
  );
}
