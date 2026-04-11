import { bandInfo } from "@/data/content";
import { KineticWord } from "@/components/ui/KineticWord";
import { StageBeams } from "@/components/ui/StageBeams";
import { SpotlightCursor } from "@/components/ui/SpotlightCursor";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden bg-bg"
    >
      {/* Atmosphere video */}
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
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/60 via-ink-950/80 to-ink-950"
      />

      <StageBeams />
      <SpotlightCursor />

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
          Trabiju · São Paulo · Brasil
        </span>
      </div>

      {/* Main content pinned to bottom-left */}
      <div className="relative z-10 mt-auto flex w-full flex-col gap-8 px-[clamp(1.25rem,4vw,3.5rem)] pb-[clamp(3rem,6vi,6rem)]">
        <h1 className="flex flex-col gap-2 leading-[0.82]">
          <span className="font-sans text-[clamp(0.95rem,0.85rem+0.5vi,1.2rem)] uppercase tracking-[0.35em] text-text-muted">
            Internacional
          </span>
          <KineticWord>freeband</KineticWord>
        </h1>

        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <p
            className="max-w-[44ch] text-text-muted text-pretty"
            style={{ fontSize: "var(--text-lg)" }}
          >
            Uma banda feita no palco. Réveillon, formatura, casamento, show
            municipal — cinquenta e seis anos dividindo o mesmo pulso com o
            Brasil.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#contato"
              className="group inline-flex items-center justify-center gap-3 bg-brand px-8 py-5 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-ink-950 transition-colors hover:bg-brand-hot"
            >
              Agendar show
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#historia"
              className="serif-italic inline-flex items-center justify-center gap-3 text-text underline decoration-brand decoration-2 underline-offset-[6px] transition-colors hover:text-brand"
              style={{ fontSize: "var(--text-lg)" }}
            >
              56 anos de palco
            </a>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 border-t border-border pt-6 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-brand" />
          <span>Scroll</span>
          <span aria-hidden className="ml-auto hidden text-text-muted md:inline">
            {bandInfo.location}
          </span>
        </div>
      </div>
    </section>
  );
}
