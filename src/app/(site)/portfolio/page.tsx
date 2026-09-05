// "/portfolio" — the public download of the portfolio PDF. The button is the
// only thing on the site that touches @react-pdf/renderer, and it arrives
// through a client-only dynamic import.
import type { Metadata } from 'next';
import { portfolio } from '@/data/copy/portfolio';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { PortfolioDownload } from '@/components/pdf/portfolio/PortfolioDownload';

export const metadata: Metadata = {
  title: portfolio.seo.title,
  description: portfolio.seo.description,
  alternates: { canonical: '/portfolio' },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHeader id="portfolio-title" label={portfolio.label} headline={portfolio.headline} lead={portfolio.lead} />
      <Container className="flex flex-wrap items-center gap-4 pb-[var(--section-gap)]">
        <PortfolioDownload />
        <Button variant="ghost" href="/">
          {portfolio.back}
        </Button>
      </Container>
    </>
  );
}
