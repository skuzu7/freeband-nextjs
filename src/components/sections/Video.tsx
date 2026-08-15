'use client';

// src/components/sections/Video.tsx
// Four silent 16:9 clips cut from the band's own camera footage, looping in
// a two-by-two grid. Sources attach only on intersection; one control pauses
// everything (WCAG 2.2.2).
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { pageCopy } from '@/data/content';
import { reels } from '@/data/images';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeadline } from '@/components/ui/SectionHeadline';

export function Video() {
  const copy = pageCopy.video;
  const videosRef = useRef<Array<HTMLVideoElement | null>>([]);
  const [playing, setPlaying] = useState(false);

  const setVideoRef = useCallback(
    (index: number) => (node: HTMLVideoElement | null) => {
      videosRef.current[index] = node;
    },
    [],
  );

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            if (!video.src && video.dataset.src) video.src = video.dataset.src;
            if (!reduced) {
              void video.play().catch(() => {});
            }
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: '200px 0px', threshold: 0.25 },
    );

    const videos = videosRef.current.filter((v): v is HTMLVideoElement => v !== null);
    const updatePlaying = () => {
      const anyPlaying = videosRef.current.some((v) => v && !v.paused);
      setPlaying(anyPlaying);
    };

    videos.forEach((video) => {
      observer.observe(video);
      video.addEventListener('play', updatePlaying);
      video.addEventListener('pause', updatePlaying);
    });

    return () => {
      observer.disconnect();
      videos.forEach((video) => {
        video.removeEventListener('play', updatePlaying);
        video.removeEventListener('pause', updatePlaying);
      });
    };
  }, []);

  const toggle = () => {
    const videos = videosRef.current.filter((v): v is HTMLVideoElement => v !== null);
    if (playing) {
      videos.forEach((video) => video.pause());
      setPlaying(false);
    } else {
      videos.forEach((video) => {
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
        void video.play().catch(() => {});
      });
      setPlaying(true);
    }
  };

  return (
    <Section id="video" variant="ink-raise" pad="xl">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div className="max-w-3xl">
            <SectionHeadline
              eyebrowNumber={copy.eyebrowNumber}
              eyebrowLabel={copy.eyebrowLabel}
              prefix={copy.headlinePrefix}
              emphasis={copy.headlineEmphasis}
              suffix={copy.headlineSuffix}
              lead={copy.lead}
            />
          </div>

          <button
            type="button"
            onClick={toggle}
            className="inline-flex min-h-11 items-center gap-3 border border-border-strong bg-bg-high/60 px-5 py-3 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-text transition-all hover:border-brand hover:text-brand hover:glow-gold-soft cursor-pointer"
          >
            {playing ? (
              <Pause aria-hidden className="h-3.5 w-3.5 text-brand" />
            ) : (
              <Play aria-hidden className="h-3.5 w-3.5 text-brand" />
            )}
            {playing ? copy.pauseLabel : copy.playLabel}
          </button>
        </div>

        <ul className="mt-[clamp(2.5rem,5vi,4rem)] grid grid-cols-1 gap-[clamp(1.25rem,2.5vi,2rem)] sm:grid-cols-2">
          {reels.map((reel, i) => (
            <li
              key={reel.src}
              className="reveal-mid group"
              style={{ ['--i' as string]: i % 2 } as React.CSSProperties}
            >
              <figure>
                <div className="relative aspect-video overflow-hidden bg-bg ring-1 ring-inset ring-border">
                  <video
                    ref={setVideoRef(i)}
                    data-src={reel.src}
                    poster={reel.poster}
                    aria-label={reel.alt}
                    muted
                    loop
                    playsInline
                    preload="none"
                    disablePictureInPicture
                    className="grade-live h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Corner tag — reel index over a quiet scrim */}
                  <span className="absolute left-0 top-0 z-10 inline-flex items-center gap-2 bg-bg/75 px-3 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.26em] text-text backdrop-blur-sm">
                    <span className="font-semibold text-brand">R·{String(i + 1).padStart(2, '0')}</span>
                    {reel.tag}
                  </span>
                </div>

                <figcaption className="mt-3 flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-text-muted">
                  <span aria-hidden className="inline-block h-px w-4 shrink-0 bg-brand" />
                  {reel.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-[clamp(2rem,4vi,3rem)] flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-text-muted">
          <span aria-hidden className="inline-block h-px w-10 shrink-0 bg-brand" />
          {copy.footnote}
        </p>
      </Container>
    </Section>
  );
}
