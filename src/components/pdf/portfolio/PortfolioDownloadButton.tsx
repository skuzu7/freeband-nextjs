'use client';

// src/components/pdf/portfolio/PortfolioDownloadButton.tsx
// The only place the site touches @react-pdf/renderer for the portfolio. One
// click builds the document in the browser and saves it. Loaded by
// PortfolioDownload through a dynamic import with ssr: false, so none of this
// reaches the server bundle.
import type { DocumentProps } from '@react-pdf/renderer';
import type { ReactElement } from 'react';
import { portfolio } from '@/data/copy/portfolio';
import { Button } from '@/components/ui/Button';
import { usePdfDownload } from '../usePdfDownload';
import { PortfolioDocument } from './PortfolioDocument';

export function PortfolioDownloadButton() {
  const { state, start } = usePdfDownload(() => ({
    document: (<PortfolioDocument />) as ReactElement<DocumentProps>,
    fileName: portfolio.fileName,
  }));
  const generating = state === 'generating';

  return (
    <div className="flex flex-col items-start gap-3">
      <Button size="lg" onClick={start} disabled={generating} aria-busy={generating}>
        {generating ? portfolio.generating : portfolio.download}
      </Button>
      <p aria-live="polite" className="min-h-[1.25em] text-sm text-ink-muted">
        {generating ? portfolio.generatingNote : state === 'error' ? portfolio.error : null}
      </p>
    </div>
  );
}
