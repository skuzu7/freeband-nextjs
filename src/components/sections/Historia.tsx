// src/components/sections/Historia.tsx
// Heritage: the five eras — each with its own archival photograph, whole —
// and the names the band has shared a stage with.
import { release, timeline, artists, partners, pageCopy } from '@/data/content';
import { manifestoFrame } from '@/data/images';
import type { ImageGrade } from '@/components/ui/CinematicImage';
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

        {/* The five eras — a photographic chronology. Every frame is the era's
            own artefact, rendered whole at the file's native ratio. */}
        <ol className="mt-[clamp(4rem,8vi,7rem)]">
          {timeline.map((era, i) => (
            <li
              key={era.year}
              className="reveal-mid group grid grid-cols-[minmax(72px,0.14fr)_1fr] items-start gap-x-[clamp(1rem,3vi,2.5rem)] gap-y-5 border-t border-border py-[clamp(1.5rem,3.5vi,2.75rem)] transition-colors last:border-b hover:border-brand/50 sm:grid-cols-[minmax(90px,0.14fr)_minmax(130px,0.24fr)_1fr]"
              style={{ ['--i' as string]: i % 3 } as React.CSSProperties}
            >
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="serif-italic leading-none text-brand" style={{ fontSize: 'var(--text-xl)' }}>
                  {era.year}
                </span>
              </div>

              <figure className="col-start-2 row-start-2 max-w-[300px] sm:row-start-1">
                <CinematicImage
                  src={era.image}
                  alt={era.imageAlt}
                  grade={era.imageGrade as ImageGrade}
                  aspect={era.imageAspect}
                  fill
                  sizes="(min-width: 640px) 24vw, 300px"
                  wrapperClassName="ring-1 ring-inset ring-border transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <figcaption className="mt-2.5 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-text-muted">
                  {era.imageCaption}
                </figcaption>
              </figure>

              <div className="col-span-2 col-start-1 sm:col-span-1 sm:col-start-3">
                <h3
                  className="font-display -tracking-[0.01em] text-text"
                  style={{ fontSize: 'var(--text-lg)', lineHeight: 1.15 }}
                >
                  {era.title}
                </h3>
                <p className="mt-3 max-w-[52ch] text-[0.88rem] leading-[1.65] text-text-muted text-pretty">
                  {era.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
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
                  grade="live"
                  aspect={manifestoFrame.aspect}
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  quality={90}
                  wrapperClassName="ring-1 ring-inset ring-border transition-transform duration-500 hover:scale-[1.02]"
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
