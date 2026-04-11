"use client";

import { bandInfo } from "@/data/content";

export function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover scale-105"
          poster="/images/hero-poster.jpeg"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
        <div className="inline-block border border-gold/40 px-6 py-2 mb-8 animate-[fadeIn_1s_ease-out]">
          <span className="text-[0.7rem] font-bold uppercase tracking-[0.4em] text-gold">
            Desde {bandInfo.founded}
          </span>
        </div>

        <h1 className="mb-6 flex flex-col items-center">
          <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white opacity-90 leading-none">
            Internacional
          </span>
          <span className="text-gradient-gold text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mt-2">
            Freeband
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base uppercase tracking-[0.3em] text-text-muted mb-12">
          {bandInfo.tagline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contato"
            className="group relative px-12 py-5 bg-gold text-bg font-bold uppercase tracking-[0.2em] text-sm overflow-hidden transition-all hover:bg-gold-light w-full sm:w-auto"
          >
            Agendar Show
          </a>
          <a
            href="#galeria"
            className="group px-12 py-5 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-sm transition-all hover:bg-white/10 w-full sm:w-auto"
          >
            Ver Galeria
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gold/60">Scroll</span>
        <div className="h-12 w-[1px] bg-gradient-to-b from-gold/60 to-transparent" />
      </div>
    </section>
  );
}
