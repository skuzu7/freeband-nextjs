'use client';

// src/components/sections/Palco.tsx
// The live photography as a programme in three acts (vocais → blocos →
// efeitos). Each act is a sticky margin rail plus "plates": equal-height rows
// whose column widths are proportional to each photograph's native ratio, so
// every frame renders WHOLE and every row closes on a level line.
// Interactivity is limited to the lightbox — the acts replace the old
// client-side category filter with content structure.
import { useMemo, useState } from 'react';
import { stageFrames, figurinos, StageFrame } from '@/data/images';
import { bandLineup, pageCopy } from '@/data/content';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { CinematicImage } from '@/components/ui/CinematicImage';
import { LightboxModal, LightboxItem } from '@/components/ui/LightboxModal';
import { Maximize2 } from 'lucide-react';

const ratioOf = (frame: { aspect: string }) => {
  const [w, h] = frame.aspect.split('/').map(Number);
  return w / h;
};

function Caption({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 flex items-center justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-text-muted">
      <span className="flex items-baseline gap-2.5">
        <span className="shrink-0 font-semibold text-brand">{label}</span>
        <span>{children}</span>
      </span>
      <Maximize2
        aria-hidden
        className="h-3.5 w-3.5 shrink-0 text-brand opacity-0 transition-opacity group-hover:opacity-100"
      />
    </figcaption>
  );
}

/**
 * One equal-height row of whole photographs. On desktop every frame sits in
 * the row with a column width proportional to its ratio. On mobile, portrait
 * frames pair up two-across (still ratio-proportional) and landscape frames
 * take the full width.
 */
function Plate({
  frames,
  actNumeral,
  startIndex,
  onOpen,
}: {
  frames: StageFrame[];
  actNumeral: string;
  startIndex: number;
  onOpen: (src: string) => void;
}) {
  const ratios = frames.map(ratioOf);
  const sum = ratios.reduce((a, b) => a + b, 0);
  const cols = ratios.map((r) => `${(r / sum).toFixed(4)}fr`).join(' ');

  // Mobile: portraits pair up, landscapes span the whole row.
  const portraits = frames.filter((f) => ratioOf(f) < 1);
  const pairMobile = portraits.length >= 2;
  const mobileRatios = portraits.slice(0, 2).map(ratioOf);
  const mobileSum = mobileRatios.reduce((a, b) => a + b, 0);
  const colsMobile = pairMobile
    ? mobileRatios.map((r) => `${(r / mobileSum).toFixed(4)}fr`).join(' ')
    : '1fr';

  return (
    <div
      className="plate gap-[clamp(0.75rem,1.8vi,1.5rem)]"
      style={
        {
          '--plate-cols': cols,
          '--plate-cols-m': colsMobile,
        } as React.CSSProperties
      }
    >
      {frames.map((frame, i) => {
        const r = ratios[i];
        const landscape = r >= 1;
        const lgShare = Math.ceil((78 * r) / sum);
        const smShare = Math.ceil((100 * r) / sum);
        const mShare =
          pairMobile && !landscape ? Math.ceil((100 * r) / mobileSum) : 100;
        return (
          <figure
            key={frame.id}
            className={`group relative cursor-pointer reveal-mid ${
              pairMobile && landscape ? 'max-sm:col-span-full' : ''
            }`}
            style={{ ['--i' as string]: i } as React.CSSProperties}
            onClick={() => onOpen(frame.src)}
          >
            <CinematicImage
              src={frame.src}
              alt={frame.alt}
              grade="live"
              aspect={frame.aspect}
              fill
              sizes={`(min-width: 1024px) ${lgShare}vw, (min-width: 640px) ${smShare}vw, ${mShare}vw`}
              quality={90}
              wrapperClassName="ring-1 ring-inset ring-border"
              imgClassName="transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <Caption label={`${actNumeral}·${String(startIndex + i).padStart(2, '0')}`}>
              {frame.caption}
            </Caption>
          </figure>
        );
      })}
    </div>
  );
}

