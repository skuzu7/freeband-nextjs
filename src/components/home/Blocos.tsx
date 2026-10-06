// src/components/home/Blocos.tsx
// Block 3 — the thematic blocks as panels on the wall: each photograph
// resolves out of the dots as it scrolls into view. The wardrobe shot
// and the block's number sit beside the text, under the frame: nothing is
// laid over a photograph. On small screens cards stack in a responsive grid so
// every photograph stays whole and nothing is cut off horizontally; from md:
// they sit in a horizontal scroll-snap row with a LED position indicator.
import type { CSSProperties } from 'react';
import { blocos } from '@/data/copy/home';
import { ratioOf } from '@/data/media/paths';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SnapDots } from '@/components/ui/SnapDots';
import { Photo } from '@/components/media/Photo';

const ROW_ID = 'blocos-row';

export function Blocos() {
  return (
    <Section id="blocos" labelledBy="blocos-title" className="overflow-hidden border-t border-line">
      <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader id="blocos-title" label={blocos.label} headline={blocos.headline} lead={blocos.lead} />
        <SnapDots
          rowId={ROW_ID}
          count={blocos.items.length}
          label={blocos.position}
          prev={blocos.prev}
          next={blocos.next}
          className="mb-2 hidden md:flex"
        />
      </Container>

      {/* Thematic blocks: stacks vertically on mobile so every photograph stays
          whole and nothing is cut off horizontally; on desktop it runs as
          a horizontal scroll-snap row with LED controls. */}
      <ul
        id={ROW_ID}
        className="snap-row mt-10 items-start md:mt-14"
        style={{ '--snap-gap': '1.5rem', '--bloco-h': 'min(32rem, 100vw)' } as CSSProperties}
      >
        {blocos.items.map((bloco, i) => (
          <li
            key={bloco.id}
            className="rise flex flex-col gap-5"
            style={{ '--ratio': ratioOf(bloco.photo.aspect).toFixed(4) } as CSSProperties}
          >
            <Photo photo={bloco.photo} sizes="(min-width: 768px) 24rem, 92vw" led />
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <span aria-hidden className="label-caps text-led-text">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{bloco.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{bloco.note}</p>
                {bloco.figurino && <p className="label-caps mt-3 text-ink-low">{bloco.figurino.caption}</p>}
              </div>
              {bloco.figurino && (
                <div className="w-24 shrink-0 md:w-28">
                  <Photo photo={bloco.figurino} sizes="7rem" />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Container>
        <p className="mt-8 max-w-[60ch] text-sm text-ink-low">{blocos.note}</p>
      </Container>
    </Section>
  );
}
