// src/components/sections/Hero.tsx
// Full-bleed stage photograph carrying the fold, in colour.
//
// The previous hero buried its photo at 20% opacity behind a stack of drifting
// gradients and a scanline overlay, then wrote "A Experiência Definitiva" over
// it — a fold that could have belonged to any events company. Here the picture
// is the fold, and the type says which band this is, since when, and what it
// actually plays.
import Image from 'next/image';
import { contact, pageCopy } from '@/data/content';
import { images } from '@/data/images';
import { WhatsAppCta } from '@/components/ui/WhatsAppCta';

export function Hero() {
  const copy = pageCopy.hero;

  return (
    <section id="hero" className="relative isolate flex min-h-[100svh] flex-col">
      {/* The photograph. festa-308 is the highest-resolution frame in the
          archive (2560px) and the only one that survives a full-bleed crop. */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={images.festa308}
          alt="Vocalista da Internacional Freeband de braços erguidos diante do painel de LED durante um show"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="grade-live object-cover"
          style={{ objectPosition: 'center 38%' }}
        />
        <div aria-hidden className="photo-scrim absolute inset-0" />
      </div>

      <div className="max-w-container px-section mx-auto flex w-full flex-1 flex-col justify-end pb-[clamp(3rem,7vi,6rem)] pt-32">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-brand">
          {copy.badge}
        </p>

        <h1 className="mt-6 flex flex-col leading-[0.82]">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.42em] text-text-muted">
            {copy.wordmarkSub}
          </span>
          <span
            className="font-display font-semibold -tracking-[0.03em] text-text"
            style={{ fontSize: 'var(--text-6xl)' }}
          >
            {copy.wordmarkMain}
          </span>
        </h1>

        <p
          className="mt-6 font-display italic text-brand"
          style={{ fontSize: 'var(--text-xl)' }}
        >
          {copy.kicker}
        </p>

        <p
          className="mt-6 max-w-[52ch] text-text-muted text-pretty"
          style={{ fontSize: 'var(--text-base)', lineHeight: 1.65 }}
        >
          {copy.leadParagraph}
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <WhatsAppCta href={contact.whatsappLink}>{copy.ctaPrimary}</WhatsAppCta>
          <a
            href="#arquivo"
            className="inline-flex min-h-11 items-center justify-center border border-border-strong px-8 py-4 font-sans text-sm font-bold tracking-widest text-text transition-colors hover:border-brand hover:text-brand"
          >
            {copy.ctaSecondary}
          </a>
        </div>
      </div>

      {/* Credential strip — the numbers a buyer weighs, before any prose. */}
      <div className="border-t border-border bg-bg/80 backdrop-blur-sm">
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
