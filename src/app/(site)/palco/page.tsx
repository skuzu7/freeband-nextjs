// "/palco" — the full gallery: three acts, wardrobe, rig, the four reels.
import type { Metadata } from 'next';
import { bandLineup } from '@/data/band';
import { palco } from '@/data/copy/palco';
import { Label } from '@/components/ui/Label';
import { PageHeader } from '@/components/site/PageHeader';
import { Atos } from '@/components/palco/Atos';
import { Figurinos } from '@/components/palco/Figurinos';
import { Estrutura } from '@/components/palco/Estrutura';
import { Show } from '@/components/palco/Show';

export const metadata: Metadata = {
  title: palco.seo.title,
  description: palco.seo.description,
  alternates: { canonical: '/palco' },
};

export default function PalcoPage() {
  return (
    <>
      <PageHeader id="palco-title" label={palco.label} headline={palco.headline} lead={palco.lead}>
        <div className="mt-10 border-t border-line pt-6">
          <Label>{palco.lineupLabel}</Label>
          <ul className="mt-4 flex flex-wrap gap-x-7 gap-y-3">
            {bandLineup.roles.map((r) => (
              <li key={r.role} className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums text-led-text">{r.count}</span>
                <span className="text-sm text-ink-muted">{r.role}</span>
              </li>
            ))}
          </ul>
          <p className="label-caps mt-4 text-ink-low">{palco.lineupNote}</p>
        </div>
      </PageHeader>
      <div className="pb-[var(--section-gap)]">
        <Atos />
      </div>
      <Figurinos />
      <Estrutura />
      <Show />
    </>
  );
}
