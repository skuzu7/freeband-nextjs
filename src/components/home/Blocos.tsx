// src/components/home/Blocos.tsx
// Block 3 — Thematic show blocks as a touch-first horizontal peek carousel on
// mobile (with interactive SnapDots & counter) and proportional snap-row on desktop.
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
          className="md:mb-2"
        />
      </Container>

      <ul
        id={ROW_ID}
        tabIndex={0}
        aria-labelledby="blocos-title"
        className="snap-row mt-8 items-start md:mt-12"
        style={{ '--snap-gap': '1.5rem', '--bloco-h': 'min(30rem, 96vw)' } as CSSProperties}
      >
        {blocos.items.map((bloco, i) => (
          <li
            key={bloco.id}
            data-stage-era={bloco.id}
            className="rise flex flex-col border border-line bg-surface-raise/80 transition-colors duration-200 hover:border-line-strong"
            style={{ '--ratio': ratioOf(bloco.photo.aspect).toFixed(4) } as CSSProperties}
          >
            <Photo photo={bloco.photo} sizes="(min-width: 768px) 24rem, 82vw" led />
            <div className="flex flex-1 flex-col justify-between gap-4 border-t border-line p-4 md:p-5">
              <div>
                <div className="flex items-center gap-2 text-2xs tracking-wide text-ink-low uppercase">
                  <span aria-hidden className="tabular-nums text-led-text">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden>·</span>
                  <span>Show temático</span>
                </div>
                <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink md:text-2xl">{bloco.title}</h3>
              </div>

              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-ink-muted">{bloco.note}</p>
                  <p className="mt-3 border-t border-line/60 pt-2.5 text-xs text-led-text">
                    {bloco.figurino ? bloco.figurino.caption : 'Performance & Painel LED'}
                  </p>
                </div>
                {bloco.figurino && (
                  <div className="w-16 shrink-0 overflow-hidden ring-1 ring-line/80 sm:w-20">
                    <Photo photo={bloco.figurino} sizes="5rem" />
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Container>
        <p className="mt-7 max-w-[60ch] text-sm text-ink-low">{blocos.note}</p>
      </Container>
    </Section>
  );
}
