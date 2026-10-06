// "/arquivo" — the flyer archive with its category filter and lightbox.
import type { Metadata } from 'next';
import { arquivo } from '@/data/copy/arquivo';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/site/PageHeader';
import { Cartazes } from '@/components/arquivo/Cartazes';
import { socialMetadata } from '@/lib/seo/metadata';
import { breadcrumbs, galleryImages, imageGallery } from '@/lib/seo/jsonld';
import { site } from '@/data/copy/site';
import { gallery } from '@/data/media/gallery';
import { JsonLd } from '@/components/site/JsonLd';
import { RouteTransition } from '@/components/site/RouteTransition';

export const metadata: Metadata = {
  title: arquivo.seo.title,
  description: arquivo.seo.description,
  alternates: { canonical: '/arquivo' },
  ...socialMetadata({ ...arquivo.seo, path: '/arquivo' }),
};

const structured = [
  breadcrumbs([
    { name: site.nav.homeLink, path: '/' },
    { name: arquivo.seo.title, path: '/arquivo' },
  ]),
  imageGallery({ name: arquivo.seo.title, description: arquivo.seo.description, path: '/arquivo', images: galleryImages(gallery.arquivo) }),
];

export default function ArquivoPage() {
  return (
    <RouteTransition>
      <JsonLd data={structured} />
      <PageHeader id="arquivo-title" label={arquivo.label} headline={arquivo.headline} lead={arquivo.lead} />
      <Container className="pb-[var(--section-gap)]">
        <Cartazes />
      </Container>
    </RouteTransition>
  );
}
