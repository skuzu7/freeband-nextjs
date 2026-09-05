// src/components/home/Blocos.tsx
// Block 3 — the thematic blocks as panels on the wall: each photograph
// resolves out of the dot matrix as it scrolls into view, the wardrobe shot
// tucked over its corner, in a horizontal scroll-snap row with a LED
// position indicator.
import type { CSSProperties } from 'react';
import { blocos } from '@/data/copy/home';
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
        <SnapDots rowId={ROW_ID} count={blocos.items.length} label={blocos.position} className="mb-2" />
      </Container>

      <ul
        id={ROW_ID}
        className="snap-row mt-10 items-start md:mt-14 md:items-end"
        style={{ '--snap-gap': '1.5rem' } as CSSProperties}
      >
        {blocos.items.map((bloco, i) => (
          <li key={bloco.id} className="rise flex w-[min(82vw,24rem)] flex-col gap-5">
            <div className="relative">
              <LedPhoto photo={bloco.photo} sizes="(min-width: 640px) 24rem, 82vw" cols={72} />
              {bloco.figurino && (
                <div className="absolute -right-3 -bottom-6 w-[42%] border-[3px] border-surface shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)]">
                  <Photo photo={bloco.figurino} sizes="10rem" />
                </div>
              )}
              <span aria-hidden className="label-caps absolute top-3 left-3 bg-surface/80 px-2 py-1 text-led-text backdrop-blur-sm">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="pt-2">
              <h3 className="text-2xl font-semibold tracking-tight text-ink">{bloco.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{bloco.note}</p>
              {bloco.figurino && <p className="label-caps mt-3 text-ink-low">{bloco.figurino.caption}</p>}
            </div>
          </li>
        ))}
      </ul>

      <Container>
        <p className="label-caps mt-8 text-ink-low md:hidden">{blocos.hint}</p>
        <p className="mt-8 hidden max-w-[60ch] text-sm text-ink-low md:block">{blocos.note}</p>
      </Container>
    </Section>
  );
}
