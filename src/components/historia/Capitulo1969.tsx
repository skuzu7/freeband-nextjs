// src/components/historia/Capitulo1969.tsx
// The opening chapter, in sepia: the founders' portrait shown whole and
// ungraded (the print is already sepia; the block's palette does the rest),
// the year in a real dot matrix, the founder's name.
import { timeline } from '@/data/band';
import { historia } from '@/data/copy/historia';
import { DotGrid } from '@/components/brand/DotGrid';
import { LedNumber } from '@/components/brand/LedNumber';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { Photo } from '@/components/media/Photo';

const era = timeline[0];

export function Capitulo1969() {
  return (
    <Section id="capitulo-1969" theme="sepia" labelledBy="capitulo-title">
      <DotGrid fade />
      <Container className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16">
        <div>
          <Label dot>{historia.capitulo.label}</Label>
          <div className="mt-8">
            <LedNumber value={era.year} label={historia.numberLabel} matrixClassName="h-12 md:h-16" />
          </div>
          <h2 id="capitulo-title" className="mt-10 text-4xl font-semibold tracking-display text-ink">
            {historia.capitulo.title}
          </h2>
          <p className="mt-5 max-w-[56ch] text-lg text-ink-muted">{historia.capitulo.lead}</p>
          <dl className="mt-8 border-t border-line pt-6">
            <dt className="label-caps text-ink-low">{historia.capitulo.founderLabel}</dt>
            <dd className="mt-1 text-xl font-medium text-ink">{historia.capitulo.founder}</dd>
          </dl>
        </div>
        <figure className="m-0 md:justify-self-end md:w-[min(100%,28rem)]">
          <Photo photo={era.image} sizes="(min-width: 768px) 28rem, 100vw" quality={90} priority />
          <figcaption className="label-caps mt-3 text-ink-low">{era.image.caption}</figcaption>
        </figure>
      </Container>
    </Section>
  );
}
