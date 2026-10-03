'use client';

// src/components/orcamento/Page.tsx
// The editor: form on the left, live A4 preview on the right, on paper. The
// header carries the way back to the site and the logout; both hide in print.
// The draft lives in this browser's localStorage, so a reload, a slip on the
// back button or an expired session does not cost the producer the proposal.
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

export function Page({ onLogout }: PageProps) {
  const [data, setData] = useState<OrcamentoData>(defaultOrcamento);
  const [restored, setRestored] = useState(false);
  // What "Limpar formulário" threw away, until the producer types again.
  const [cleared, setCleared] = useState<OrcamentoData | null>(null);
  // Nothing is written until the stored draft has been read, so a fresh
  // render can never overwrite the draft with the empty form.
  const hydrated = useRef(false);

  useEffect(() => {
    const draft = readDraft();
    if (draft && !isDefault(draft)) {
      // The draft exists only in this browser: reading it in the state
      // initialiser would render HTML the server never sent. After
      // hydration is the one place it can be picked up.
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

  // Leaving with unsaved typing asks first. The draft covers a reload, but
  // not a navigation that clears site data or a different browser.
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
      <header className="no-print flex h-16 items-center justify-between gap-4 border-b border-line bg-surface-high px-[var(--pad-inline)] sm:gap-6">
        <div className="flex min-w-0 items-center gap-5">
          <Wordmark className="h-5 w-auto shrink-0 text-red" title={orcamento.header.brand} />
          {/* On a phone the title gives its room to the two exits; it stays
              the page's heading for screen readers. */}
          <span aria-hidden className="hidden h-5 w-px bg-line-strong sm:block" />
          <h1 className="label-caps sr-only text-ink-muted sm:not-sr-only">{orcamento.header.title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/" className="label-caps transition-quick whitespace-nowrap px-3 py-2 text-ink-muted hover:text-ink">
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

      <div className="print-unclip grid flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section
          aria-labelledby="form-title"
          className="no-print border-b border-line lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:border-r lg:border-b-0"
        >
          <div className="p-[clamp(1.5rem,3vi,3rem)]">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <div>
                <Label dot>{orcamento.form.step}</Label>
                <h2 id="form-title" className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                  {orcamento.form.title}
                </h2>
              </div>
              {/* Always laid out, hidden while there is nothing to clear: on a
                  phone it wraps to its own line, and appearing on the first
                  keystroke would shove the form down under the finger. */}
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
          className="print-unclip bg-surface-raise p-[clamp(1.25rem,3vi,2.5rem)] lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto"
        >
          <Preview data={data} onPrint={() => window.print()} />
        </section>
      </div>
    </div>
  );
}
