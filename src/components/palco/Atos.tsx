// src/components/palco/Atos.tsx
// The gallery as a programme in three acts. Each act is a section named by
// its title; its frames come out of platesOf() already grouped into rows, and
// every row is a plate: equal height, columns proportional to each frame's
// ratio, nothing cropped.
import { palco } from '@/data/copy/palco';
import { platesOf } from '@/data/media/frames';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { PlateRow } from '@/components/media/PlateRow';

export function Atos() {
  return (
    <Container className="flex flex-col gap-20 md:gap-28">
      {palco.acts.map((act, a) => (
        <section key={act.key} id={`ato-${act.key}`} aria-labelledby={`ato-${act.key}-title`} className="flex flex-col gap-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
            <div>
              <Label dot>
                {palco.actWord} {act.numeral}
              </Label>
              <h2 id={`ato-${act.key}-title`} className="mt-3 text-3xl font-semibold tracking-display text-ink">
                {act.title}
              </h2>
            </div>
            <p className="max-w-[44ch] text-ink-muted md:text-right">{act.note}</p>
          </header>
          {platesOf(act.key).map((plate, p) => (
            <PlateRow
              key={plate.map((f) => f.id).join()}
              frames={plate}
              priority={a === 0 && p === 0}
              quality={plate.length === 1 ? 90 : 75}
            />
          ))}
        </section>
      ))}
    </Container>
  );
}
