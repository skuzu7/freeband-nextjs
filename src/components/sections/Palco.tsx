// src/components/sections/Palco.tsx
// The live photography, full colour, large.
//
// The old gallery ran every frame through `grayscale` on the wrapper (whose
// filter covers the whole subtree) and only lifted it on :hover — so on a
// phone the band's own show photos were permanently black and white, and the
// captions, also hover-gated, never appeared at all. Here colour is the
// default state and the caption is always rendered.
//
// Layout alternates one full-width "lead" frame against pairs of "beat"
// frames, so the rhythm comes from the pictures rather than from a uniform
// grid. No hooks — this stays a server component.
import { stageFrames, framesSizes, figurinos } from '@/data/images';
import { bandLineup, pageCopy } from '@/data/content';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeadline } from '@/components/ui/SectionHeadline';
import { CinematicImage } from '@/components/ui/CinematicImage';

const leads = stageFrames.filter((f) => f.weight === 'lead');
const beats = stageFrames.filter((f) => f.weight === 'beat');

/** One lead frame, then two beats, repeating — built once at module scope. */
const rows: Array<
  { kind: 'lead'; frame: (typeof stageFrames)[number] } | { kind: 'pair'; frames: typeof beats }
> = [];
{
  const queue = [...beats];
  leads.forEach((frame) => {
    rows.push({ kind: 'lead', frame });
    const pair = queue.splice(0, 2);
    if (pair.length) rows.push({ kind: 'pair', frames: pair });
  });
  while (queue.length) rows.push({ kind: 'pair', frames: queue.splice(0, 2) });
}

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
          {rows.map((row, i) =>
            row.kind === 'lead' ? (
              <figure key={row.frame.src} className="reveal-mid">
                <CinematicImage
                  src={row.frame.src}
                  alt={row.frame.alt}
                  grade="live"
                  crop={row.frame.crop}
                  aspect={row.frame.aspect}
                  fill
                  sizes={framesSizes(1)}
                  quality={90}
                  wrapperClassName="ring-1 ring-inset ring-border"
                />
                <Caption>{row.frame.caption}</Caption>
              </figure>
            ) : (
              <div key={i} className="grid gap-[clamp(1.5rem,3vi,2.5rem)] md:grid-cols-2">
                {row.frames.map((frame, j) => (
                  <figure
                    key={frame.src}
                    className="reveal-mid"
                    style={{ ['--i' as string]: j } as React.CSSProperties}
                  >
                    <CinematicImage
                      src={frame.src}
                      alt={frame.alt}
                      grade="live"
                      crop={frame.crop}
                      aspect={frame.aspect}
                      fill
                      sizes={framesSizes(0.5)}
                      wrapperClassName="ring-1 ring-inset ring-border"
                    />
                    <Caption>{frame.caption}</Caption>
                  </figure>
                ))}
              </div>
            ),
          )}
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
                  <CinematicImage
                    src={shot.src}
                    alt={shot.alt}
                    grade="live"
                    aspect="4/5"
                    fill
                    sizes="(min-width: 768px) 30vw, 33vw"
                    crop="center 35%"
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
