// src/components/sections/Hero.tsx
// PALCO II — dark cinematic Hero with glitch wordmark, stage beams, scanlines.
import { bandInfo, contact, pageCopy } from '@/data/content';
import { StageBeams } from '@/components/ui/StageBeams';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const copy = pageCopy.hero;
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-void-950"
    >
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.jpeg"
        className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay with subtle blur */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[oklch(6%_0.015_270/0.7)] backdrop-blur-sm"
      />

      {/* Stage beams — activated! */}
      <StageBeams />

      {/* Scanlines */}
      <div aria-hidden className="scanlines absolute inset-0 z-[5] pointer-events-none" />

      {/* Top meta row */}
      <div className="px-section relative z-10 mt-[clamp(6rem,12vi,9rem)] flex w-full flex-col gap-4 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-text-muted md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-10 bg-brand" />
          <span className="text-brand">Desde {bandInfo.founded}</span>
          <span className="hidden md:inline">· {bandInfo.yearsActive} anos no palco</span>
        </span>
        <span className="hidden md:inline text-text-low">
          {bandInfo.foundedCity} · Jaú · Trabiju · Brasil
        </span>
      </div>

      <div className="max-w-container relative z-10 mx-auto mt-auto flex w-full flex-col gap-8 px-section pb-[clamp(3rem,6vi,6rem)]">
        <div className="flex flex-col gap-6">
          <span className="reveal-hero font-mono text-[0.65rem] uppercase tracking-[0.5em] text-brand">
            {copy.eyebrow}
          </span>
          <h1 className="flex flex-col leading-none">
            <span className="font-sans text-[clamp(0.7rem,0.65rem+0.4vi,0.9rem)] uppercase tracking-[0.3em] text-brand/80 mb-2">
              {copy.wordmarkPre}
            </span>
            <div className="relative">
              <span
                className="glitch-text font-display text-[clamp(3.5rem,10vw,10rem)] font-black italic tracking-tighter text-white"
                data-text={copy.wordmarkMain}
                style={{ fontVariationSettings: '"wght" 900, "opsz" 144, "SOFT" 100' }}
              >
                {copy.wordmarkMain}
              </span>
              <div className="absolute -inset-x-4 -inset-y-2 bg-brand/10 blur-3xl rounded-full mix-blend-overlay pointer-events-none -z-10" />
            </div>
            <span className="mt-2 font-sans text-[clamp(0.65rem,1.2vw,1rem)] font-bold tracking-[0.4em] md:tracking-[0.6em] text-wordmark-blue/90 uppercase">
              {copy.wordmarkSub}
            </span>
          </h1>
        </div>

        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-12">
          <div className="flex flex-col gap-6">
            <p
              className="reveal-hero text-text max-w-[48ch] text-pretty font-semibold text-fluid-xl"
              style={{ lineHeight: 1.2 }}
            >
              {bandInfo.tagline}.
            </p>
            <p
              className="reveal-hero text-text-muted max-w-[54ch] text-pretty text-fluid-base"
              style={{ lineHeight: 1.6 }}
            >
              {copy.leadParagraph}
            </p>
          </div>

          <Button
            as="a"
            variant="primary"
            magnetic
            ripple
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener"
            className="self-start md:mt-2 md:shrink-0"
          >
            {copy.ctaLabel}
            <span aria-hidden>→</span>
          </Button>
        </div>

        <div className="mt-2 flex items-center gap-4 border-t border-border pt-6 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-low">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand" />
          <span>{copy.statusLabel}</span>
          <span aria-hidden className="ml-auto hidden text-text-low md:inline">
            CNPJ {bandInfo.cnpj}
          </span>
        </div>

        <div className="spectrum-bar w-full" aria-hidden />
      </div>
    </section>
  );
}
