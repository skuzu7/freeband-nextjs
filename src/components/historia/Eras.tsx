// src/components/historia/Eras.tsx
// The band's five eras as a timeline: a rail of dots down the left that
// lights as the page scrolls (.led-rail in src/styles/led.css), one node per
// era, the year held beside its era while the photographs pass.
//
// The first node is the founding chapter — the founders' portrait shown whole
// and ungraded on a sepia panel (the print is already sepia; the palette does
// the rest), the year in a real dot matrix, the founder's name. The other
// four carry their archive photographs, each whole at its own ratio and
// graded as the archive marks it; an era with a second artefact shows the two
// as a plate. Plain markup: it all reads and scrolls without JavaScript.
import type { ReactNode } from 'react';
import { timeline, type Era } from '@/data/band';
import { historia } from '@/data/copy/historia';
import { ratioOf } from '@/data/media/paths';
import { DotGrid } from '@/components/brand/DotGrid';
import { LedNumber } from '@/components/brand/LedNumber';
import { Photo } from '@/components/media/Photo';
import { PlateRow } from '@/components/media/PlateRow';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

/** Tallest a single archive photograph stands beside its text, in rem. */
const PHOTO_MAX_REM = 30;

/** A lit dot on the rail, where an era begins. */
function Node() {
  return (
    <span
      aria-hidden
      className="absolute top-1.5 left-[calc(var(--dot-pitch)/2)] size-2.5 -translate-x-1/2 rounded-pill bg-led shadow-[0_0_10px_var(--color-led)]"
    />
  );
}

/** A four-digit year goes on the dot matrix; "Anos 80–90" and "Hoje" stay type. */
function Year({ year }: { year: string }) {
  if (/^\d{4}$/.test(year)) {
    return (
      <time dateTime={year}>
        <LedNumber value={year} matrixClassName="h-8 md:h-10" />
      </time>
    );
  }
  return <span className="text-2xl font-semibold tracking-tight text-led-text">{year}</span>;
}

function Founding({ era }: { era: Era }) {
  return (
    <li id="capitulo-1969" className="relative pl-8 md:pl-12">
      <Node />
      <div data-theme="sepia" className="relative isolate overflow-hidden bg-surface p-6 text-ink md:p-10">
        <DotGrid fade />
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-14">
          <div>
            <Label dot>{historia.capitulo.label}</Label>
            <div className="mt-8">
              <time dateTime={era.year}>
                <LedNumber value={era.year} label={historia.numberLabel} matrixClassName="h-12 md:h-16" />
              </time>
            </div>
            <h3 className="mt-10 text-4xl font-semibold tracking-display text-ink">{historia.capitulo.title}</h3>
            <p className="mt-5 max-w-[56ch] text-lg text-ink-muted">{historia.capitulo.lead}</p>
            <dl className="mt-8 border-t border-line pt-6">
              <dt className="label-caps text-ink-low">{historia.capitulo.founderLabel}</dt>
              <dd className="mt-1 text-xl font-medium text-ink">{historia.capitulo.founder}</dd>
            </dl>
          </div>
          <figure className="m-0 md:w-[min(100%,28rem)] md:justify-self-end">
            <Photo photo={era.image} sizes="(min-width: 768px) 28rem, 100vw" quality={90} preload />
            <figcaption className="label-caps mt-3 text-ink-low">{era.image.caption}</figcaption>
          </figure>
        </div>
      </div>
    </li>
  );
}

function EraNode({ era }: { era: Era }) {
  let artefacts: ReactNode;
  if (era.extra) {
    artefacts = <PlateRow frames={[era.image, era.extra]} rowFraction={0.6} led className="max-w-3xl" />;
  } else {
    artefacts = (
      <figure className="m-0" style={{ maxWidth: `min(100%, ${(ratioOf(era.image.aspect) * PHOTO_MAX_REM).toFixed(2)}rem)` }}>
        <Photo
          photo={era.image}
          grade={era.image.grade}
          sizes="(min-width: 1408px) 720px, (min-width: 768px) 50vw, 88vw"
          led
        />
        <figcaption className="label-caps mt-3 text-ink-low">{era.image.caption}</figcaption>
      </figure>
    );
  }

  return (
    <li className="relative grid gap-6 pl-8 md:grid-cols-[minmax(9rem,13rem)_1fr] md:gap-10 md:pl-12">
      <Node />
      {/* The year stays in view while its era scrolls past. */}
      <div className="md:sticky md:top-[calc(var(--nav-h)+1.5rem)] md:self-start">
        <Year year={era.year} />
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-ink">{era.title}</h3>
        <p className="mt-3 max-w-[52ch] text-ink-muted">{era.description}</p>
        <div className="mt-8">{artefacts}</div>
      </div>
    </li>
  );
}

export function Eras() {
  const [founding, ...later] = timeline;
  return (
    <Section id="eras" labelledBy="eras-title">
      <Container>
        <SectionHeader id="eras-title" label={historia.eras.label} headline={historia.eras.headline} />
        <div className="relative mt-14 md:mt-20">
          <span aria-hidden className="led-rail" />
          <ol className="flex flex-col gap-16 md:gap-24">
            <Founding era={founding} />
            {later.map((era) => (
              <EraNode key={era.year} era={era} />
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
