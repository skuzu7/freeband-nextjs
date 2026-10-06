// src/components/historia/Timeline.tsx
// The band's five eras as a timeline: a rail of dots down the left that
// lights as the page scrolls (.led-rail in src/styles/led.css) and one node
// per era. The first node is the founding chapter, on sepia; the other four
// are EraChapters. Plain markup: it all reads and scrolls without JavaScript,
// and each photograph is a link to its own address.
import { timeline } from '@/data/band';
import { historia } from '@/data/copy/historia';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EraChapter } from './EraChapter';
import { Founding } from './Founding';

export function Timeline() {
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
              <EraChapter key={era.year} era={era} />
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
