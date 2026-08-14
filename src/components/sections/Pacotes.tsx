// src/components/sections/Pacotes.tsx
// The whole commercial argument in one section.
import { contact, includedFeatures, pageCopy, services, servicePackages } from '@/data/content';
import { estrutura } from '@/data/images';
import { Check, Crown, Star, Sparkles, MessageCircle } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { CinematicImage } from '@/components/ui/CinematicImage';
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

        {/* Formats */}
        <div className="mt-[clamp(2.5rem,5vi,4rem)]">
          <Eyebrow tone="mono">{copy.formatsEyebrow}</Eyebrow>
          <ul className="mt-5 grid gap-px border border-border bg-border sm:grid-cols-3">
            {services.map((service, i) => (
              <li
                key={service.title}
                className="reveal-mid flex flex-col gap-2 bg-bg-raise p-6 transition-colors hover:bg-bg-high"
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
                  'reveal-mid relative flex flex-col border bg-bg-high p-[clamp(1.5rem,2.5vi,2.5rem)] transition-all duration-500',
                  pkg.highlighted
                    ? 'border-brand/70 glow-gold-soft ring-1 ring-brand/30'
                    : 'border-border hover:border-brand/60',
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
                        'font-mono text-[0.75rem] uppercase tracking-[0.3em]',
                        pkg.highlighted ? 'text-brand font-bold' : 'text-text',
                      )}
                    >
                      {pkg.name}
                    </h3>
                  </div>
                  {pkg.highlighted && (
                    <span className="shrink-0 flex items-center gap-1.5 border border-brand bg-brand/10 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-brand">
                      <Sparkles className="h-3 w-3" />
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

                {/* Features Checklist */}
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
                    'mt-8 flex min-h-11 items-center justify-center gap-2 px-4 py-3.5 text-center font-sans text-sm font-bold tracking-widest transition-all duration-300',
                    pkg.highlighted
                      ? 'bg-gold text-void-950 hover:bg-gold-light hover:glow-gold'
                      : 'border border-border-strong text-text hover:border-brand hover:text-brand hover:bg-bg-raise',
                  )}
                >
                  <MessageCircle className="h-4 w-4" />
                  {copy.ctaLabel}
                </a>
              </article>
            );
          })}
        </div>

        {/* The mounted rig: photographic proof */}
        <div className="mt-[clamp(3rem,5vi,4.5rem)] border-t border-border pt-[clamp(2.5rem,4vi,3.5rem)]">
          <Eyebrow tone="mono">{copy.estruturaEyebrow}</Eyebrow>
          <p className="mt-4 max-w-[54ch] text-text-muted" style={{ fontSize: 'var(--text-base)' }}>
            {copy.estruturaLead}
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-[clamp(0.75rem,2vi,1.5rem)] sm:grid-cols-[16fr_16fr_9fr]">
            {estrutura.map((shot, i) => (
              <li
                key={shot.src}
                className="reveal-mid group"
                style={{ ['--i' as string]: i } as React.CSSProperties}
              >
                <figure>
                  <div className="overflow-hidden">
                    <CinematicImage
                      src={shot.src}
                      alt={shot.alt}
                      grade="live"
                      aspect={shot.aspect}
                      fill
                      sizes={i < 2 ? '(min-width: 640px) 36vw, 100vw' : '(min-width: 640px) 21vw, 100vw'}
                      quality={90}
                      wrapperClassName="ring-1 ring-inset ring-border transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-text-muted">
                    <span aria-hidden className="inline-block h-px w-4 shrink-0 bg-brand" />
                    {shot.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>

        {/* What ships with either package */}
        <ul className="mt-[clamp(3rem,5vi,4.5rem)] grid gap-5 border-t border-border pt-[clamp(2.5rem,4vi,3.5rem)] sm:grid-cols-2 lg:grid-cols-3">
          {includedFeatures.map((feature, i) => (
            <li
              key={feature.title}
              className="reveal-mid flex flex-col gap-4 border border-border bg-bg-raise/40 p-6"
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
