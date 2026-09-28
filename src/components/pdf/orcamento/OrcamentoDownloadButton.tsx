'use client';

// src/components/pdf/orcamento/OrcamentoDownloadButton.tsx
// The only place the site touches @react-pdf/renderer for the proposal.
// Preview loads it through a dynamic import with ssr: false, only after the
// producer presses "Gerar PDF", so the PDF toolkit never enters the server
// bundle nor the editor's first load. That press is also the download: the
// component starts the first file on mount, and every later press builds a
// fresh one from what the form holds at that moment.
import { useEffect, useRef } from 'react';
import { orcamento } from '@/data/copy/orcamento';
import type { OrcamentoData } from '@/types/orcamento';
import { Button } from '@/components/ui/Button';
import { usePdfDownload } from '../usePdfDownload';
import { OrcamentoPdf } from './OrcamentoPdf';

interface OrcamentoDownloadButtonProps {
  data: OrcamentoData;
}

export function OrcamentoDownloadButton({ data }: OrcamentoDownloadButtonProps) {
  const { state, start } = usePdfDownload(
    () => ({
      document: <OrcamentoPdf data={data} />,
      fileName: orcamento.preview.fileName(data.contratante),
    }),
    { autoStart: true },
  );
  const generating = state === 'generating';

  // This replaces the "Gerar PDF" button the producer just pressed: keyboard
  // focus moves onto it, so the next Enter builds the next file. It stays
  // focusable while busy (aria-disabled, not disabled); the hook ignores
  // presses until the current file is out.
  const holder = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    holder.current?.querySelector('button')?.focus();
  }, []);

  return (
    <span ref={holder} className="contents">
      <Button
        onClick={start}
        aria-disabled={generating}
        aria-busy={generating}
        title={state === 'error' ? orcamento.preview.error : undefined}
        className={generating ? 'cursor-progress opacity-70' : undefined}
      >
        {generating
          ? orcamento.preview.generating
          : state === 'error'
            ? orcamento.preview.retry
            : orcamento.preview.generate}
      </Button>
    </span>
  );
}
