// src/components/historia/EraChapter.tsx
// One era of the timeline: its year held beside it while it scrolls past, its
// title and what happened, then its photographs — the era's own first, the
// prints of the band's album after, every one whole and at its own ratio.
import type { Era } from '@/data/band';
import { historia } from '@/data/copy/historia';
import { LedNumber } from '@/components/brand/LedNumber';
import { Label } from '@/components/ui/Label';
import { Album } from './Album';
import { Node } from './Node';

/** A four-digit year goes on the dot matrix; "Anos 80–90" and "Hoje" stay type. */
function Year({ year }: { year: string }) {
  if (/^\d{4}$/.test(year)) {
    return (
      <time dateTime={year}>
        <LedNumber value={year} matrixClassName="h-8 md:h-10" />
      </time>
    );
  }
  return <span className="text-2xl font-semibold tracking-tight text-led-text">{year}</span>;
}

export function EraChapter({ era }: { era: Era }) {
  return (
    <li className="relative grid gap-6 pl-8 md:grid-cols-[minmax(9rem,13rem)_1fr] md:gap-10 md:pl-12">
      <Node />
      {/* The year stays in view while its era scrolls past. */}
      <div className="md:sticky md:top-[calc(var(--nav-h)+1.5rem)] md:self-start">
        <Year year={era.year} />
      </div>
      {/* min-w-0: a grid track of 1fr will not shrink below its content, and a
          wide plate would push the column off the page. */}
      <div className="min-w-0">
        <h3 className="text-2xl font-semibold text-ink">{era.title}</h3>
        <p className="mt-3 max-w-[52ch] text-ink-muted">{era.description}</p>
        <Album rows={[era.lead]} className="mt-8" />
        {era.album && (
          <div className="mt-10">
            <Label>{historia.albumLabel}</Label>
            <Album rows={era.album} className="mt-5" />
          </div>
        )}
      </div>
    </li>
  );
}
