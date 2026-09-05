// src/components/home/Blocos.tsx
// Block 3 — the thematic blocks: one big photograph each, the wardrobe shot
// tucked over its corner, in a horizontal scroll-snap row.
import type { CSSProperties } from 'react';
import { blocos } from '@/data/copy/home';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { Photo } from '@/components/media/Photo';

export function Blocos() {
  return (
    <Section id="blocos" labelledBy="blocos-title" className="overflow-hidden border-t border-line">
      <Container>
        <header className="max-w-[60ch]">
          <Label dot>{blocos.label}</Label>
          <h2 id="blocos-title" className="mt-4 text-4xl font-semibold tracking-display text-ink">
            {blocos.headline}
          </h2>
          <p className="mt-5 text-lg text-ink-muted">{blocos.lead}</p>
        </header>
      </Container>

      <ul className="snap-row mt-12 items-end" style={{ '--snap-gap': '1.25rem' } as CSSProperties}>
        {blocos.items.map((bloco) => (
          <li key={bloco.id} className="flex w-[min(76vw,19rem)] flex-col gap-5">
            <div className="relative">
              <Photo photo={bloco.photo} sizes="(min-width: 640px) 19rem, 76vw" />
              {bloco.figurino && (
                <div className="absolute -right-3 -bottom-5 w-[40%] border-[3px] border-surface">
                  <Photo photo={bloco.figurino} sizes="8rem" />
                </div>
              )}
            </div>
            <div className="pt-1">
              <h3 className="text-xl font-semibold text-ink">{bloco.title}</h3>
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
