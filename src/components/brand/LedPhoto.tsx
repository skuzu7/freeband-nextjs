'use client';

// src/components/brand/LedPhoto.tsx
// A photograph that resolves out of the panel: first the picture as a field
// of dots lighting up, then the dots fade and the real photo takes over. The
// raster reads a small optimised copy of the file (384px through next/image),
// never the full-size original.
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { ratioOf, type Photo as PhotoData } from '@/data/media/paths';
import { Photo } from '@/components/media/Photo';
import { LedPanel } from './LedPanel';

interface LedPhotoProps {
  photo: PhotoData;
  sizes: string;
  /** Dot columns across the frame; rows follow the aspect, capped by LedPanel. */
  cols?: number;
  priority?: boolean;
  quality?: 75 | 90;
  className?: string;
}

/** The thumbnail next/image would serve at 384px — enough for a few thousand dots. */
function rasterSrc(src: string): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=384&q=75`;
}

export function LedPhoto({ photo, sizes, cols = 96, priority, quality, className }: LedPhotoProps) {
  const [lit, setLit] = useState(false);
  return (
    <LedPanel
      source={{ kind: 'image', src: rasterSrc(photo.src), fit: 'cover' }}
      aspect={ratioOf(photo.aspect)}
      cols={cols}
      field={false}
      fadeWhenLit
      onLit={() => setLit(true)}
      className={cn('bg-surface-raise', className)}
    >
      <div className={cn('absolute inset-0 transition-opacity duration-700 ease-light', lit ? 'opacity-100' : 'opacity-0')}>
        <Photo photo={photo} sizes={sizes} priority={priority} quality={quality} className="h-full" />
      </div>
    </LedPanel>
  );
}
