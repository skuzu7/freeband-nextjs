// "/historia" — the timeline (1969 in sepia, then four eras), the release, the names.
import type { Metadata } from 'next';
import { historia } from '@/data/copy/historia';
import { PageHeader } from '@/components/site/PageHeader';
import { Timeline } from '@/components/historia/Timeline';
import { Release } from '@/components/historia/Release';
import { Nomes } from '@/components/historia/Nomes';
import { socialMetadata } from '@/lib/seo/metadata';
import { breadcrumbs, galleryImages, imageGallery } from '@/lib/seo/jsonld';
import { gallery } from '@/data/media/gallery';
import { site } from '@/data/copy/site';
import { JsonLd } from '@/components/site/JsonLd';
import { RouteTransition } from '@/components/site/RouteTransition';

export const metadata: Metadata = {
  title: historia.seo.title,
  description: historia.seo.description,
  alternates: { canonical: '/historia' },
  ...socialMetadata({ ...historia.seo, path: '/historia' }),
};

const structured = [
  breadcrumbs([
    { name: site.nav.homeLink, path: '/' },
    { name: historia.seo.title, path: '/historia' },
  ]),
  imageGallery({ name: historia.seo.title, description: historia.seo.description, path: '/historia', images: galleryImages(gallery.historia) }),
];

export default function HistoriaPage() {
  return (
    <RouteTransition>
      <JsonLd data={structured} />
      <PageHeader id="historia-title" label={historia.label} headline={historia.headline} />
      <Timeline />
      <Release />
      <Nomes />
    </RouteTransition>
  );
}