export function Palco() {
  const copy = pageCopy.palco;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const acts = useMemo(
    () =>
      copy.acts.map((act) => {
        const frames = stageFrames.filter((f) => f.category === act.key);
        const plates = new Map<number, StageFrame[]>();
        for (const f of frames) {
          plates.set(f.plate, [...(plates.get(f.plate) ?? []), f]);
        }
        return {
          ...act,
          frames,
          plates: [...plates.entries()].sort(([a], [b]) => a - b),
        };
      }),
    [copy.acts],
  );

  const allPalcoItems: LightboxItem[] = useMemo(
    () => [
      ...stageFrames.map((f) => ({ src: f.src, alt: f.alt, caption: f.caption })),
      ...figurinos.map((f) => ({
        src: f.src,
        alt: f.alt,
        caption: `Figurino · ${f.caption}`,
      })),
    ],
    [],
  );

  const handleOpenLightbox = (src: string) => {
    const idx = allPalcoItems.findIndex((item) => item.src === src);
    if (idx !== -1) setLightboxIndex(idx);
  };

  return (
    <Section id="palco" variant="ink" pad="xl">
      <Container>
        <SectionHeadline
          eyebrowNumber={copy.eyebrowNumber}
          eyebrowLabel={copy.eyebrowLabel}
          prefix={copy.headlinePrefix}
          emphasis={copy.headlineEmphasis}
          suffix={copy.headlineSuffix}
          lead={copy.lead}
        />

        {/* Who is actually on the stage: 11 integrantes */}
        <div className="mt-[clamp(2.5rem,5vi,3.5rem)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow tone="mono">{copy.lineupEyebrow}</Eyebrow>
            <span className="inline-flex items-center gap-2.5 border border-border bg-bg-raise/50 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
              <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-brand" />
              {copy.lineupNote}
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-7">
            {bandLineup.roles.map((item) => (
              <div key={item.role} className="flex flex-col gap-1.5 border-t border-border pt-3">
                <dt className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-text-muted">
                  {item.role}
                </dt>
                <dd
                  className="font-display font-semibold -tracking-[0.03em] text-text tabular-nums"
                  style={{ fontSize: 'var(--text-2xl)', lineHeight: 1 }}
                >
                  {String(item.count).padStart(2, '0')}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The three acts */}
        {acts.map((act) => {
          let counter = 0;
          return (
            <section
              key={act.key}
              aria-labelledby={`ato-${act.key}`}
              className="mt-[clamp(3.5rem,7vi,5.5rem)] border-t border-border pt-[clamp(2rem,4vi,3rem)]"
            >
              <div className="lg:grid lg:grid-cols-[minmax(150px,0.24fr)_1fr] lg:gap-x-[clamp(2rem,4vi,4rem)]">
                {/* Act rail — sticky beside the plates on desktop */}
                <header className="mb-8 flex items-end justify-between gap-6 lg:sticky lg:top-24 lg:mb-0 lg:block lg:self-start">
                  <div>
                    <span
                      aria-hidden
                      className="serif-italic block leading-none text-brand"
                      style={{ fontSize: 'var(--text-5xl)' }}
                    >
                      {act.numeral}
                    </span>
                    <h3
                      id={`ato-${act.key}`}
                      className="mt-3 font-display -tracking-[0.01em] text-text"
                      style={{ fontSize: 'var(--text-lg)', lineHeight: 1.2 }}
                    >
                      {act.title}
                    </h3>
                    <p className="mt-3 hidden max-w-[24ch] text-[0.82rem] leading-[1.6] text-text-muted lg:block">
                      {act.note}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-text-muted lg:mt-6 lg:block">
                    {String(act.frames.length).padStart(2, '0')} fotografias
                  </span>
                </header>

                {/* Plates */}
                <div className="flex flex-col gap-[clamp(1.25rem,2.5vi,2rem)]">
                  {act.plates.map(([plateNo, frames]) => {
                    const startIndex = counter + 1;
                    counter += frames.length;

                    if (frames.length === 1 && frames[0].weight === 'lead') {
                      const lead = frames[0];
                      return (
                        <figure
                          key={plateNo}
                          className="group relative cursor-pointer reveal-mid"
                          onClick={() => handleOpenLightbox(lead.src)}
                        >
                          <CinematicImage
                            src={lead.src}
                            alt={lead.alt}
                            grade="live"
                            aspect={lead.aspect}
                            fill
                            sizes="(min-width: 1024px) 78vw, 100vw"
                            quality={90}
                            wrapperClassName="ring-1 ring-inset ring-border"
                            imgClassName="transition-transform duration-700 group-hover:scale-[1.01]"
                          />
                          <Caption label={`${act.numeral}·${String(startIndex).padStart(2, '0')}`}>
                            {lead.caption}
                          </Caption>
                        </figure>
                      );
                    }

                    return (
                      <Plate
                        key={plateNo}
                        frames={frames}
                        actNumeral={act.numeral}
                        startIndex={startIndex}
                        onOpen={handleOpenLightbox}
                      />
                    );
                  })}

                  {/* Backstage wardrobe closes act II — the blocks' receipts */}
                  {act.key === 'blocos' && (
                    <div className="mt-[clamp(1.5rem,3vi,2.5rem)] border-t border-border/60 pt-[clamp(1.5rem,3vi,2.25rem)]">
                      <Eyebrow tone="mono">{copy.figurinosEyebrow}</Eyebrow>
                      <p
                        className="mt-4 max-w-[54ch] text-text-muted"
                        style={{ fontSize: 'var(--text-base)' }}
                      >
                        {copy.figurinosLead}
                      </p>
                      <ul className="mt-7 grid grid-cols-1 items-start gap-[clamp(0.75rem,1.8vi,1.5rem)] sm:grid-cols-3">
                        {figurinos.map((shot, i) => (
                          <li
                            key={shot.src}
                            className="group cursor-pointer reveal-mid"
                            onClick={() => handleOpenLightbox(shot.src)}
                            style={{ ['--i' as string]: i } as React.CSSProperties}
                          >
                            <figure>
                              <CinematicImage
                                src={shot.src}
                                alt={shot.alt}
                                grade="live"
                                aspect="3/4"
                                fill
                                sizes="(min-width: 1024px) 26vw, (min-width: 640px) 33vw, 100vw"
                                quality={90}
                                wrapperClassName="ring-1 ring-inset ring-border"
                                imgClassName="transition-transform duration-500 group-hover:scale-[1.02]"
                              />
                              <Caption label={`B·${String(i + 1).padStart(2, '0')}`}>
                                {shot.caption}
                              </Caption>
                            </figure>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </Container>

      <LightboxModal
        items={allPalcoItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={(idx) => setLightboxIndex(idx)}
      />
    </Section>
  );
}
