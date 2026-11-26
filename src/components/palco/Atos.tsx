// src/components/palco/Atos.tsx
// The gallery as a programme in three acts. On mobile, a horizontal touch jump
// strip lets visitors leap straight to any act, wardrobe, rig, or video; on
// desktop, the editorial 3-column act index leads into equal-height photo plates.
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
  const quickJumps = [
    ...palco.acts.map((act) => ({
      href: `#${actId(act.key)}`,
      label: `${palco.actWord} ${act.numeral}`,
    })),
    { href: '#figurinos', label: palco.figurinos.label },
    { href: '#estrutura', label: palco.estrutura.label },
    { href: '#show', label: 'Vídeos' },
  ];

  return (
    <Container className="flex flex-col gap-16 md:gap-28">
      <nav aria-labelledby="atos-indice" className="-mb-4 border-y border-line py-5 md:-mb-12 md:py-6">
        <Label id="atos-indice" as="h2">
          {palco.index.label}
        </Label>

        {/* Mobile horizontal touch jump rail */}
        <ul className="scroll-strip -mx-[var(--pad-inline)] mt-4 list-none gap-2 px-[var(--pad-inline)] md:hidden">
          {quickJumps.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="label-caps tap transition-quick inline-flex items-center whitespace-nowrap border border-line bg-surface-raise/70 px-3.5 text-2xs text-ink-muted hover:border-led hover:text-ink"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop editorial 3-column index */}
        <ol className="act-index mt-5 hidden list-none p-0 md:grid">
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
      <p className="-mt-8 text-sm text-ink-low md:-mt-16">{palco.photoCredit}</p>
    </Container>
  );
}
