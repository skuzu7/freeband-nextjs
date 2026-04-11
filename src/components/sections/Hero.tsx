// src/components/sections/Hero.tsx
// PALCO II — cinematic Hero.
// Changes from v1:
//   - Single primary CTA (removed the secondary serif-link)
//   - MagneticField wraps the KineticWord wordmark
//   - Button uses magnetic + ripple micro-interactions
//   - Tagline is the official brochure slogan in .text-kinetic-paragraph
//   - Video carries the .grade-cinema filter chain
//   - SpotlightCursor removed from Hero (relocated to Ato IV in Phase 4)
import { bandInfo, contact } from "@/data/content";
import { KineticWord } from "@/components/ui/KineticWord";
import { StageBeams } from "@/components/ui/StageBeams";
import { MagneticField } from "@/components/ui/MagneticField";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-bg"
    >
      {/* Atmosphere video with cinematic grade */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.jpeg"
        className="grade-cinema absolute inset-0 -z-20 h-full w-full object-cover opacity-45"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Vignette fade for cinematic falloff */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(10%_0.02_300_/_0.55)_65%,oklch(10%_0.02_300_/_0.92)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950"
      />

      <StageBeams />

      {/* Top meta row */}
      <div className="relative z-10 mt-[clamp(6rem,12vi,9rem)] flex w-full flex-col gap-4 px-[clamp(1.25rem,4vw,3.5rem)] font-mono text-[0.7rem] uppercase tracking-[0.3em] text-text-muted md:flex-row md:items-center md:justify-between">
        <span className="flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-10 bg-brand" />
          <span className="text-brand">Est. {bandInfo.founded}</span>
          <span className="hidden md:inline">
            · {bandInfo.yearsActive} anos no palco
          </span>
        </span>
        <span className="hidden md:inline">
          {bandInfo.location} · São Paulo · Brasil
        </span>
      </div>

      {/* Main content pinned to bottom-left */}
      <div className="relative z-10 mt-auto flex w-full flex-col gap-8 px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(3rem,6vi,6rem)]">
        <h1 className="flex flex-col gap-2 leading-[0.82]">
          <span className="reveal-hero font-sans text-[clamp(0.95rem,0.85rem+0.5vi,1.2rem)] uppercase tracking-[0.35em] text-text-muted">
            Internacional
          </span>
          <MagneticField strength={16}>
            <KineticWord>freeband</KineticWord>
          </MagneticField>
        </h1>

        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <p
            className="reveal-hero text-kinetic-paragraph max-w-[48ch] text-text-muted text-pretty"
            style={{ fontSize: "var(--text-lg)", lineHeight: 1.5 }}
          >
            {bandInfo.tagline}. Réveillon, formatura, casamento, show
            municipal — mais de meio século dividindo o mesmo pulso com o
            Brasil.
          </p>

          <Button
            as="a"
            variant="primary"
            magnetic
            ripple
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener"
          >
            Agendar show
            <span aria-hidden>→</span>
          </Button>
        </div>

        <div className="mt-2 flex items-center gap-4 border-t border-border pt-6 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand" />
          <span>Scroll</span>
          <span aria-hidden className="ml-auto hidden text-text-muted md:inline">
            CNPJ {bandInfo.cnpj}
          </span>
        </div>
      </div>
    </section>
  );
}
