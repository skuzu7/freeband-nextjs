// src/components/sections/Historia.tsx
// Heritage: the founding, the five eras, and the names the band has shared a stage with.
import { release, timeline, artists, partners, pageCopy } from '@/data/content';
import { heritage, manifestoFrame } from '@/data/images';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { NumberScrub } from '@/components/ui/NumberScrub';
import { CinematicImage } from '@/components/ui/CinematicImage';
import { Marquee } from '@/components/ui/Marquee';
import { Award } from 'lucide-react';

export function Historia() {
  const copy = pageCopy.historia;
  const paragraphs = release.full.split('\n\n');
  const manifesto = release.manifesto.split('\n\n');

  return (
    <Section id="historia" variant="ink" pad="xl" className="overflow-hidden">
      <Container>
        <Eyebrow number={copy.eyebrowNumber}>{copy.eyebrowLabel}</Eyebrow>

        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-20">
          <div>
            <NumberScrub value={1969} label={copy.numberScrubLabel} />
          </div>

          <div className="flex flex-col gap-8">
            <h2
              className="reveal-lead font-display -tracking-[0.02em] text-balance text-text"
              style={{ fontSize: 'var(--text-5xl)', lineHeight: 0.95 }}
            >
              {copy.headlinePrefix}
              <span className="serif-italic text-brand">{copy.headlineEmphasis}</span>
              {copy.headlineSuffix}
            </h2>

            <div
              className="flex flex-col gap-6 text-text-muted max-w-[62ch]"
              style={{ fontSize: 'var(--text-base)', lineHeight: 1.7 }}
            >
              {paragraphs.map((para, i) => (
                <p key={i} className="text-pretty">
                  {para}
                </p>
              ))}
            </div>

            <ul className="flex flex-wrap gap-2 pt-2">
              {release.values.map((v) => (
                <li
                  key={v}
                  className="inline-flex items-center gap-2 border border-border bg-bg-raise/50 px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.28em] text-text-muted"
                >
                  <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-brand" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Heritage frames + the five eras */}
        <div className="mt-[clamp(4rem,8vi,7rem)] grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-16">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {heritage.map((shot, i) => (
              <li
                key={shot.src}
                className="reveal-mid group"
                style={{ ['--i' as string]: i } as React.CSSProperties}
              >
                <div className="overflow-hidden">
                  <CinematicImage
                    src={shot.src}
                    alt={shot.alt}
                    grade="vintage"
                    aspect="500/350"
                    fill
                    sizes="(min-width: 1024px) 16vw, 30vw"
                    wrapperClassName="ring-1 ring-inset ring-border transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2.5 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-text-muted">
                  {shot.caption}
                </p>
              </li>
            ))}
          </ul>

          <ol className="flex flex-col">
            {timeline.map((era, i) => (
              <li
                key={era.year}
                className="reveal-mid flex flex-col gap-2 border-t border-border py-5 last:border-b transition-colors hover:border-brand/50"
                style={{ ['--i' as string]: i } as React.CSSProperties}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3
                    className="font-display -tracking-[0.01em] text-text"
                    style={{ fontSize: 'var(--text-lg)', lineHeight: 1.15 }}
                  >
                    {era.title}
                  </h3>
                  <span className="shrink-0 font-mono text-[0.72rem] tabular-nums font-semibold text-brand">
                    {era.year}
                  </span>
                </div>
                <p className="max-w-[52ch] text-[0.85rem] leading-[1.6] text-text-muted text-pretty">
                  {era.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      {/* The band's own manifesto */}
      <Container>
        <div className="mt-[clamp(4rem,8vi,7rem)] border-t border-border pt-[clamp(2.5rem,4vi,3.5rem)]">
          <Eyebrow tone="mono">{copy.manifestoEyebrow}</Eyebrow>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
            <div className="flex flex-col gap-6 border-l-2 border-brand/40 pl-[clamp(1.25rem,3vi,2.5rem)]">
              {manifesto.map((para, i) => (
                <p
                  key={i}
                  className="reveal-mid max-w-[58ch] font-display text-text-muted text-pretty"
                  style={{ ['--i' as string]: i, fontSize: 'var(--text-lg)', lineHeight: 1.55 }}
                >
                  {para}
                </p>
              ))}
            </div>

            <div className="flex flex-col justify-end gap-8 lg:pb-2">
              <div className="reveal-mid overflow-hidden">
                <CinematicImage
                  src={manifestoFrame.src}
                  alt={manifestoFrame.alt}
                  grade="poster"
                  aspect="3/2"
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  quality={90}
                  wrapperClassName="ring-1 ring-inset ring-border transition-transform duration-500 hover:scale-105"
                />
              </div>

              <figure className="flex flex-col gap-4 bg-bg-raise/60 p-6 ring-1 ring-border">
                <blockquote
                  className="reveal-mid serif-italic text-balance text-brand"
                  style={{ fontSize: 'var(--text-2xl)', lineHeight: 1.15 }}
                >
                  &ldquo;{release.slogan}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
                  <span aria-hidden className="inline-block h-px w-8 shrink-0 bg-brand" />
                  {release.sloganFootnote}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </Container>

      {/* Shared stages / Marquee */}
      <div className="mt-[clamp(4rem,8vi,7rem)] border-t border-border pt-[clamp(3rem,5vi,4rem)]">
        <Container>
          <div className="flex items-center gap-3">
            <Award className="h-4 w-4 text-brand" />
            <Eyebrow tone="mono">{copy.namesEyebrow}</Eyebrow>
          </div>
          <p className="mt-4 max-w-[54ch] text-text-muted" style={{ fontSize: 'var(--text-base)' }}>
            {copy.namesLead}
          </p>
        </Container>

        <div className="mt-8 flex flex-col gap-5">
          <Marquee
            items={artists}
            speed={38}
            direction="l"
            variant="italic"
            kbdControl
            ariaLabel="Artistas com quem a Freeband já dividiu o palco"
          />
          <Marquee
            items={partners}
            speed={80}
            direction="r"
            variant="outline"
            kbdControl
            ariaLabel="Clubes e prefeituras parceiras"
          />
        </div>

        <Container>
          <p className="mt-[clamp(2.5rem,4vi,3.5rem)] flex items-center gap-4 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
            <span aria-hidden className="inline-block h-px w-10 bg-brand" />
            {copy.valuesLine}
          </p>
        </Container>
      </div>
    </Section>
  );
}
