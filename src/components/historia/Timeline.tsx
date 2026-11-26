// src/components/historia/Timeline.tsx
// The band's five eras as a timeline: a horizontal touch jump rail for decades
// right below the header, then the vertical LED rail and each chapter.
import { timeline } from '@/data/band';
import { historia } from '@/data/copy/historia';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EraChapter, eraAnchorId } from './EraChapter';
import { Founding } from './Founding';

export function Timeline() {
  const [founding, ...later] = timeline;
  const eraLinks = [
    { href: '#capitulo-1969', label: founding.year },
    ...later.map((era) => ({ href: `#${eraAnchorId(era.year)}`, label: era.year })),
  ];

  return (
    <Section id="eras" labelledBy="eras-title">
      <Container>
        <SectionHeader id="eras-title" label={historia.eras.label} headline={historia.eras.headline} />

        {/* Horizontal decade jump rail for effortless navigation on mobile & desktop */}
        <nav aria-label="Navegar por décadas" className="mt-6 border-y border-line py-3">
          <ul className="scroll-strip -mx-[var(--pad-inline)] list-none gap-2 px-[var(--pad-inline)] md:mx-0 md:px-0">
            {eraLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="label-caps tap transition-quick inline-flex items-center whitespace-nowrap border border-line bg-surface-raise/70 px-3.5 text-2xs tabular-nums text-ink-muted hover:border-led hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative mt-12 md:mt-16">
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
