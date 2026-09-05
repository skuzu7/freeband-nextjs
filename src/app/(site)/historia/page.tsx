// "/historia" — 1969 in sepia, five eras, the release, the names.
import type { Metadata } from 'next';
import { historia } from '@/data/copy/historia';
import { PageHeader } from '@/components/site/PageHeader';
import { Capitulo1969 } from '@/components/historia/Capitulo1969';
import { Eras } from '@/components/historia/Eras';
import { Release } from '@/components/historia/Release';
import { Nomes } from '@/components/historia/Nomes';

export const metadata: Metadata = {
  title: historia.seo.title,
  description: historia.seo.description,
  alternates: { canonical: '/historia' },
};

export default function HistoriaPage() {
  return (
    <>
      <PageHeader id="historia-title" label={historia.label} headline={historia.headline} />
      <Capitulo1969 />
      <Eras />
      <Release />
      <Nomes />
    </>
  );
}
