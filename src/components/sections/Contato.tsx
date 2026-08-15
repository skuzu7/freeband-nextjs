// src/components/sections/Contato.tsx
// Closing section, set over a stage photograph so the page ends on the same argument it opened with.
import Image from 'next/image';
import { bandInfo, contact, pageCopy } from '@/data/content';
import { images } from '@/data/images';
import { Container } from '@/components/ui/Container';
import { NumberScrub } from '@/components/ui/NumberScrub';
import { WhatsAppCta } from '@/components/ui/WhatsAppCta';
import { Mail, Sparkles } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="h-5 w-5 fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.556-5.338 11.891-11.893 11.891a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="h-4 w-4 fill-none stroke-current stroke-2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export function Contato() {
  const copy = pageCopy.contato;

  return (
    <section id="contato" className="relative isolate py-[clamp(7rem,14vi,14rem)]">
      <div className="absolute inset-0 -z-10">
        <Image
          src={images.festa209}
          alt="Palco e energia da Internacional Freeband"
          fill
          sizes="100vw"
          quality={92}
          className="grade-live object-cover"
          style={{ objectPosition: 'center 35%' }}
        />
        <div aria-hidden className="photo-scrim absolute inset-0" />
      </div>

      <Container>
        <div className="inline-flex items-center gap-2 border border-brand/40 bg-bg-raise/80 px-3.5 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-brand backdrop-blur-sm">
          <Sparkles className="h-3 w-3" />
          {copy.eyebrowLabel}
        </div>

        <h2
          className="mt-8 max-w-4xl font-display -tracking-[0.02em] text-balance text-text"
          style={{ fontSize: 'var(--text-6xl)', lineHeight: 0.9 }}
        >
          {copy.headlinePrefix}
          <span className="serif-italic text-brand">{copy.headlineEmphasis}</span>
          {copy.headlineSuffix}
        </h2>

        <p
          className="mt-8 max-w-[56ch] text-text-muted text-pretty"
          style={{ fontSize: 'var(--text-lg)', lineHeight: 1.55 }}
        >
          {copy.lead}
        </p>

        <div className="mt-[clamp(3rem,5vi,4.5rem)]">
          <NumberScrub value={contact.phone} variant="phone" label={copy.phoneScrubLabel} />
        </div>

        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
          <WhatsAppCta href={contact.whatsappQuoteLink}>
            <WhatsAppIcon />
            {copy.whatsappCta}
          </WhatsAppCta>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-3 border border-border-strong bg-bg/70 px-5 py-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-text backdrop-blur-md transition-all hover:border-brand hover:text-brand hover:glow-gold-soft"
            >
              <InstagramIcon />
              {contact.instagram}
            </a>
            {[contact.email, contact.emailAlt].map((address) => (
              <a
                key={address}
                href={`mailto:${address}`}
                className="inline-flex min-h-11 items-center gap-3 border border-border-strong bg-bg/70 px-5 py-3 font-mono text-[0.68rem] normal-case tracking-[0.14em] text-text backdrop-blur-md transition-all hover:border-brand hover:text-brand hover:glow-gold-soft"
              >
                <Mail className="h-4 w-4 shrink-0 text-brand" />
                {address}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-[clamp(3.5rem,6vi,5rem)] flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-8 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
          <span className="flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-8 bg-brand" />
            {bandInfo.legalName}
          </span>
          <span aria-hidden>·</span>
          <span className="normal-case tracking-[0.1em]">{contact.website}</span>
        </p>
      </Container>
    </section>
  );
}
