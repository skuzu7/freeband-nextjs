'use client';

// src/components/pdf/portfolio/PortfolioDownloadButton.tsx
// Placeholder until phase 6 wires @react-pdf/renderer in. Same path, same
// named export, so the dynamic import in PortfolioDownload does not change
// when the real button lands. Disabled: there is no PDF to hand out yet.
import { portfolio } from '@/data/copy/portfolio';
import { Button } from '@/components/ui/Button';

export function PortfolioDownloadButton() {
  return (
    <Button size="lg" disabled>
      {portfolio.prepare}
    </Button>
  );
}
