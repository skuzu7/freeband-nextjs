// src/components/home/Caminhao.tsx
// Block 2 — "O que chega no caminhão": clean editorial comparison of the two
// self-contained packages (no nested cards-within-cards or decorative dots),
// real mounted rig photographs, 11-piece lineup, and event formats.
import { cn } from '@/lib/cn';
import { bandLineup } from '@/data/band';
import { whatsappPackageLink } from '@/data/contact';
import { caminhao } from '@/data/copy/home';
import { estrutura } from '@/data/media/estrutura';
import { gallery } from '@/data/media/gallery';
import { linkFor } from '@/lib/gallery/sets';
import { servicePackages, services, type ServicePackage } from '@/data/packages';
import { DotGrid } from '@/components/brand/DotGrid';
import { LedNumber } from '@/components/brand/LedNumber';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlateRow } from '@/components/media/PlateRow';
import { PackageSelectButton } from './PackageSelectButton';

function PackageCard({ pkg, index }: { pkg: ServicePackage; index: number }) {
  return (
    <article
      className={cn(
        'rise transition-quick relative isolate flex flex-col justify-between gap-7 border p-6 md:p-8',
        pkg.highlighted
          ? 'border-led/70 bg-surface-raise'
          : 'border-line bg-surface/90 hover:border-line-strong',
      )}
    >
      {pkg.highlighted && <DotGrid fade className="opacity-40" />}

      <div className="relative z-10 flex flex-col gap-6">
        <header className="flex flex-col gap-2 border-b border-line pb-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-2xs tracking-wide text-ink-low uppercase">
            <span className="tabular-nums text-led-text">{String(index + 1).padStart(2, '0')}</span>
            <span aria-hidden>·</span>
            <span>{pkg.highlighted ? 'Estrutura completa' : 'Estrutura compacta'}</span>
            <span aria-hidden>·</span>
            <span>Caminhão próprio</span>
            {pkg.highlighted && (
              <>
                <span aria-hidden>·</span>
                <span className="font-semibold text-led-text">{caminhao.highlightBadge}</span>
              </>
            )}
          </div>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight text-ink">{pkg.name}</h3>
          <p className="text-sm leading-relaxed text-ink-muted">{pkg.description}</p>
        </header>

        {/* Clean hairline-separated list instead of nested bordered boxes */}
        <ul className="divide-y divide-line/60 border-b border-line/60">
          {pkg.features.map((feature) => (
            <li key={feature} className="py-2.5 text-sm leading-snug text-ink first:pt-0">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <PackageSelectButton packageId={pkg.id} highlighted={pkg.highlighted} />
        <a
          href={whatsappPackageLink(caminhao.whatsappMessage, pkg.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="tap transition-quick inline-flex items-center justify-center text-xs font-medium text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink sm:justify-end"
        >
          Tirar dúvida no WhatsApp
        </a>
      </div>
    </article>
  );
}

export function Caminhao() {
  const linkedEstrutura = estrutura.map((f) => ({ ...f, link: linkFor(gallery.palco, f.id) }));

  return (
    <Section id="caminhao" labelledBy="caminhao-title" className="border-t border-line">
      <Container>
        <SectionHeader id="caminhao-title" label={caminhao.label} headline={caminhao.headline} lead={caminhao.lead} />

        <div className="mt-10 grid gap-6 md:mt-12 lg:grid-cols-2">
          {servicePackages.map((pkg, idx) => (
            <PackageCard key={pkg.id} pkg={pkg} index={idx} />
          ))}
        </div>

        <div className="rise mt-14 border-t border-line pt-10 md:mt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <Label>{caminhao.estruturaLabel}</Label>
            <span className="text-xs text-ink-low">Painel LED · Box Truss · Timecode DMX</span>
          </div>
          <PlateRow frames={linkedEstrutura} className="mt-6" led />
        </div>

        <div className="mt-14 grid gap-10 border-t border-line pt-10 md:mt-16 lg:grid-cols-[1.2fr_1fr] lg:items-stretch">
          <div className="rise flex flex-col justify-between gap-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <Label>{caminhao.lineupLabel}</Label>
              <span className="text-xs text-led-text">
                {caminhao.lineupNote} · Sem playback
              </span>
            </div>
            <ul className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
              {bandLineup.roles.map((r) => (
                <li
                  key={r.role}
                  className="transition-quick flex flex-col justify-between gap-4 border border-line bg-surface-raise/70 p-4 hover:border-line-strong"
                >
                  <LedNumber value={String(r.count)} matrixClassName="h-6" animate={false} />
                  <span className="text-sm font-medium text-ink">{r.role}</span>
                </li>
              ))}
              <li className="flex flex-col justify-between gap-4 border border-led/50 bg-surface-raise p-4">
                <LedNumber value={String(bandLineup.total)} matrixClassName="h-6" animate={false} />
                <span className="text-xs font-medium text-led-text">Integrantes ao vivo</span>
              </li>
            </ul>
          </div>
          <div className="rise flex flex-col justify-between gap-5">
            <Label>{caminhao.formatsLabel}</Label>
            <ul className="flex flex-1 flex-col divide-y divide-line border-y border-line">
              {services.map((s) => (
                <li key={s.title} className="flex flex-1 flex-col justify-center py-4">
                  <p className="text-base font-semibold text-ink">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
