'use client';

// src/components/sections/Video.tsx
// Four silent clips from the band's own shows, looping in a row.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Video as VideoIcon } from 'lucide-react';
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
              void video.play().then(() => setPlaying(true)).catch(() => {});
            }
          } else {
            video.pause();
          }
        }
      },
      { rootMargin: '200px 0px', threshold: 0.25 },
    );

    const videos = videosRef.current.filter((v): v is HTMLVideoElement => v !== null);
    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
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

        <ul className="mt-[clamp(2.5rem,5vi,4rem)] grid grid-cols-1 gap-[clamp(1rem,2.5vi,1.75rem)] sm:grid-cols-2 lg:grid-cols-4">
          {reels.map((reel, i) => (
            <li
              key={reel.src}
              className="reveal-mid group relative flex flex-col bg-bg-high/40 p-2.5 ring-1 ring-border transition-all duration-300 hover:ring-brand/50"
              style={{ ['--i' as string]: i } as React.CSSProperties}
            >
              <figure className="flex flex-col h-full">
                <div className="relative aspect-[9/16] overflow-hidden bg-bg ring-1 ring-inset ring-border/50">
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
                    className="grade-live h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Floating Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 border border-brand/40 bg-void-950/80 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-widest text-brand backdrop-blur-sm">
                      <VideoIcon className="h-2.5 w-2.5" />
                      {reel.tag}
                    </span>
                  </div>
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
