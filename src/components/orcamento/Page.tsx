'use client';

// src/components/orcamento/Page.tsx
// The editor: form on the left, live A4 preview on the right, on paper. The
// header carries the way back to the site and the logout; both hide in print.
// The draft lives in this browser's localStorage, so a reload, a slip on the
// back button or an expired session does not cost the producer the proposal.
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { orcamento } from '@/data/copy/orcamento';
import { defaultOrcamento, parseOrcamento, type OrcamentoData } from '@/types/orcamento';
import { Wordmark } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Form } from './Form';
import { Preview } from './Preview';

interface PageProps {
  onLogout?: () => Promise<void>;
}

export const DRAFT_KEY = 'freeband_orcamento_draft';
const SAVE_DELAY_MS = 300;

function isDefault(data: OrcamentoData): boolean {
  return (Object.keys(defaultOrcamento) as Array<keyof OrcamentoData>).every((k) => data[k] === defaultOrcamento[k]);
}

function readDraft(): OrcamentoData | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? parseOrcamento(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeDraft(data: OrcamentoData | null): void {
  try {
    if (data === null) window.localStorage.removeItem(DRAFT_KEY);
    else window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable: the editor still works, just without a draft */
  }
}

export function Page({ onLogout }: PageProps) {
  const [data, setData] = useState<OrcamentoData>(defaultOrcamento);
  const [restored, setRestored] = useState(false);
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
    setData(defaultOrcamento);
    setRestored(false);
    writeDraft(null);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="no-print flex h-16 items-center justify-between gap-6 border-b border-line bg-surface-high px-[var(--pad-inline)]">
        <div className="flex items-center gap-5">
          <Wordmark className="h-5 w-auto text-red" title={orcamento.header.brand} />
          <span aria-hidden className="h-5 w-px bg-line-strong" />
          <h1 className="label-caps text-ink-muted">{orcamento.header.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="label-caps transition-quick px-3 py-2 text-ink-muted hover:text-ink">
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
              {dirty && (
                <Button variant="ghost" onClick={clear}>
                  {orcamento.form.clearDraft}
                </Button>
              )}
            </header>
            <p aria-live="polite" className="mb-6 min-h-[1.25em] text-sm text-ink-muted">
              {restored && orcamento.form.draftRestored}
            </p>
            <Form data={data} onChange={setData} />
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
