// src/components/palco/Atos.tsx
// The gallery as a programme in three acts. An index of anchors comes first;
// then each act is a section named by its title, its frames out of platesOf()
// already grouped into rows, and every row a plate: equal height, columns
// proportional to each frame's ratio, nothing cropped. Every frame is a link
// to its own address, which opens it in the photo viewer.
import { palco } from '@/data/copy/palco';
import { platesOf, stageFrames } from '@/data/media/frames';
import { gallery } from '@/data/media/gallery';
import { linkFor } from '@/lib/gallery/sets';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlateRow } from '@/components/media/PlateRow';

const actId = (key: string) => `ato-${key}`;

export function Atos() {
  return (
    <Container className="flex flex-col gap-20 md:gap-28">
      <nav aria-labelledby="atos-indice" className="-mb-6 border-y border-line py-6 md:-mb-12">
        <Label id="atos-indice" as="h2" dot>
          {palco.index.label}
        </Label>
        <ol className="act-index mt-5 list-none p-0">
          {palco.acts.map((act) => (
            <li key={act.key}>
              <a
                href={`#${actId(act.key)}`}
                className="tap transition-quick group flex flex-col justify-center gap-1 py-1 text-ink-muted hover:text-ink"
              >
                <span className="label-caps text-led-text">
                  {palco.actWord} {act.numeral}
                </span>
                <span className="text-lg font-medium text-ink">{act.title}</span>
                <span className="text-sm tabular-nums text-ink-low">
                  {palco.index.photos(stageFrames.filter((f) => f.category === act.key).length)}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {palco.acts.map((act, a) => (
        <section key={act.key} id={actId(act.key)} aria-labelledby={`${actId(act.key)}-title`} className="flex flex-col gap-8">
          <SectionHeader
            id={`${actId(act.key)}-title`}
            size="sub"
            label={`${palco.actWord} ${act.numeral}`}
            headline={act.title}
            lead={act.note}
          />
          {platesOf(act.key).map((plate, p) => (
            <PlateRow
              key={plate.map((f) => f.id).join()}
              frames={plate.map((f) => ({ ...f, link: linkFor(gallery.palco, f.id) }))}
              preload={a === 0 && p === 0}
              quality={plate.length === 1 ? 90 : 75}
            />
          ))}
        </section>
      ))}
      <p className="-mt-10 text-sm text-ink-low md:-mt-16">{palco.photoCredit}</p>
    </Container>
  );
}
