// src/components/sections/Ato_Servicos.tsx
// The quote packages (#pacotes).
//
// Built on <Section>/<Container>/<SectionHeadline> like every other act, so
// it inherits the token type scale, the mono eyebrow and the section padding
// rhythm instead of redefining them with raw Tailwind. `ink-raise` is what
// keeps it off the same background as the gallery that follows it.
//
// No hooks or handlers here — this stays a server component and the reveals
// run on the CSS-only .reveal-* classes.
import { contact, pageCopy, servicePackages } from '@/data/content';
import { Check, Star, Crown } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { cn } from '@/lib/cn';

// Icons stay in the component (they're React components, not copy); the
// package data itself lives in src/data/content.ts.
const packageIcons: Record<string, typeof Crown> = {
  premium: Crown,
  classic: Star,
};

export function Ato_Servicos() {
  const copy = pageCopy.pacotes;

  return (
    <Section id="pacotes" variant="ink-raise" pad="xl" className="overflow-hidden">
      <Container>
        <SectionHeadline
          eyebrowLabel={copy.eyebrow}
          prefix={copy.headlinePrefix}
          emphasis={copy.headlineEmphasis}
          suffix={copy.headlineSuffix}
          lead={copy.lead}
        />

        <div className="mt-[clamp(3rem,5vi,5rem)] grid max-w-5xl gap-6 sm:grid-cols-2">
          {servicePackages.map((pkg, pIdx) => {
            const Icon = packageIcons[pkg.id] ?? Star;
            return (
              <article
                key={pkg.id}
                style={{ ['--i' as string]: pIdx } as React.CSSProperties}
                className={cn(
                  'reveal-mid group relative flex flex-col border bg-bg-high p-[clamp(1.5rem,2.5vi,2.5rem)] transition-colors duration-500',
                  pkg.highlighted
                    ? 'border-brand/50 glow-gold-soft'
                    : 'border-border hover:border-brand',
                )}
              >
                {pkg.highlighted && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gold/20 blur-3xl"
                  />
                )}

                <div className="flex items-center justify-between gap-4">
                  <h3
                    className={cn(
                      'font-mono uppercase tracking-[0.3em]',
                      pkg.highlighted ? 'text-brand' : 'text-text',
                    )}
                    style={{ fontSize: '0.72rem' }}
                  >
                    {pkg.name}
                  </h3>
                  {pkg.highlighted && (
                    <span className="border border-brand/40 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.28em] text-brand">
                      {copy.highlightBadge}
                    </span>
                  )}
                </div>

                <Icon
                  aria-hidden
                  className={cn('mt-6 h-8 w-8', pkg.highlighted ? 'text-brand' : 'text-text-muted')}
                />

                <p
                  className="mt-4 text-text-muted text-pretty"
                  style={{ fontSize: 'var(--text-base)', lineHeight: 1.65 }}
                >
                  {pkg.description}
                </p>

                {/* flex-1 so the shorter package's CTA still lands on the card
                    floor — the grid stretches both cards to equal height. */}
                <ul className="mt-8 flex flex-1 flex-col gap-3 border-t border-border pt-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        aria-hidden
                        className={cn(
                          'mt-[0.15em] h-4 w-4 flex-none',
                          pkg.highlighted ? 'text-brand' : 'text-text-muted',
                        )}
                      />
                      <span className="font-sans text-[0.85rem] leading-[1.55] text-text-muted">
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
      </Container>
    </Section>
  );
}
