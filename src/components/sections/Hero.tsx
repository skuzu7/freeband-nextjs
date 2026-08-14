// src/components/sections/Hero.tsx
// Full-bleed stage photograph carrying the fold, in colour.
import Image from 'next/image';
import { contact, pageCopy } from '@/data/content';
import { images } from '@/data/images';
import { WhatsAppCta } from '@/components/ui/WhatsAppCta';
import { Wordmark } from '@/components/ui/Wordmark';

export function Hero() {
  const copy = pageCopy.hero;

  return (
    <section id="hero" className="relative isolate flex min-h-[100svh] flex-col">
      {/* Background stage photograph */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={images.palcoBandaCompleta}
          alt="Banda completa da Internacional Freeband no palco com bailarinos, painel de LED e luz cênica"
          fill
          priority
          sizes="100vw"
          quality={92}
          className="grade-live object-cover"
          style={{ objectPosition: 'center 45%' }}
        />
        <div aria-hidden className="photo-scrim absolute inset-0" />
      </div>

      <div className="max-w-container px-section mx-auto flex w-full flex-1 flex-col justify-end pb-[clamp(3rem,7vi,6rem)] pt-32">
        {/* Live Badge */}
        <div className="inline-flex w-fit items-center gap-2.5 border border-brand/40 bg-bg-raise/80 px-3.5 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
          </span>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-brand">
            {copy.badge}
          </p>
        </div>

        {/* Wordmark and Headline */}
        <h1 className="mt-6 flex max-w-4xl flex-col gap-3">
          <span className="flex items-center gap-4">
            <span className="font-mono text-[0.7rem] uppercase leading-none tracking-[0.42em] text-text-muted">
              {copy.wordmarkSub}
            </span>
            <span aria-hidden className="h-px flex-1 bg-logo-red/50" />
          </span>
          <Wordmark
            className="h-[clamp(3.2rem,12vi,8rem)] w-auto self-start text-logo-red drop-shadow-[0_0_35px_rgba(238,53,36,0.3)]"
            title={`${copy.wordmarkSub} ${copy.wordmarkMain}`}
          />
        </h1>

        <p
          className="mt-6 font-display italic text-brand"
          style={{ fontSize: 'var(--text-xl)' }}
        >
          {copy.kicker}
        </p>

        <p
          className="mt-6 max-w-[54ch] text-text-muted text-pretty"
          style={{ fontSize: 'var(--text-base)', lineHeight: 1.65 }}
        >
          {copy.leadParagraph}
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <WhatsAppCta href={contact.whatsappQuoteLink}>
            {copy.ctaPrimary}
          </WhatsAppCta>
          <a
            href="#palco"
            className="inline-flex min-h-11 items-center justify-center border border-border-strong bg-bg/40 px-8 py-4 font-sans text-sm font-bold tracking-widest text-text backdrop-blur-sm transition-all hover:border-brand hover:text-brand hover:bg-bg/80"
          >
            Ver o Palco & Fotos
          </a>
        </div>
      </div>

      {/* Credential strip */}
      <div className="border-t border-border bg-bg/85 backdrop-blur-md">
        <dl className="max-w-container px-section mx-auto grid w-full grid-cols-2 gap-x-8 gap-y-6 py-8 sm:grid-cols-4">
          {copy.proof.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <dt className="sr-only">{item.label}</dt>
              <dd
                className="font-display font-semibold -tracking-[0.03em] text-text"
                style={{ fontSize: 'var(--text-3xl)', lineHeight: 1 }}
              >
                {item.value}
              </dd>
              <span
                aria-hidden
                className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted"
              >
                {item.label}
              </span>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
