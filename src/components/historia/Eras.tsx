// src/components/historia/Eras.tsx
// Five eras. The first is the chapter just above, so it appears here as a
// line of text only; the other four alternate photograph and text, each
// picture whole at its own ratio and graded as the archive marks it.
import { cn } from '@/lib/cn';
import { timeline } from '@/data/band';
import { historia } from '@/data/copy/historia';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { Photo } from '@/components/media/Photo';

export function Eras() {
  return (
    <Section id="eras" labelledBy="eras-title">
      <Container>
        <header className="max-w-[60ch]">
          <Label dot>{historia.eras.label}</Label>
          <h2 id="eras-title" className="mt-4 text-4xl font-semibold tracking-display text-ink">
            {historia.eras.headline}
          </h2>
        </header>

        <ol className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-24">
          {timeline.map((era, i) => {
            const flip = i % 2 === 0;
            if (i === 0) {
              return (
                <li key={era.year} className="grid gap-4 border-b border-line pb-10 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <Label>{era.year}</Label>
                  </div>
                  <div className="md:col-span-8">
                    <h3 className="text-2xl font-semibold text-ink">{era.title}</h3>
                    <p className="mt-3 max-w-[52ch] text-ink-muted">{era.description}</p>
                  </div>
                </li>
              );
            }
            return (
              <li key={era.year} className="grid gap-6 md:grid-cols-12 md:items-center md:gap-10">
                <figure className={cn('m-0 md:col-span-5', flip ? 'md:col-start-8' : 'md:col-start-1')}>
                  <Photo
                    photo={era.image}
                    grade={era.image.grade}
                    sizes="(min-width: 1408px) 560px, (min-width: 768px) 40vw, 100vw"
                  />
                  <figcaption className="label-caps mt-3 text-ink-low">{era.image.caption}</figcaption>
                </figure>
                <div className={cn('md:col-span-6 md:row-start-1', flip ? 'md:col-start-1' : 'md:col-start-7')}>
                  <Label>{era.year}</Label>
                  <h3 className="mt-3 text-2xl font-semibold text-ink">{era.title}</h3>
                  <p className="mt-3 max-w-[48ch] text-ink-muted">{era.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </Section>
  );
}
