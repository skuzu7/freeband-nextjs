// src/components/sections/AtoI_Manifesto.tsx
// PALCO II — Ato I: merge of the old Sobre + Historia sections.
// Replaces the horizontal scroll-snap runway with a vertical editorial
// layout: oversized "57" bleeding left, kinetic manifesto headline, body
// paragraphs, a single cinematic photo that scrubs B&W → color on scroll,
// and a vertical mini-timeline of the 5 eras with highlights row at bottom.
import { release, timeline, pageCopy } from '@/data/content';
import { images } from '@/data/images';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { NumberScrub } from '@/components/ui/NumberScrub';
import { CinematicImage } from '@/components/ui/CinematicImage';

export function AtoI_Manifesto() {
  const paragraphs = release.full.split('\n\n');
  const copy = pageCopy.atoI;

  return (
    <Section id="sobre" variant="ink-deep" pad="xl" className="overflow-hidden">
      <Container>
        <Eyebrow number={copy.eyebrowNumber}>{copy.eyebrowLabel}</Eyebrow>

        {/* mt-6 matches the spacing other Atos use below their eyebrow (was
            mt-[clamp(3rem,6vi,5rem)] — inconsistent with II/III/IV/V). */}
        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20">
          {/* Oversized 1969 — the -ml bleed is scoped inside an
              overflow-hidden wrapper so it cannot cause horizontal scroll
              on mobile regardless of viewport width. */}
          <div className="relative">
            <div className="lg:-ml-[clamp(1rem,4vw,3rem)] flex items-start">
              <NumberScrub value={1969} label={copy.numberScrubLabel} />
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <h2
              className="reveal-lead font-display -tracking-[0.02em] text-balance text-text"
              style={{ fontSize: 'var(--text-5xl)', lineHeight: 1.05 }}
            >
              <span className="lg:block">
                {copy.headlinePrefix}
                <span className="text-brand">{copy.headlineEmphasis}</span>
                {copy.headlineSuffix}
              </span>
            </h2>

              <div
                className="reveal-mid flex flex-col gap-6 text-text-muted max-w-[62ch]"
                style={{ fontSize: 'var(--text-base)', lineHeight: 1.7 }}
              >
                {paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="text-pretty text-kinetic-paragraph"
                    style={{ ['--i' as string]: i } as React.CSSProperties}
                  >
                    {para}
                  </p>
                ))}
              </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {release.values.map((v) => (
                <span
                  key={v}
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-text-muted"
                >
                  <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-brand" />
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Photo + vertical era timeline */}
        <div className="mt-[clamp(4rem,8vi,7rem)] grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
          <CinematicImage
            src={images.anos70}
            alt="A banda Internacional Freeband no início dos anos 70"
            grade="scrub"
            parallax="soft"
            fill
            fit="cover"
            sizes="(min-width: 1024px) 55vw, 100vw"
            quality={90}
            wrapperClassName="reveal-mid w-full ring-1 ring-inset ring-border"
            aspect="500/350"
            imgClassName="chromatic-hover"
          />

          <ol className="reveal-mid flex flex-col gap-0">
            {timeline.map((era, i) => {
              const ato = String(i + 1).padStart(2, '0');
              return (
                <li
                  key={i}
                  className="group relative flex flex-col gap-3 border-t border-border py-6 last:border-b transition-colors hover:border-brand"
                  style={{ ['--i' as string]: i } as React.CSSProperties}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-brand">
                      Ato {ato}
                    </span>
                    <span
                      className="font-display font-semibold -tracking-[0.03em] text-text"
                      style={{ fontSize: 'var(--text-2xl)', lineHeight: 1 }}
                    >
                      {era.year}
                    </span>
                  </div>
                  <h3
                    className="font-display -tracking-[0.01em] text-text"
                    style={{ fontSize: 'var(--text-lg)', lineHeight: 1.15 }}
                  >
                    {era.title}
                  </h3>
                  <p className="max-w-[44ch] text-[0.88rem] leading-[1.6] text-text-low text-pretty">
                    {era.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Highlights row */}
        <ul className="reveal-tail mt-[clamp(4rem,6vi,5rem)] grid grid-cols-2 gap-x-8 gap-y-10 border-t border-border pt-[clamp(2rem,4vi,3.5rem)] sm:grid-cols-4">
          {release.highlights.map((h, i) => (
            <li
              key={h.label}
              className="flex flex-col gap-2"
              style={{ ['--i' as string]: i } as React.CSSProperties}
            >
              <span
                className="font-display font-semibold -tracking-[0.03em] text-text"
                style={{ fontSize: 'var(--text-4xl)', lineHeight: 0.9 }}
              >
                {h.value}
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-low">
                {h.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
