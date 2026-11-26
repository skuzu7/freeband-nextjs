'use client';

// src/components/home/BriefingBuilder.tsx
// Guided 3-step event briefing configurator synced with Caminhao package
// selection. Uses a native date picker + flexible-date toggle, live WhatsApp
// message preview, direct WhatsApp deep link, and one-tap clipboard copy.
import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { data } from '@/data/copy/home';
import {
  composeBriefingMessage,
  composeBriefingWhatsAppLink,
  formatBriefingDate,
  validateBriefingStep,
  type BriefingStep,
} from '@/lib/briefing';
import { useBriefingStore } from '@/stores/useBriefingStore';
import { DotGrid } from '@/components/brand/DotGrid';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Label } from '@/components/ui/Label';

const STEPS: ReadonlyArray<{ id: BriefingStep; short: string; title: string }> = [
  { id: 1, short: '01', title: 'Evento' },
  { id: 2, short: '02', title: 'Estrutura' },
  { id: 3, short: '03', title: 'Data e local' },
];

export function BriefingBuilder() {
  const { briefing } = data;
  const format = useBriefingStore((s) => s.format);
  const packageName = useBriefingStore((s) => s.packageName);
  const date = useBriefingStore((s) => s.date);
  const dateFlexible = useBriefingStore((s) => s.dateFlexible);
  const city = useBriefingStore((s) => s.city);
  const step = useBriefingStore((s) => s.step);
  const selectedFromCatalog = useBriefingStore((s) => s.selectedFromCatalog);

  const setFormat = useBriefingStore((s) => s.setFormat);
  const setPackageName = useBriefingStore((s) => s.setPackageName);
  const setDate = useBriefingStore((s) => s.setDate);
  const setDateFlexible = useBriefingStore((s) => s.setDateFlexible);
  const setCity = useBriefingStore((s) => s.setCity);
  const setStep = useBriefingStore((s) => s.setStep);

  const [copied, setCopied] = useState(false);

  const dateInputId = useId();
  const cityInputId = useId();

  const draft = { format, packageName, date, dateFlexible, city };
  const messagePreview = composeBriefingMessage(draft);
  const href = composeBriefingWhatsAppLink(draft);
  const validation = validateBriefingStep(step, draft);
  const formattedDate = formatBriefingDate(date, dateFlexible);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(messagePreview);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rise relative isolate border border-line bg-surface-raise p-5 sm:p-6 md:p-8">
      <DotGrid fade className="opacity-35" />

      <div className="relative z-10 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label>{briefing.badge}</Label>
            <span className="text-xs tabular-nums text-ink-low">Etapa {step} de 3</span>
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">{briefing.title}</h3>
          <p className="text-sm text-ink-muted">{briefing.subtitle}</p>
        </header>

        {/* Interactive 3-step stepper bar */}
        <nav aria-label="Etapas do briefing" className="grid grid-cols-3 gap-1.5 bg-surface/80 p-1">
          {STEPS.map((item) => {
            const active = step === item.id;
            const completed = step > item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? 'step' : undefined}
                onClick={() => setStep(item.id)}
                className={cn(
                  'transition-quick tap flex items-center justify-center gap-1 rounded-sm px-1.5 text-[11px] font-medium whitespace-nowrap sm:gap-1.5 sm:px-2 sm:text-xs',
                  active
                    ? 'bg-surface-high text-ink ring-1 ring-led/70'
                    : completed
                      ? 'text-led-text hover:text-ink'
                      : 'text-ink-muted hover:text-ink',
                )}
              >
                {completed ? (
                  <Icon name="check" className="size-3.5 text-led" />
                ) : (
                  <span className={cn('tabular-nums', active ? 'text-led-text' : 'text-ink-low')}>{item.short}</span>
                )}
                <span className="truncate">{item.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick selection summary bar */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-line pb-3 text-xs text-ink-muted">
          <span className="font-medium text-ink">{format}</span>
          <span aria-hidden>·</span>
          <span className="text-led-text">{packageName}</span>
          {formattedDate && (
            <>
              <span aria-hidden>·</span>
              <span className="tabular-nums">{formattedDate}</span>
            </>
          )}
          {city.trim() && (
            <>
              <span aria-hidden>·</span>
              <span>{city.trim()}</span>
            </>
          )}
          {selectedFromCatalog && (
            <span className="ml-auto text-2xs text-led-text">Pacote pré-selecionado</span>
          )}
        </div>

        {/* Step 1: Event format */}
        {step === 1 && (
          <fieldset className="flex flex-col gap-4">
            <legend className="label-caps text-ink-low">{briefing.formatLabel}</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {briefing.formats.map((item) => {
                const active = format === item;
                return (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFormat(item)}
                    className={cn(
                      'transition-quick tap flex items-center justify-between border px-4 py-3 text-left text-sm font-medium',
                      active
                        ? 'border-led bg-surface text-ink'
                        : 'border-line bg-surface/50 text-ink-muted hover:border-line-strong hover:text-ink',
                    )}
                  >
                    <span>{item}</span>
                    {active && <Icon name="check" className="size-4 text-led" />}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setStep(2)} className="w-full px-4 whitespace-nowrap sm:w-auto sm:px-6">
                Continuar: Estrutura →
              </Button>
            </div>
          </fieldset>
        )}

        {/* Step 2: Stage structure */}
        {step === 2 && (
          <fieldset className="flex flex-col gap-4">
            <legend className="label-caps text-ink-low">{briefing.packageLabel}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {briefing.packages.map((pkg) => {
                const active = packageName === pkg.name;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPackageName(pkg.name)}
                    className={cn(
                      'transition-quick tap flex flex-col items-start justify-between gap-2 border p-4 text-left',
                      active
                        ? 'border-led bg-surface text-ink'
                        : 'border-line bg-surface/50 text-ink-muted hover:border-line-strong hover:text-ink',
                    )}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-base font-semibold text-ink">{pkg.name}</span>
                      {active && <Icon name="check" className="size-4 text-led" />}
                    </div>
                    <span className="text-xs leading-relaxed text-ink-muted">{pkg.detail}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="ghost" onClick={() => setStep(1)} className="w-full sm:w-auto">
                ← Voltar
              </Button>
              <Button variant="secondary" onClick={() => setStep(3)} className="w-full px-4 whitespace-nowrap sm:w-auto sm:px-6">
                Continuar: Data e cidade →
              </Button>
            </div>
          </fieldset>
        )}

        {/* Step 3: Native date picker + flexible option + city + live preview */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor={dateInputId} className="label-caps text-ink-low">
                  {briefing.dateLabel}
                </label>
                <div className="relative flex items-center">
                  <input
                    id={dateInputId}
                    type="date"
                    value={date}
                    disabled={dateFlexible}
                    onChange={(e) => setDate(e.target.value)}
                    className="tap w-full border border-line bg-surface px-3.5 py-2.5 text-sm text-ink tabular-nums focus:border-led focus:outline-none disabled:cursor-not-allowed disabled:opacity-45"
                  />
                </div>
                <button
                  type="button"
                  aria-pressed={dateFlexible}
                  onClick={() => setDateFlexible(!dateFlexible)}
                  className={cn(
                    'transition-quick tap inline-flex items-center justify-center gap-2 border px-3 py-2 text-xs font-medium',
                    dateFlexible
                      ? 'border-led bg-surface text-led-text'
                      : 'border-line/80 text-ink-muted hover:border-line-strong hover:text-ink',
                  )}
                >
                  <Icon name="calendar" className="size-3.5" />
                  <span>Ainda não tenho data fechada</span>
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor={cityInputId} className="label-caps text-ink-low">
                  {briefing.cityLabel}
                </label>
                <input
                  id={cityInputId}
                  type="text"
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={briefing.cityPlaceholder}
                  className="tap border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-low focus:border-led focus:outline-none"
                />
                {validation.hint && (
                  <p className="text-xs leading-relaxed text-ink-low">{validation.hint}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-line pt-4">
              <div className="flex items-center justify-between gap-2">
                <span className="label-caps text-ink-low">{briefing.summaryLabel}</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="transition-quick tap inline-flex items-center gap-1.5 px-2 text-xs font-medium text-ink-muted hover:text-ink"
                >
                  <Icon name={copied ? 'check' : 'copy'} className={cn('size-3.5', copied && 'text-led')} />
                  <span>{copied ? 'Copiado!' : 'Copiar texto'}</span>
                </button>
              </div>
              <output
                aria-live="polite"
                data-testid="briefing-preview"
                className="block whitespace-pre-line border border-line/70 bg-surface/80 p-3.5 text-xs leading-relaxed text-ink-muted"
              >
                {messagePreview}
              </output>
            </div>

            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="ghost" onClick={() => setStep(2)} className="w-full sm:w-auto">
                ← Voltar
              </Button>
              <Button href={href} size="lg" className="w-full shrink-0 px-4 whitespace-nowrap sm:w-auto sm:px-7">
                <Icon name="whatsapp" className="size-4" />
                <span>{briefing.ctaConfigured}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
