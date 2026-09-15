// src/components/home/Blocos.tsx
// Block 3 — the thematic blocks as panels on the wall: each photograph
// resolves out of the dot matrix as it scrolls into view, the wardrobe shot
// framed beside the caption under it — both pictures whole, neither covering
// the other. On small screens cards stack in a responsive grid so every
// photograph stays whole and nothing is cut off horizontally; from md: they
// sit in a horizontal scroll-snap row with a LED position indicator.
import type { CSSProperties } from 'react';
import { blocos } from '@/data/copy/home';
import { ratioOf } from '@/data/media/paths';
import { LedPhoto } from '@/components/brand/LedPhoto';
import { LedText } from '@/components/brand/LedText';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { SnapDots } from '@/components/ui/SnapDots';
import { Photo } from '@/components/media/Photo';

const ROW_ID = 'blocos-row';

export function Blocos() {
  return (
    <Section id="blocos" labelledBy="blocos-title" className="overflow-hidden border-t border-line">
      <Container className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <header className="max-w-[60ch]">
          <Label dot>{blocos.label}</Label>
          <div className="mt-4">
            <LedText id="blocos-title" text={blocos.headline} className="text-4xl font-semibold tracking-display text-ink" />
          </div>
          <p className="rise mt-5 text-lg text-ink-muted">{blocos.lead}</p>
        </header>
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
            className="rise flex w-full flex-col gap-5 md:w-auto"
            style={{ '--ratio': ratioOf(bloco.photo.aspect).toFixed(4) } as CSSProperties}
          >
            <div className="relative">
              <LedPhoto
                photo={bloco.photo}
                sizes="(min-width: 768px) 24rem, 92vw"
                cols={72}
              />
              <span
                aria-hidden
                className="label-caps absolute top-3 left-3 bg-surface/80 px-2 py-1 text-led-text backdrop-blur-sm"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            {/* The wardrobe shot sits beside the caption as a framed print
                rather than over the corner of the stage photograph: the two
                pictures are shown whole, and it gains the caption it already
                carries. Blocks without one (cabaré) just fill the width. */}
            <div className="flex items-start gap-4">
              {bloco.figurino && (
                <div className="w-[26%] max-w-[7.5rem] shrink-0 border-[3px] border-surface shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)]">
                  <Photo photo={bloco.figurino} sizes="(min-width: 768px) 8rem, 26vw" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-2xl font-semibold tracking-tight text-ink">{bloco.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{bloco.note}</p>
                {bloco.figurino && <p className="label-caps mt-3 text-ink-low">{bloco.figurino.caption}</p>}
              </div>
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
