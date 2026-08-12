// src/components/sections/Pacotes.tsx
// The whole commercial argument in one section.
//
// This used to be split in two — #pacotes (the two packages) and #servicos
// (the event formats plus "o que está incluso") — separated on the page by the
// gallery and a marquee, so a buyer met the price, forgot it, and rediscovered
// the offer four thousand pixels later. One of them was titled "Serviços
// Premium" while the nav's SERVIÇOS entry pointed at the other. Merged.
import { contact, includedFeatures, pageCopy, services, servicePackages } from '@/data/content';
import { Check, Crown, Star } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { cn } from '@/lib/cn';

const packageIcons: Record<string, typeof Crown> = {
  premium: Crown,
  classic: Star,
};

export function Pacotes() {
  const copy = pageCopy.pacotes;

  return (
    <Section id="pacotes" variant="ink-raise" pad="xl" className="overflow-hidden">
      <Container>
        <SectionHeadline
          eyebrowNumber={copy.eyebrowNumber}
          eyebrowLabel={copy.eyebrowLabel}
          prefix={copy.headlinePrefix}
          emphasis={copy.headlineEmphasis}
          suffix={copy.headlineSuffix}
          lead={copy.lead}
        />

        {/* Formats — three lines, not three cards. They are a qualifier for the
            packages below, not a competing offer. */}
        <div className="mt-[clamp(2.5rem,5vi,4rem)]">
          <Eyebrow tone="mono">{copy.formatsEyebrow}</Eyebrow>
          <ul className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-3">
            {services.map((service, i) => (
              <li
                key={service.title}
                className="reveal-mid flex flex-col gap-2 bg-bg-raise p-6"
                style={{ ['--i' as string]: i } as React.CSSProperties}
              >
                <div className="flex items-baseline gap-3">
                  <span aria-hidden className="font-display text-brand">
                    {service.icon}
                  </span>
                  <h3
                    className="font-display -tracking-[0.01em] text-text"
                    style={{ fontSize: 'var(--text-lg)', lineHeight: 1.15 }}
                  >
                    {service.title}
                  </h3>
                </div>
                <p className="text-[0.85rem] leading-[1.55] text-text-muted text-pretty">
                  {service.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* The two packages */}
        <div className="mt-[clamp(3rem,5vi,4.5rem)] grid gap-6 lg:grid-cols-2">
          {servicePackages.map((pkg, i) => {
            const Icon = packageIcons[pkg.id] ?? Star;
            return (
              <article
                key={pkg.id}
                style={{ ['--i' as string]: i } as React.CSSProperties}
                className={cn(
                  'reveal-mid relative flex flex-col border bg-bg-high p-[clamp(1.5rem,2.5vi,2.5rem)] transition-colors duration-500',
                  pkg.highlighted
                    ? 'border-brand/50 glow-gold-soft'
                    : 'border-border hover:border-brand',
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Icon
                      aria-hidden
                      className={cn('h-5 w-5', pkg.highlighted ? 'text-brand' : 'text-text-muted')}
                    />
                    <h3
                      className={cn(
                        'font-mono text-[0.72rem] uppercase tracking-[0.3em]',
                        pkg.highlighted ? 'text-brand' : 'text-text',
                      )}
                    >
                      {pkg.name}
                    </h3>
                  </div>
                  {pkg.highlighted && (
                    <span className="shrink-0 border border-brand/40 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-brand">
                      {copy.highlightBadge}
                    </span>
                  )}
                </div>

                <p
                  className="mt-5 text-text-muted text-pretty"
                  style={{ fontSize: 'var(--text-base)', lineHeight: 1.6 }}
                >
                  {pkg.description}
                </p>

                {/* Two columns so the nine-item package fills its card instead
                    of running as one thin ribbon of text. */}
                <ul className="mt-7 grid flex-1 gap-x-6 gap-y-3 border-t border-border pt-6 sm:grid-cols-2">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        aria-hidden
                        className={cn(
                          'mt-[0.2em] h-3.5 w-3.5 flex-none',
                          pkg.highlighted ? 'text-brand' : 'text-text-muted',
                        )}
                      />
                      <span className="text-[0.82rem] leading-[1.5] text-text-muted text-pretty">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`${contact.whatsappLink}?text=${encodeURIComponent(`${copy.whatsappMessage} ${pkg.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'mt-8 flex min-h-11 items-center justify-center px-4 py-3 text-center font-sans text-sm font-bold tracking-widest transition-colors',
                    pkg.highlighted
                      ? 'bg-gold text-void-950 hover:bg-gold-light'
                      : 'border border-border-strong text-text hover:border-brand hover:text-brand',
                  )}
                >
                  {copy.ctaLabel}
                </a>
              </article>
            );
          })}
        </div>

        {/* What ships with either package */}
        <ul className="mt-[clamp(3rem,5vi,4.5rem)] grid gap-5 border-t border-border pt-[clamp(2.5rem,4vi,3.5rem)] sm:grid-cols-2 lg:grid-cols-3">
          {includedFeatures.map((feature, i) => (
            <li
              key={feature.title}
              className="reveal-mid flex flex-col gap-4 border border-border p-6"
              style={{ ['--i' as string]: i % 3 } as React.CSSProperties}
            >
              <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                <h3
                  className="font-display -tracking-[0.01em] text-text text-balance"
                  style={{ fontSize: 'var(--text-lg)', lineHeight: 1.15 }}
                >
                  {feature.title}
                </h3>
                <span
                  className={cn(
                    'shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.26em]',
                    feature.optional ? 'text-brand' : 'text-text-muted',
                  )}
                >
                  {feature.optional ? 'opcional' : String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-[0.45em] inline-block h-1 w-1 shrink-0 rotate-45 bg-brand"
                    />
                    <span className="text-[0.82rem] leading-[1.55] text-text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
