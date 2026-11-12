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
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlateRow } from '@/components/media/PlateRow';

function PackageCard({ pkg, index }: { pkg: ServicePackage; index: number }) {
  return (
    <article
      className={cn(
        'rise transition-quick relative isolate flex flex-col gap-6 border p-6 md:p-8',
        pkg.highlighted
          ? 'border-led bg-surface-raise shadow-[0_0_40px_color-mix(in_oklab,var(--color-led),transparent_86%)]'
          : 'border-line bg-surface/85 backdrop-blur-sm hover:border-line-strong',
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
      <header className="relative z-10 flex flex-col gap-2 border-b border-line pb-5">
        <div className="flex items-center justify-between gap-3">
          <span className="label-caps text-2xs text-led-text">
            {String(index + 1).padStart(2, '0')} · {pkg.highlighted ? 'Configuração Flagship 3D' : 'Configuração Compacta'}
          </span>
          <span className="label-caps border border-line bg-surface px-2 py-0.5 text-2xs text-ink-low">
            Caminhão Próprio
          </span>
        </div>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">{pkg.name}</h3>
        <p className="text-sm text-ink-muted">{pkg.description}</p>
      </header>
      <ul className="relative z-10 grid gap-2.5 sm:grid-cols-2">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-ink">
            <i aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-pill bg-led shadow-[0_0_6px_var(--color-led)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="relative z-10 mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
        <Button
          variant={pkg.highlighted ? 'primary' : 'secondary'}
          href={whatsappPackageLink(caminhao.whatsappMessage, pkg.name)}
        >
          {caminhao.ctaLabel}
        </Button>
        <span className="label-caps text-2xs text-ink-low">Montagem + Técnico Inclusos</span>
      </div>
    </article>
  );
}

export function Caminhao() {
  return (
    <Section id="caminhao" labelledBy="caminhao-title" className="border-t border-line">
      <Container>
        <SectionHeader id="caminhao-title" label={caminhao.label} headline={caminhao.headline} lead={caminhao.lead} />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {servicePackages.map((pkg, idx) => (
            <PackageCard key={pkg.id} pkg={pkg} index={idx} />
          ))}
        </div>

        {/* The receipt for every line above: the rig, photographed mounted,
            switching on out of the panel. */}
        <div className="rise mt-14 border border-line bg-surface-raise/50 p-5 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Label dot>{caminhao.estruturaLabel}</Label>
            <span className="label-caps text-2xs text-led-text">Painel LED · Box Truss · Timecode DMX</span>
          </div>
          <PlateRow frames={estrutura} className="mt-6" led />
        </div>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 lg:grid-cols-[1.35fr_1fr]">
          <div className="rise flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Label dot>{caminhao.lineupLabel}</Label>
              <span className="label-caps border border-led/30 bg-surface-raise px-2.5 py-1 text-2xs text-led-text">
                {caminhao.lineupNote} · Sem Playback
              </span>
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
              {bandLineup.roles.map((r) => (
                <li
                  key={r.role}
                  className="transition-quick flex flex-col justify-between gap-3 border border-line bg-surface-raise/75 p-3.5 hover:border-led/60"
                >
                  <LedNumber value={String(r.count)} matrixClassName="h-6" animate={false} />
                  <span className="text-xs font-semibold text-ink">{r.role}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rise flex flex-col gap-5">
            <Label dot>{caminhao.formatsLabel}</Label>
            <ul className="grid gap-3">
              {services.map((s) => (
                <li
                  key={s.title}
                  className="border border-line bg-surface/85 p-4 backdrop-blur-sm"
                >
                  <p className="text-sm font-semibold text-ink">{s.title}</p>
                  <p className="mt-1 text-xs text-ink-muted">{s.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
