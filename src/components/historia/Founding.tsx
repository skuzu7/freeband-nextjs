// src/components/historia/Founding.tsx
// The first node of the timeline: the founding chapter, on a sepia panel. The
// founders' portrait is shown whole and ungraded (the print is already sepia;
// the palette does the rest), the year in a real dot matrix, the founder's
// name — and under them the oldest prints of the band's own album.
import type { Era } from '@/data/band';
import { historia } from '@/data/copy/historia';
import { DotGrid } from '@/components/brand/DotGrid';
import { LedNumber } from '@/components/brand/LedNumber';
import { Label } from '@/components/ui/Label';
import { Album } from './Album';
import { Node } from './Node';

export function Founding({ era }: { era: Era }) {
  // Ungraded: the vintage filter is for prints that are not sepia already.
  const portrait = era.lead.map((photo) => ({ ...photo, grade: 'poster' as const }));
  return (
    <li id="capitulo-1969" className="relative pl-8 md:pl-12">
      <Node />
      <div data-theme="sepia" className="relative isolate overflow-hidden bg-surface p-5 text-ink sm:p-6 md:p-10">
        <DotGrid fade />
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-14">
          <div className="min-w-0">
            <Label dot>{historia.capitulo.label}</Label>
            <div className="mt-6 sm:mt-8">
              <time dateTime={era.year}>
                <LedNumber value={era.year} label={historia.numberLabel} matrixClassName="h-9 sm:h-12 md:h-16" />
              </time>
            </div>
            <h3 className="mt-8 text-3xl font-semibold tracking-display text-ink sm:mt-10 sm:text-4xl">
              {historia.capitulo.title}
            </h3>
            <p className="mt-4 max-w-[56ch] text-base text-ink-muted sm:mt-5 sm:text-lg">{historia.capitulo.lead}</p>
            <dl className="mt-6 border-t border-line pt-5 sm:mt-8 sm:pt-6">
              <dt className="label-caps text-ink-low">{historia.capitulo.founderLabel}</dt>
              <dd className="mt-1 text-lg font-medium text-ink sm:text-xl">{historia.capitulo.founder}</dd>
            </dl>
          </div>
          <Album rows={[portrait]} preload quality={90} className="min-w-0 md:w-[min(100%,28rem)] md:justify-self-end" />
        </div>
        {era.album && (
          <div className="mt-12 border-t border-line pt-8">
            <Label>{historia.albumLabel}</Label>
            <Album rows={era.album} className="mt-6" />
          </div>
        )}
      </div>
    </li>
  );
}
