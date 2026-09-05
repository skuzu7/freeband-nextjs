'use client';

// src/components/orcamento/Page.tsx
// The editor: form on the left, live A4 preview on the right, on paper. The
// header carries the way back to the site and the logout; both hide in print.
import Link from 'next/link';
import { useState } from 'react';
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

export function Page({ onLogout }: PageProps) {
  const [data, setData] = useState<OrcamentoData>(defaultOrcamento);

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
            <header className="mb-8 border-b border-line pb-5">
              <Label dot>{orcamento.form.step}</Label>
              <h2 id="form-title" className="mt-3 text-2xl font-semibold tracking-tight text-ink">
                {orcamento.form.title}
              </h2>
            </header>
            <Form data={data} onChange={setData} />
          </div>
        </section>
        <section
          aria-label={orcamento.preview.step}
          className="print-unclip bg-surface-raise p-[clamp(1.25rem,3vi,2.5rem)] lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto"
        >
          <Preview data={data} onPrint={() => window.print()} />
        </section>
      </div>
    </div>
  );
}
