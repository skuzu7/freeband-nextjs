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

      {/* Bottom left logo */}
      <div className="absolute bottom-8 left-8 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
        <span className="font-display text-lg font-bold text-white">N</span>
      </div>

      {/* Bottom center indicator */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">
        <span className="text-[#C59E57] text-xl">↓</span>
      </div>

      {/* Center Hero Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4 pt-16">

        <div className="mb-6 inline-block border border-[#C59E57] px-4 py-1">
          <span className="font-sans text-xs font-bold tracking-[0.3em] text-[#C59E57] uppercase">
            {copy.eyebrow}
          </span>
        </div>

        <h1 className="flex flex-col items-center leading-[0.9]">
          <span className="font-display text-[clamp(2.5rem,6vw,5rem)] font-bold text-white">
            {copy.wordmarkPre}
          </span>
          <span className="font-display text-[clamp(3.5rem,8vw,7rem)] font-bold text-[#C59E57]">
            {copy.wordmarkMain}
          </span>
        </h1>

        <p className="mt-8 font-sans text-[clamp(0.7rem,1.5vw,0.9rem)] font-medium tracking-[0.4em] text-[#e0e0e0] max-w-2xl text-balance">
          {copy.leadParagraph}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#C59E57] px-6 py-3 font-sans text-xs font-bold tracking-widest text-white transition-colors hover:bg-[#b08b47]"
          >
            {copy.ctaPrimary}
          </a>
          <a
            href="#servicos"
            className="border border-[#C59E57] bg-transparent px-6 py-3 font-sans text-xs font-bold tracking-widest text-white transition-colors hover:bg-[#C59E57]/10"
          >
            {copy.ctaSecondary}
          </a>
        </div>

        <div className="mt-2 flex items-center gap-4 border-t border-white/10 pt-6 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-white/50 w-full max-w-2xl justify-between">
          <span>{copy.statusLabel}</span>
          <span aria-hidden className="ml-auto hidden text-white/50 md:inline">
            CNPJ {bandInfo.cnpj}
          </span>
        </div>
      </div>
    </section>
  );
}
