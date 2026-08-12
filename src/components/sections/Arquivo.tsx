// src/components/sections/Arquivo.tsx
// The gig-poster archive — the one section no competitor can reproduce.
//
// A third of the image archive is event flyers, not photographs: Réveillon in
// Barra Bonita, Baile do Havaí at Cosmopolitano FC, Arraiá do Náutico in
// Araraquara. The previous gallery mixed them in with the show photos and ran
// "cinematic grades" over them, which is why they read as damaged JPEGs.
//
// Treated as what they are — printed artefacts, unfiltered, each labelled with
// the town and date printed on it — they become the proof of 57 years of
// actual work, including two New Year's Eves promoted by a city hall.
//
// The grid is deliberately strict. The posters are loud enough; restraint is
// the container's job.
import { posters } from '@/data/images';
import { pageCopy } from '@/data/content';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { CinematicImage } from '@/components/ui/CinematicImage';

export function Arquivo() {
  const copy = pageCopy.arquivo;

  return (
    <Section id="arquivo" variant="ink-raise" pad="xl">
      <Container>
        <SectionHeadline
          eyebrowNumber={copy.eyebrowNumber}
          eyebrowLabel={copy.eyebrowLabel}
          prefix={copy.headlinePrefix}
          emphasis={copy.headlineEmphasis}
          suffix={copy.headlineSuffix}
          lead={copy.lead}
        />

        <ul className="poster-wall mt-[clamp(3rem,6vi,5rem)]">
          {posters.map((poster, i) => (
            <li
              key={poster.src}
              className="poster-card reveal-mid flex flex-col"
              style={{ ['--i' as string]: i % 4 } as React.CSSProperties}
            >
              <div className="poster-frame">
                <CinematicImage
                  src={poster.src}
                  alt={poster.alt}
                  grade="poster"
                  aspect="4/3"
                  fit="contain"
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                />
              </div>

              <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3
                    className="font-display -tracking-[0.02em] text-text"
                    style={{ fontSize: 'var(--text-lg)', lineHeight: 1.1 }}
                  >
                    {poster.town}
                  </h3>
                  <span className="shrink-0 font-mono text-[0.7rem] tabular-nums text-brand">
                    {poster.when}
                  </span>
                </div>

                <p className="font-mono text-[0.62rem] uppercase tracking-[0.26em] text-text-muted">
                  {poster.event}
                </p>

                {poster.venue && (
                  <p className="text-[0.78rem] leading-[1.5] text-text-low text-pretty">
                    {poster.venue}
                  </p>
                )}

                {poster.municipal && (
                  <p className="mt-1 inline-flex w-fit items-center gap-2 border border-brand/40 px-2.5 py-1 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-brand">
                    <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-brand" />
                    {copy.municipalNote}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-[clamp(2.5rem,4vi,3.5rem)] flex items-center gap-4 border-t border-border pt-8 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
          <span aria-hidden className="inline-block h-px w-10 bg-brand" />
          {copy.footnote}
        </p>
      </Container>
    </Section>
  );
}
