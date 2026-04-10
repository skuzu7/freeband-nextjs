import { bandInfo } from "@/data/content";

export function Hero() {
  return (
    <section className="relative flex h-screen min-h-[640px] items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster="/images/hero-poster.jpeg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(10,10,10,0.35)_0%,rgba(10,10,10,0.7)_55%,rgba(10,10,10,1)_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mb-8 inline-block border border-gold px-5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-gold">
          Desde {bandInfo.founded}
        </div>

        <h1 className="mb-6 font-display font-bold leading-[1.05]">
          <span className="block text-4xl uppercase tracking-wider text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Internacional
          </span>
          <span className="block text-5xl uppercase tracking-wider text-gold sm:text-6xl md:text-7xl lg:text-8xl">
            Freeband
          </span>
        </h1>

        <p className="mb-10 text-sm uppercase tracking-[0.25em] text-text-2 sm:text-base">
          {bandInfo.tagline}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#contato"
            className="inline-block bg-gold px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-bg transition-colors hover:bg-gold-light"
          >
            Agendar Show
          </a>
          <a
            href="/portfolio"
            className="inline-block border border-gold px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-bg"
          >
            Ver Portfólio
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-arrow text-2xl text-gold"
        aria-hidden="true"
      >
        &darr;
      </div>
    </section>
  );
}
