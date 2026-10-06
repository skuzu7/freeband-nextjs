// "/historia" — the timeline (1969 in sepia, then four eras), the release, the names.
import type { Metadata } from 'next';
import { historia } from '@/data/copy/historia';
import { PageHeader } from '@/components/site/PageHeader';
import { Eras } from '@/components/historia/Eras';
import { Release } from '@/components/historia/Release';
import { Nomes } from '@/components/historia/Nomes';
import { socialMetadata } from '@/app/shared-metadata';

export const metadata: Metadata = {
  title: historia.seo.title,
  description: historia.seo.description,
  alternates: { canonical: '/historia' },
  ...socialMetadata({ ...historia.seo, path: '/historia' }),
};

export default function HistoriaPage() {
  return (
    <>
      <PageHeader id="historia-title" label={historia.label} headline={historia.headline} />
      <Eras />
      <Release />
      <Nomes />
    </>
  );
}
