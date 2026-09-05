'use client';

// src/components/orcamento/Preview.tsx
// The A4 page scaled to its column with container-query units (no JS), plus
// Print and Gerar PDF. The PDF toolkit sits behind OrcamentoDownloadButton and
// a client-only dynamic import, so it never enters the SSR module graph.
import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { orcamento } from '@/data/copy/orcamento';
import type { OrcamentoData } from '@/types/orcamento';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { PrintLayout } from './PrintLayout';

const OrcamentoDownloadButton = dynamic(
  () => import('@/components/pdf/orcamento/OrcamentoDownloadButton').then((m) => m.OrcamentoDownloadButton),
  {
    ssr: false,
    loading: () => <Button disabled>{orcamento.preview.generating}</Button>,
  },
);

interface PreviewProps {
  data: OrcamentoData;
  onPrint: () => void;
}

// 210mm wide document, scaled down to the container's width; at 1 when the
// column is wider than the page.
const sheetStyle = {
  transform: 'scale(var(--preview-scale, 1))',
  transformOrigin: 'top left',
  height: 'calc(297mm * var(--preview-scale, 1))',
  '--preview-scale': 'min(1, calc(100cqw / 210mm))',
} as CSSProperties;

export function Preview({ data, onPrint }: PreviewProps) {
  const [pdfRequested, setPdfRequested] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Label dot>{orcamento.preview.step}</Label>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onPrint}>
            {orcamento.preview.print}
          </Button>
          {pdfRequested ? (
            <OrcamentoDownloadButton data={data} />
          ) : (
            <Button onClick={() => setPdfRequested(true)}>{orcamento.preview.generate}</Button>
          )}
        </div>
      </div>

      <div
        className="print-unclip overflow-hidden border border-line bg-surface-high shadow-[0_24px_60px_-28px_oklch(20%_0.03_262/0.45)]"
        style={{ containerType: 'inline-size' }}
      >
        <div className="print-scale-reset w-[210mm] max-w-none" style={sheetStyle}>
          <PrintLayout data={data} />
        </div>
      </div>
    </div>
  );
}
