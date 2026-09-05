// src/components/home/Caminhao.tsx
// Block 2 — "O que chega no caminhão": the two packages side by side (the
// premium one on a lit panel), the rig resolving out of the dots, then the
// eleven on stage counted in LED digits and the formats the band plays.
import { cn } from '@/lib/cn';
import { bandLineup } from '@/data/band';
import { whatsappPackageLink } from '@/data/contact';
import { caminhao } from '@/data/copy/home';
import { estrutura } from '@/data/media/estrutura';
import { servicePackages, services, type ServicePackage } from '@/data/packages';
import { DotGrid } from '@/components/brand/DotGrid';
import { LedNumber } from '@/components/brand/LedNumber';
import { LedText } from '@/components/brand/LedText';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { PlateRow } from '@/components/media/PlateRow';

function PackageCard({ pkg }: { pkg: ServicePackage }) {
  return (
    <article
      className={cn(
        'rise relative isolate flex flex-col gap-6 border p-6 md:p-8',
        pkg.highlighted ? 'border-led bg-surface-raise' : 'border-line',
      )}
    >
      {pkg.highlighted && (
        <>
          <DotGrid fade className="opacity-70" />
          <Label dot className="absolute -top-2.5 left-6 bg-surface px-2">
            {caminhao.highlightBadge}
          </Label>
        </>
      )}
      <header>
        <h3 className="label-caps text-ink">{pkg.name}</h3>
        <p className="mt-3 text-ink-muted">{pkg.description}</p>
      </header>
      <ul className="flex flex-col gap-2.5">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm text-ink">
            <i aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-pill bg-led" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        variant={pkg.highlighted ? 'primary' : 'secondary'}
        href={whatsappPackageLink(caminhao.whatsappMessage, pkg.name)}
        className="mt-auto self-start"
      >
        {caminhao.ctaLabel}
      </Button>
    </article>
  );
}

export function Caminhao() {
  return (
    <Section id="caminhao" labelledBy="caminhao-title">
      <Container>
        <header className="max-w-[60ch]">
          <Label dot>{caminhao.label}</Label>
          <div className="mt-4">
            <LedText id="caminhao-title" text={caminhao.headline} className="text-4xl font-semibold tracking-display text-ink" />
          </div>
          <p className="rise mt-5 text-lg text-ink-muted">{caminhao.lead}</p>
        </header>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {servicePackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* The receipt for every line above: the rig, photographed mounted,
            switching on out of the panel. */}
        <div className="rise mt-12">
          <Label>{caminhao.estruturaLabel}</Label>
          <PlateRow frames={estrutura} className="mt-5" led />
        </div>

        <div className="mt-12 grid gap-10 border-t border-line pt-8 md:grid-cols-[1.4fr_1fr]">
          <div className="rise">
            <Label>{caminhao.lineupLabel}</Label>
            <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
              {bandLineup.roles.map((r) => (
                <li key={r.role} className="flex items-end gap-2.5">
                  <LedNumber value={String(r.count)} matrixClassName="h-6" animate={false} />
                  <span className="text-sm text-ink-muted">{r.role}</span>
                </li>
              ))}
            </ul>
            <p className="label-caps mt-5 text-ink-low">{caminhao.lineupNote}</p>
          </div>
          <div className="rise">
            <Label>{caminhao.formatsLabel}</Label>
            <ul className="mt-5 flex flex-col gap-2">
              {services.map((s) => (
                <li key={s.title} className="flex items-baseline gap-3">
                  <span className="text-ink">{s.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
