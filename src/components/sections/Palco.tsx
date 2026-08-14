// src/components/sections/Palco.tsx
// The live photography, full colour, whole.
//
// The archive is phone photography and almost all of it is PORTRAIT. The old
// grid forced every frame into landscape boxes (16/9 leads, 3/2 pairs) and
// object-cover threw away up to half of each picture. Now the one genuinely
// landscape frame opens the section full-width at its own 3/2, and the rest
// flow as masonry columns, each at its native ratio — nothing is cropped.
// No hooks — this stays a server component.
import { stageFrames, framesSizes, figurinos } from '@/data/images';
import { bandLineup, pageCopy } from '@/data/content';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { CinematicImage } from '@/components/ui/CinematicImage';

const lead = stageFrames.find((f) => f.weight === 'lead')!;
const beats = stageFrames.filter((f) => f.weight === 'beat');

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text-muted">
      <span aria-hidden className="inline-block h-px w-6 bg-brand" />
      {children}
    </figcaption>
  );
}

export function Palco() {
  const copy = pageCopy.palco;

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

        {/* Who is actually on the stage. "Onze integrantes" is a claim; the
            instrument-by-instrument count is the receipt, and it is the first
            thing a buyer comparing bands checks. */}
        <div className="mt-[clamp(2.5rem,5vi,3.5rem)]">
          <Eyebrow tone="mono">{copy.lineupEyebrow}</Eyebrow>
          {/* Rules per cell, not a filled grid: seven items never divide
              evenly into two or four columns, and a gap-px grid would paint
              the empty cell of the last row as a solid block. */}
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

        <div className="mt-[clamp(3rem,6vi,5rem)] flex flex-col gap-[clamp(1.5rem,3vi,2.5rem)]">
          <figure className="reveal-mid">
            <CinematicImage
              src={lead.src}
              alt={lead.alt}
              grade="live"
              aspect={lead.aspect}
              fill
              sizes={framesSizes(1)}
              quality={90}
              wrapperClassName="ring-1 ring-inset ring-border"
            />
            <Caption>{lead.caption}</Caption>
          </figure>

          {/* Masonry: CSS columns, every frame at its native ratio. The gap
              value is shared between column-gap and each figure's bottom
              margin so the gutters read even in both axes.

              These images are static-sized (width/height), NOT `fill`:
              absolutely-positioned children mis-render inside multicol
              fragmentation in Chromium, painting shorter than their box. The
              beat aspects in images.ts are the files' pixel dimensions, so
              they double as the width/height props here. */}
          <div className="columns-1 gap-[clamp(1.5rem,3vi,2.5rem)] sm:columns-2 lg:columns-3">
            {beats.map((frame, i) => {
              const [w, h] = frame.aspect.split('/').map(Number);
              return (
                <figure
                  key={frame.src}
                  className="reveal-mid mb-[clamp(1.5rem,3vi,2.5rem)] break-inside-avoid"
                  style={{ ['--i' as string]: i % 3 } as React.CSSProperties}
                >
                  <CinematicImage
                    src={frame.src}
                    alt={frame.alt}
                    grade="live"
                    width={w}
                    height={h}
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw"
                    quality={90}
                    imgClassName="h-auto w-full"
                    wrapperClassName="ring-1 ring-inset ring-border"
                  />
                  <Caption>{frame.caption}</Caption>
                </figure>
              );
            })}
          </div>
        </div>

        {/* Wardrobe. Small, in a row, under the show photography: the point is
            that the show has blocks and each one has its own costume — not
            three more pictures competing with the frames above. */}
        <div className="mt-[clamp(3.5rem,7vi,6rem)] border-t border-border pt-[clamp(2.5rem,4vi,3.5rem)]">
          <Eyebrow tone="mono">{copy.figurinosEyebrow}</Eyebrow>
          <p className="mt-4 max-w-[54ch] text-text-muted" style={{ fontSize: 'var(--text-base)' }}>
            {copy.figurinosLead}
          </p>

          <ul className="mt-8 grid grid-cols-3 gap-[clamp(0.75rem,2vi,1.5rem)]">
            {figurinos.map((shot, i) => (
              <li
                key={shot.src}
                className="reveal-mid"
                style={{ ['--i' as string]: i } as React.CSSProperties}
              >
                <figure>
                  {/* 3/4 is these files' native ratio (±1%) — whole frame. */}
                  <CinematicImage
                    src={shot.src}
                    alt={shot.alt}
                    grade="live"
                    aspect="3/4"
                    fill
                    sizes="(min-width: 768px) 30vw, 33vw"
                    quality={90}
                    wrapperClassName="ring-1 ring-inset ring-border"
                  />
                  <Caption>{shot.caption}</Caption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
