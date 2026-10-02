'use client';

// src/components/pdf/portfolio/PortfolioDownload.tsx
// The one door between the page and @react-pdf/renderer. `ssr: false` is only
// legal inside a Client Component (Next 16 lazy-loading guide), so this
// wrapper exists to hold it; the server never sees the PDF module graph.
import dynamic from 'next/dynamic';
import { portfolio } from '@/data/copy/portfolio';
import { Button } from '@/components/ui/Button';

const PortfolioDownloadButton = dynamic(
  () => import('./PortfolioDownloadButton').then((m) => m.PortfolioDownloadButton),
  {
    ssr: false,
    // Same box as the loaded button, so nothing moves when the module lands.
    loading: () => (
      <div className="flex flex-col items-start gap-3">
        <Button size="lg" disabled aria-busy>
          {portfolio.prepare}
        </Button>
        <p className="min-h-[1.25em] text-sm" />
      </div>
    ),
  },
);

export function PortfolioDownload() {
  return <PortfolioDownloadButton />;
}
