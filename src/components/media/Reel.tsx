'use client';

// src/components/media/Reel.tsx
// One silent clip. The source is attached only when the reel scrolls into
// view (preload="none" until then), it plays only while visible and while the
// group says so, and never under prefers-reduced-motion.
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { Reel as ReelData } from '@/data/media/reels';
import { Label } from '@/components/ui/Label';

interface ReelProps {
  reel: ReelData;
  /** False while the group's single pause control is engaged. */
  active: boolean;
  className?: string;
}

export function Reel({ reel, active, className }: ReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (inView && !el.currentSrc && !el.getAttribute('src')) {
      el.setAttribute('src', reel.src);
      el.load();
    }
    if (inView && active) {
      el.play().catch(() => {
        /* autoplay refused: the poster stays */
      });
    } else {
      el.pause();
    }
  }, [inView, active, reel.src]);

  return (
    <figure className={cn('m-0 flex flex-col gap-2', className)}>
      <div
        className="relative overflow-hidden bg-surface-raise"
        style={{ aspectRatio: reel.aspect.replace('/', ' / ') }}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={reel.poster}
          aria-label={reel.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-ink-muted">{reel.caption}</span>
        <Label className="text-ink-low">{reel.tag}</Label>
      </figcaption>
    </figure>
  );
}
