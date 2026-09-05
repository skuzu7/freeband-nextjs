'use client';

// src/components/home/Fold.tsx
// Block 1. The stage poster is the LCP; the loop attaches on idle and never
// under reduced motion. The wordmark comes on as LED dots, then the sharp red
// acrylic appears over them — the backdrop, as the audience sees it.
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { bandInfo } from '@/data/band';
import { fold } from '@/data/copy/home';
import { heroMedia } from '@/data/media/hero';
import { blurMap } from '@/data/blur';
import { LedPanel } from '@/components/brand/LedPanel';
import { LedNumber } from '@/components/brand/LedNumber';
import { Wordmark, WORDMARK } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { WhatsAppCta } from '@/components/site/WhatsAppCta';

const WORDMARK_ASPECT = WORDMARK.viewBox.width / WORDMARK.viewBox.height;

function Backdrop() {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;
    const attach = () => {
      video.setAttribute('src', heroMedia.video);
      video.play().catch(() => {});
    };
    // Safari still has no requestIdleCallback; a short timer stands in.
    const idle = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (idle.requestIdleCallback && idle.cancelIdleCallback) {
      const id = idle.requestIdleCallback(attach, { timeout: 4000 });
      return () => idle.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(attach, 1500);
    return () => window.clearTimeout(id);
  }, [reduced]);

  return (
    <div className="fold-backdrop absolute inset-0 -z-10 will-change-transform">
      {/* The one photograph on the site that IS allowed to bleed: it is the
          stage as backdrop, under a scrim, not a picture on display. The
          `data-backdrop` flag exempts it from the smoke test's crop audit. */}
      <Image
        src={heroMedia.poster}
        alt={heroMedia.alt}
        fill
        priority
        sizes="100vw"
        quality={75}
        placeholder="blur"
        blurDataURL={blurMap[heroMedia.poster]}
        className="object-cover"
        data-backdrop
      />
      {!reduced && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          onPlaying={(e) => e.currentTarget.classList.add('is-playing')}
          className="hero-video absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div aria-hidden className="hero-scrim absolute inset-0" />
    </div>
  );
}

export function Fold() {
  const [lit, setLit] = useState(false);

  return (
    <section
      aria-labelledby="fold-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
    >
      <Backdrop />
      <Container className="relative z-10 flex flex-col gap-8 pb-10 pt-32 md:gap-10">
        <Label dot>{fold.badge}</Label>
        <h1 id="fold-title" className="sr-only">
          {bandInfo.name} — banda de baile e show desde {bandInfo.founded}
        </h1>
        <div role="img" aria-label="Freeband" className="w-full max-w-[min(100%,66rem)]">
          <LedPanel
            source={{ kind: 'wordmark' }}
            aspect={WORDMARK_ASPECT}
            cols={180}
            onLit={() => setLit(true)}
            field={false}
            dimDots={false}
            fadeWhenLit
            className="w-full"
          >
            <Wordmark
              className={cn(
                'absolute inset-[3%] h-[94%] w-[94%] text-red transition-opacity duration-700 ease-light',
                lit ? 'opacity-100' : 'opacity-0',
              )}
            />
          </LedPanel>
        </div>
        <div className="grid gap-8 md:grid-cols-[1.25fr_1fr] md:items-end">
          <div>
            <p className="text-3xl font-semibold tracking-tight text-ink">{fold.kicker}</p>
            <p className="mt-4 max-w-[52ch] text-lg text-ink-muted">{fold.lead}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <WhatsAppCta size="lg" className="flex-1 sm:flex-none">
              {fold.ctaPrimary}
            </WhatsAppCta>
            <Button variant="secondary" size="lg" href="/palco" className="flex-1 sm:flex-none">
              {fold.ctaSecondary}
            </Button>
          </div>
        </div>
      </Container>
      <Container className="relative z-10 border-t border-line py-6">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4">
          {fold.proof.map((item) => (
            <li key={item.label}>
              <LedNumber value={item.value} label={item.label} matrixClassName="h-7 md:h-8" on={lit} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
