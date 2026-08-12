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
import { stageFrames, framesSizes } from '@/data/images';
import { pageCopy } from '@/data/content';
import { Section } from '@/components/ui/Section';
import { Container } from '@/components/ui/Container';
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
      </Container>
    </Section>
  );
}
