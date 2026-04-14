// src/components/sections/AtoIV_Eventos.tsx
// PALCO II — Ato IV: renamed from Servicos.
// Three service cards in a horizontal scroll-snap stack (<SnapProgress>
// indicator below) + the rich "O que está incluso" grid wrapped in
// <SpotlightCursor> so the radial gradient follows the cursor across
// the feature cards — contextual, not decorative.
'use client';

import { useRef } from 'react';
import { services, includedFeatures, pageCopy } from '@/data/content';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { SnapProgress } from '@/components/ui/SnapProgress';
import { SpotlightCursor } from '@/components/ui/SpotlightCursor';

export function AtoIV_Eventos() {
  const snapRef = useRef<HTMLDivElement | null>(null);

  return (
    <Section id="servicos" variant="mesh" pad="xl" className="overflow-hidden">
      <Container>
        <SectionHeadline
          eyebrowNumber={pageCopy.atoIV.eyebrowNumber}
          eyebrowLabel={pageCopy.atoIV.eyebrowLabel}
          prefix={pageCopy.atoIV.headlinePrefix}
          emphasis={pageCopy.atoIV.headlineEmphasis}
          suffix={pageCopy.atoIV.headlineSuffix}
          lead={pageCopy.atoIV.lead}
        />
      </Container>

      {/* ≥lg: static 3-column grid (services.length === 3 — no empty
          whitespace on wide desktops). <lg: scroll-snap runway with
          SnapProgress. Switch is driven by `data-static-lg` via globals.css. */}
      <div
        ref={snapRef}
        data-static-lg
        className="h-snap reveal-mid px-section mt-[clamp(3rem,5vi,5rem)] pb-10 lg:gap-8"
        style={{ ['--static-lg-cols' as string]: services.length } as React.CSSProperties}
        tabIndex={0}
        role="region"
        aria-label="Tipos de evento atendidos"
      >
        {services.map((service, i) => (
          <article
            key={service.title}
            className="group relative flex h-full flex-col justify-between gap-10 border border-border bg-bg-raise p-[clamp(1.5rem,2.5vi,2.5rem)] transition-colors duration-500 hover:border-brand"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--color-brand)_10%,transparent),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />

            <div className="flex items-start justify-between">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.3em] text-brand">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                aria-hidden
                className="font-display text-brand"
                style={{ fontSize: 'var(--text-4xl)', lineHeight: 1 }}
              >
                {service.icon}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <h3
                className="font-display -tracking-[0.02em] text-text text-balance"
                style={{ fontSize: 'var(--text-3xl)', lineHeight: 0.95 }}
              >
                {service.title}
              </h3>
              <p
                className="text-text-muted text-pretty"
                style={{
                  fontSize: 'var(--text-base)',
                  lineHeight: 1.65,
                }}
              >
                {service.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      <Container>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 lg:hidden">
          <SnapProgress
            targetRef={snapRef}
            count={services.length}
            labels={services.map((s) => s.title.split(' ')[0] ?? s.title)}
          />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
            {pageCopy.atoIV.dragHint}
          </span>
        </div>
      </Container>

      <Container>
        <div className="mt-[clamp(4rem,6vi,6rem)] grid gap-10 border-t border-border pt-[clamp(3rem,5vi,5rem)] lg:grid-cols-[minmax(0,1fr)_1.6fr] lg:gap-16">
          <div className="reveal-mid flex flex-col gap-6">
            <Eyebrow>{pageCopy.atoIV.includedEyebrow}</Eyebrow>
            <h3
              className="font-display -tracking-[0.02em] text-balance"
              style={{ fontSize: 'var(--text-4xl)', lineHeight: 0.95 }}
            >
              {pageCopy.atoIV.includedHeadlinePrefix}
              <span className="serif-italic text-brand">
                {pageCopy.atoIV.includedHeadlineEmphasis}
              </span>
              {pageCopy.atoIV.includedHeadlineSuffix}
            </h3>
            <p className="max-w-[48ch] text-text-muted" style={{ fontSize: 'var(--text-base)' }}>
              {pageCopy.atoIV.includedLead}
            </p>
          </div>

          <div className="relative isolate">
            <SpotlightCursor />
            <ul className="relative z-[2] grid gap-5 sm:grid-cols-2">
              {includedFeatures.map((feature, i) => (
                <li
                  key={feature.title}
                  className="reveal-mid flex flex-col gap-4 border border-border bg-bg-raise p-6 transition-colors hover:border-brand"
                  style={{ ['--i' as string]: i } as React.CSSProperties}
                >
                  <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                    <h4
                      className="font-display text-text -tracking-[0.01em] text-balance"
                      style={{ fontSize: 'var(--text-lg)', lineHeight: 1.15 }}
                    >
                      {feature.title}
                    </h4>
                    {feature.optional ? (
                      <span className="font-mono text-[0.58rem] uppercase tracking-[0.3em] text-brand">
                        opcional
                      </span>
                    ) : (
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-text-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-[0.45em] inline-block h-1 w-1 shrink-0 rotate-45 bg-brand"
                        />
                        <span className="font-sans text-[0.85rem] text-text-muted leading-[1.55]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
