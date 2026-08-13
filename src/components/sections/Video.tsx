'use client';

// src/components/sections/Video.tsx
// Four silent clips from the band's own shows, looping in a row.
//
// Photographs prove the structure exists. Only moving pictures prove the rig
// does something and the floor fills up — so the clips run muted, in-frame,
// and start themselves when the section scrolls into view.
//
// Three rules the implementation exists to satisfy:
//   1. Nothing downloads until it is nearly on screen (`preload="none"` plus an
//      IntersectionObserver that only then assigns the source). Four clips are
//      4 MB; a landing page cannot spend that on arrival.
//   2. WCAG 2.2.2 — motion that auto-starts and runs past five seconds needs a
//      way to stop it. One control pauses all four.
//   3. `prefers-reduced-motion` never autoplays: the poster frame stands in
//      until the visitor presses play.
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
  // Starts paused and flips to playing on the first intersection, so the
  // reduced-motion branch (which never flips it) shows the right label.
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
            // Attach the source the first time the clip comes close.
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
            className="inline-flex min-h-11 items-center gap-3 border border-border-strong px-5 py-3 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-text transition-colors hover:border-brand hover:text-brand"
          >
            {playing ? (
              <Pause aria-hidden className="h-3.5 w-3.5" />
            ) : (
              <Play aria-hidden className="h-3.5 w-3.5" />
            )}
            {playing ? copy.pauseLabel : copy.playLabel}
          </button>
        </div>

        <ul className="mt-[clamp(2.5rem,5vi,4rem)] grid grid-cols-2 gap-[clamp(0.75rem,2vi,1.5rem)] lg:grid-cols-4">
          {reels.map((reel, i) => (
            <li
              key={reel.src}
              className="reveal-mid"
              style={{ ['--i' as string]: i } as React.CSSProperties}
            >
              <figure>
                <div className="relative aspect-[9/16] overflow-hidden bg-bg ring-1 ring-inset ring-border">
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
                    className="grade-live h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-3 flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-text-muted">
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
