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
    loading: () => (
      <Button size="lg" disabled>
        {portfolio.prepare}
      </Button>
    ),
  },
);

export function PortfolioDownload() {
  return <PortfolioDownloadButton />;
}
