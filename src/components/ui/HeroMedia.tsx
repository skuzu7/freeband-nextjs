'use client';

// src/components/ui/HeroMedia.tsx
// The hero background: a photograph first, then the band's own twelve-second
// camera loop. The poster is the loop's first frame, so the crossfade is
// invisible. The video only ever loads after the page has settled (idle
// callback), never for prefers-reduced-motion, and never with sound.
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { blurMap } from '@/data/blur';

interface HeroMediaProps {
  video: string;
  poster: string;
  alt: string;
}

export function HeroMedia({ video, poster, alt }: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let cancelled = false;
    const start = () => {
      if (cancelled || node.src) return;
      node.src = video;
      node
        .play()
        .then(() => setReady(true))
        .catch(() => {});
    };

    const hasIdle = typeof window.requestIdleCallback === 'function';
    const idleId = hasIdle
      ? window.requestIdleCallback(start, { timeout: 2500 })
      : window.setTimeout(start, 1500);

    return () => {
      cancelled = true;
      if (hasIdle) {
        window.cancelIdleCallback(idleId as number);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, [video]);

  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src={poster}
        alt={alt}
        fill
        priority
        sizes="100vw"
        quality={90}
        placeholder={blurMap[poster] ? 'blur' : undefined}
        blurDataURL={blurMap[poster]}
        className="grade-live object-cover"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden
        tabIndex={-1}
        className={`grade-live absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div aria-hidden className="photo-scrim absolute inset-0" />
    </div>
  );
}
