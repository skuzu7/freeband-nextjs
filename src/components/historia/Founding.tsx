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
      <div data-theme="sepia" className="relative isolate overflow-hidden bg-surface p-6 text-ink md:p-10">
        <DotGrid fade />
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-14">
          <div>
            <Label dot>{historia.capitulo.label}</Label>
            <div className="mt-8">
              <time dateTime={era.year}>
                <LedNumber value={era.year} label={historia.numberLabel} matrixClassName="h-12 md:h-16" />
              </time>
            </div>
            <h3 className="mt-10 text-4xl font-semibold tracking-display text-ink">{historia.capitulo.title}</h3>
            <p className="mt-5 max-w-[56ch] text-lg text-ink-muted">{historia.capitulo.lead}</p>
            <dl className="mt-8 border-t border-line pt-6">
              <dt className="label-caps text-ink-low">{historia.capitulo.founderLabel}</dt>
              <dd className="mt-1 text-xl font-medium text-ink">{historia.capitulo.founder}</dd>
            </dl>
          </div>
          <Album rows={[portrait]} preload quality={90} className="md:w-[min(100%,28rem)] md:justify-self-end" />
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
