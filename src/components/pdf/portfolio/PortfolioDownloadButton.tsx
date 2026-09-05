'use client';

// src/components/pdf/portfolio/PortfolioDownloadButton.tsx
// The only place the site touches @react-pdf/renderer for the portfolio. The
// document is built in the browser on demand; the first click prepares it,
// the link then downloads it. Loaded by PortfolioDownload through a dynamic
// import with ssr: false, so none of this reaches the server bundle.
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import { portfolio } from '@/data/copy/portfolio';
import { Button } from '@/components/ui/Button';
import { PortfolioDocument } from './PortfolioDocument';

const linkClass =
  'inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-red px-7 py-4 text-base font-medium uppercase tracking-wide text-on-red transition-quick select-none hover:bg-red-hot';

export function PortfolioDownloadButton() {
  const [requested, setRequested] = useState(false);

  if (!requested) {
    return (
      <Button size="lg" onClick={() => setRequested(true)}>
        {portfolio.prepare}
      </Button>
    );
  }

  return (
    <PDFDownloadLink document={<PortfolioDocument />} fileName={portfolio.fileName} className={linkClass}>
      {({ loading }) => (
        <span className={cn(loading && 'opacity-70')}>{loading ? portfolio.generating : portfolio.download}</span>
      )}
    </PDFDownloadLink>
  );
}
