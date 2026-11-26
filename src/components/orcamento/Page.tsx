'use client';

// src/components/orcamento/Page.tsx
// Proposal generator: split form + live A4 preview on desktop (>= lg), and
// clean segmented tab switch ("01. Editar" | "02. Preview A4") with a sticky
// thumb-zone footer on mobile (< lg) so producers never scroll endlessly.
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { isDefault, readDraft, writeDraft } from '@/lib/orcamentoDraft';
import { orcamento } from '@/data/copy/orcamento';
import { defaultOrcamento, type OrcamentoData } from '@/types/orcamento';
import { Wordmark } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Form } from './Form';
import { Preview } from './Preview';

interface PageProps {
  onLogout?: () => Promise<void>;
}

const SAVE_DELAY_MS = 300;
type MobileTab = 'edit' | 'preview';

export function Page({ onLogout }: PageProps) {
  const [data, setData] = useState<OrcamentoData>(defaultOrcamento);
  const [restored, setRestored] = useState(false);
  const [cleared, setCleared] = useState<OrcamentoData | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit');
  const hydrated = useRef(false);

  useEffect(() => {
    const draft = readDraft();
    if (draft && !isDefault(draft)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(draft);
      setRestored(true);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const id = window.setTimeout(() => writeDraft(isDefault(data) ? null : data), SAVE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [data]);

  const dirty = !isDefault(data);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = orcamento.form.unsavedWarning;
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const clear = () => {
    setCleared(data);
    setData(defaultOrcamento);
    setRestored(false);
    writeDraft(null);
  };

  const undoClear = () => {
    if (!cleared) return;
    setData(cleared);
    setCleared(null);
  };

  const edit = (next: OrcamentoData) => {
    setCleared(null);
    setData(next);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="no-print sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-line bg-surface-high/95 px-[var(--pad-inline)] backdrop-blur-md sm:h-16 sm:gap-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <Wordmark className="h-5 w-auto shrink-0 text-red" title={orcamento.header.brand} />
          <span aria-hidden className="hidden h-5 w-px bg-line-strong sm:block" />
          <h1 className="label-caps sr-only text-ink-muted sm:not-sr-only">{orcamento.header.title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/" className="label-caps tap transition-quick inline-flex items-center whitespace-nowrap px-3 py-2 text-ink-muted hover:text-ink">
            {orcamento.header.back}
          </Link>
          {onLogout && (
            <form action={onLogout}>
              <Button type="submit" variant="secondary">
                {orcamento.header.logout}
              </Button>
            </form>
          )}
        </div>
      </header>

      {/* Mobile segmented switcher: Edit Form vs Live A4 Preview */}
      <div
        role="tablist"
        aria-label="Modo de visualização do orçamento"
        className="no-print sticky top-14 z-20 grid grid-cols-2 border-b border-line bg-surface-high px-[var(--pad-inline)] py-2 sm:top-16 lg:hidden"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'edit'}
          onClick={() => setMobileTab('edit')}
          className={cn(
            'label-caps tap transition-quick rounded-sm px-3 text-xs',
            mobileTab === 'edit'
              ? 'bg-surface-raise font-semibold text-ink ring-1 ring-line-strong'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          01 · Editar dados
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'preview'}
          onClick={() => setMobileTab('preview')}
          className={cn(
            'label-caps tap transition-quick rounded-sm px-3 text-xs',
            mobileTab === 'preview'
              ? 'bg-surface-raise font-semibold text-ink ring-1 ring-line-strong'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          02 · Preview A4
        </button>
      </div>

      <div className="print-unclip grid flex-1 grid-cols-1 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:pb-0">
        <section
          aria-labelledby="form-title"
          className={cn(
            'no-print border-b border-line lg:block lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:border-r lg:border-b-0',
            mobileTab !== 'edit' && 'hidden',
          )}
        >
          <div className="p-[clamp(1.25rem,3vi,3rem)]">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <div>
                <Label>{orcamento.form.step}</Label>
                <h2 id="form-title" className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                  {orcamento.form.title}
                </h2>
              </div>
              <Button variant="ghost" onClick={clear} className={cn(!dirty && 'invisible')}>
                {orcamento.form.clearDraft}
              </Button>
            </header>
            <p aria-live="polite" className="mb-6 flex min-h-[1.25em] items-center gap-3 text-sm text-ink-muted">
              {cleared ? (
                <>
                  {orcamento.form.draftCleared}
                  <button
                    type="button"
                    onClick={undoClear}
                    className="label-caps transition-quick text-led-text underline underline-offset-4 hover:text-ink"
                  >
                    {orcamento.form.undoClear}
                  </button>
                </>
              ) : (
                restored && orcamento.form.draftRestored
              )}
            </p>
            <Form data={data} onChange={edit} />
          </div>
        </section>

        <section
          aria-label={orcamento.preview.label}
          className={cn(
            'print-unclip bg-surface-raise p-[clamp(1.25rem,3vi,2.5rem)] lg:block lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto',
            mobileTab !== 'preview' && 'hidden',
          )}
        >
          <Preview data={data} onPrint={() => window.print()} />
        </section>
      </div>

      {/* Mobile thumb-zone quick bar for switching to Preview or Printing */}
      <div
        className="no-print fixed inset-x-0 bottom-0 z-30 flex h-[60px] items-center gap-2.5 border-t border-line bg-surface-high/95 px-[var(--pad-inline)] backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <Button
          variant="secondary"
          onClick={() => setMobileTab(mobileTab === 'edit' ? 'preview' : 'edit')}
          className="flex-1 py-2.5 text-xs"
        >
          {mobileTab === 'edit' ? 'Ver Preview A4' : 'Voltar para Edição'}
        </Button>
        <Button onClick={() => window.print()} className="shrink-0 px-5 py-2.5 text-xs">
          {orcamento.preview.print}
        </Button>
      </div>
    </div>
  );
}
