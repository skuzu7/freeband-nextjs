// "/arquivo" — the flyer archive with its category filter and lightbox.
import type { Metadata } from 'next';
import { arquivo } from '@/data/copy/arquivo';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { Cartazes } from '@/components/arquivo/Cartazes';

export const metadata: Metadata = {
  title: arquivo.seo.title,
  description: arquivo.seo.description,
  alternates: { canonical: '/arquivo' },
};

export default function ArquivoPage() {
  return (
    <>
      <PageHeader id="arquivo-title" label={arquivo.label} headline={arquivo.headline} lead={arquivo.lead} />
      <Container className="pb-[var(--section-gap)]">
        <Cartazes />
      </Container>
    </>
  );
}
