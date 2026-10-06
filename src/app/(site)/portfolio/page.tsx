// "/portfolio" — the public download of the portfolio PDF. The button is the
// only thing on the site that touches @react-pdf/renderer, and it arrives
// through a client-only dynamic import.
import type { Metadata } from 'next';
import { portfolio } from '@/data/copy/portfolio';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { PortfolioDownload } from '@/components/pdf/portfolio/PortfolioDownload';
import { socialMetadata } from '@/lib/seo/metadata';
import { breadcrumbs } from '@/lib/seo/jsonld';
import { site } from '@/data/copy/site';
import { JsonLd } from '@/components/site/JsonLd';
import { RouteTransition } from '@/components/site/RouteTransition';

export const metadata: Metadata = {
  title: portfolio.seo.title,
  description: portfolio.seo.description,
  alternates: { canonical: '/portfolio' },
  ...socialMetadata({ ...portfolio.seo, path: '/portfolio' }),
};

const trail = breadcrumbs([
  { name: site.nav.homeLink, path: '/' },
  { name: portfolio.seo.title, path: '/portfolio' },
]);

export default function PortfolioPage() {
  return (
    <RouteTransition>
      <JsonLd data={trail} />
      <PageHeader id="portfolio-title" label={portfolio.label} headline={portfolio.headline} lead={portfolio.lead} />
      <Container className="flex flex-wrap items-center gap-4 pb-[var(--section-gap)]">
        <PortfolioDownload />
        <Button variant="ghost" href="/">
          {portfolio.back}
        </Button>
      </Container>
    </RouteTransition>
  );
}
