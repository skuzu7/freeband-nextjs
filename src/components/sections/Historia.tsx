// src/components/sections/Historia.tsx
// Heritage: the founding, the five eras, and the names the band has shared a
// stage with — previously three separate sections (AtoI + AtoIII) that between
// them ran to nearly seven screens of near-black.
//
// Merged here because they are one argument: this band has been working since
// 1969, and here is who can vouch for it. The marquee of artist names stays —
// Jimmy Cliff and Lulu Santos are real credentials and the kinetic row is the
// best-earning motion on the site.
import { release, timeline, artists, partners, pageCopy } from '@/data/content';
import { heritage } from '@/data/images';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { NumberScrub } from '@/components/ui/NumberScrub';
import { CinematicImage } from '@/components/ui/CinematicImage';
import { Marquee } from '@/components/ui/Marquee';

export function Historia() {
  const copy = pageCopy.historia;
  const paragraphs = release.full.split('\n\n');

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
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.28em] text-text-muted"
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
          <ul className="grid grid-cols-3 gap-4">
            {heritage.map((shot, i) => (
              <li
                key={shot.src}
                className="reveal-mid"
                style={{ ['--i' as string]: i } as React.CSSProperties}
              >
                <CinematicImage
                  src={shot.src}
                  alt={shot.alt}
                  grade="vintage"
                  aspect="500/350"
                  fill
                  sizes="(min-width: 1024px) 16vw, 30vw"
                  wrapperClassName="ring-1 ring-inset ring-border"
                />
                <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.26em] text-text-muted">
                  {shot.caption}
                </p>
              </li>
            ))}
          </ul>

          <ol className="flex flex-col">
            {timeline.map((era, i) => (
              <li
                key={era.year}
                className="reveal-mid flex flex-col gap-2 border-t border-border py-5 last:border-b"
                style={{ ['--i' as string]: i } as React.CSSProperties}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3
                    className="font-display -tracking-[0.01em] text-text"
                    style={{ fontSize: 'var(--text-lg)', lineHeight: 1.15 }}
                  >
                    {era.title}
                  </h3>
                  <span className="shrink-0 font-mono text-[0.7rem] tabular-nums text-brand">
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

      {/* Shared stages — the marquee is the one piece of motion that earns its
          keep, so it survives the rewrite. */}
      <div className="mt-[clamp(4rem,8vi,7rem)] border-t border-border pt-[clamp(3rem,5vi,4rem)]">
        <Container>
          <Eyebrow tone="mono">{copy.namesEyebrow}</Eyebrow>
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
