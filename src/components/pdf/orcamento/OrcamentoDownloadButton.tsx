'use client';

// src/components/pdf/orcamento/OrcamentoDownloadButton.tsx
// The only place the site touches @react-pdf/renderer for the proposal.
// Preview loads it through a dynamic import with ssr: false, so the PDF
// toolkit never enters the server bundle.
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { orcamento } from '@/data/copy/orcamento';
import type { OrcamentoData } from '@/types/orcamento';
import { OrcamentoPdf } from './OrcamentoPdf';

const linkClass =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-red px-5 py-3 text-sm font-medium uppercase tracking-wide text-on-red transition-quick select-none hover:bg-red-hot';

interface OrcamentoDownloadButtonProps {
  data: OrcamentoData;
}

export function OrcamentoDownloadButton({ data }: OrcamentoDownloadButtonProps) {
  const holder = useRef<HTMLSpanElement>(null);
  // This replaces the "Gerar PDF" button the producer just pressed: keyboard
  // focus moves onto the link, so the next Enter downloads.
  useEffect(() => {
    holder.current?.querySelector('a')?.focus();
  }, []);
  return (
    <span ref={holder} className="contents">
      <PDFDownloadLink
        document={<OrcamentoPdf data={data} />}
        fileName={orcamento.preview.fileName(data.contratante)}
        className={linkClass}
        aria-live="polite"
      >
        {({ loading }) => (
          <span className={cn(loading && 'opacity-70')}>
            {loading ? orcamento.preview.generating : orcamento.preview.download}
          </span>
        )}
      </PDFDownloadLink>
    </span>
  );
}
