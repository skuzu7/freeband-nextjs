'use client';

// src/components/home/BriefingBuilder.tsx
// Interactive zero-backend event briefing configurator for WhatsApp conversion.
// Buyers pick event format, stage package, target date and city/state, and
// open WhatsApp with the technical briefing pre-filled.
import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { buildBriefingMessage, whatsappBriefingLink } from '@/data/briefing';
import { data } from '@/data/copy/home';
import { DotGrid } from '@/components/brand/DotGrid';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

export function BriefingBuilder() {
  const { briefing } = data;
  const [format, setFormat] = useState<string>(briefing.formats[0]);
  const [packageName, setPackageName] = useState<string>(briefing.packages[0].name);
  const [date, setDate] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const dateInputId = useId();
  const cityInputId = useId();

  const selection = { format, packageName, date, city };
  const messagePreview = buildBriefingMessage(selection);
  const href = whatsappBriefingLink(selection);

  return (
    <div className="rise relative isolate border border-line bg-surface-raise p-6 md:p-8">
      <DotGrid fade className="opacity-50" />
      <div className="relative z-10 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <Label dot>{briefing.badge}</Label>
          <p className="text-xl font-semibold tracking-tight text-ink">{briefing.title}</p>
          <p className="text-sm text-ink-muted">{briefing.subtitle}</p>
        </header>

        <fieldset className="flex flex-col gap-2.5">
          <legend className="label-caps text-ink-low">{briefing.formatLabel}</legend>
          <div className="mt-1 flex flex-wrap gap-2">
            {briefing.formats.map((item) => {
              const active = format === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFormat(item)}
                  className={cn(
                    'transition-quick tap inline-flex items-center gap-2 border px-3.5 py-2 text-xs font-semibold',
                    active
                      ? 'border-led bg-surface text-led-text'
                      : 'border-line bg-surface/60 text-ink-muted hover:border-line-strong hover:text-ink',
                  )}
                >
                  <i
                    aria-hidden
                    className={cn('size-1.5 shrink-0 rounded-pill', active ? 'bg-led' : 'bg-ink-low/50')}
                  />
                  {item}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2.5">
          <legend className="label-caps text-ink-low">{briefing.packageLabel}</legend>
          <div className="mt-1 grid gap-2.5 sm:grid-cols-2">
            {briefing.packages.map((pkg) => {
              const active = packageName === pkg.name;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPackageName(pkg.name)}
                  className={cn(
                    'transition-quick tap flex flex-col items-start gap-1 border p-3.5 text-left',
                    active
                      ? 'border-led bg-surface text-ink'
                      : 'border-line bg-surface/60 text-ink-muted hover:border-line-strong hover:text-ink',
                  )}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <i
                      aria-hidden
                      className={cn('size-1.5 shrink-0 rounded-pill', active ? 'bg-led' : 'bg-ink-low/50')}
                    />
                    {pkg.name}
                  </span>
                  <span className="text-xs text-ink-muted">{pkg.detail}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor={dateInputId} className="label-caps text-ink-low">
              {briefing.dateLabel}
            </label>
            <input
              id={dateInputId}
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder={briefing.datePlaceholder}
              className="tap border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-low focus:border-led focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor={cityInputId} className="label-caps text-ink-low">
              {briefing.cityLabel}
            </label>
            <input
              id={cityInputId}
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={briefing.cityPlaceholder}
              className="tap border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-low focus:border-led focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="label-caps text-ink-low">{briefing.summaryLabel}</span>
            <output
              aria-live="polite"
              data-testid="briefing-preview"
              className="whitespace-pre-line text-xs text-ink-muted"
            >
              {messagePreview}
            </output>
          </div>
          <Button href={href} size="lg" className="w-full shrink-0 sm:w-auto">
            <svg viewBox="0 0 24 24" className="size-[1.1em] shrink-0" fill="currentColor" aria-hidden>
              <path d="M12 2.5A9.5 9.5 0 0 0 3.8 16.7L2.5 21.5l4.9-1.3A9.5 9.5 0 1 0 12 2.5Zm0 1.8a7.7 7.7 0 1 1-3.9 14.3l-.3-.2-2.9.8.8-2.8-.2-.3A7.7 7.7 0 0 1 12 4.3Zm-3 3.9c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.7.5-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.2-.2-.5-.3l-1.8-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5.3-.5c.1-.2 0-.3 0-.5L10 8.6c-.2-.4-.4-.4-.6-.4H9Z" />
            </svg>
            <span>{briefing.ctaConfigured}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
