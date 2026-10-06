// "/arquivo/cartaz/<id>" — one photograph of the "arquivo" set on a page of its own:
// what a shared link, a reload or a new tab lands on. Static, one page per
// photograph; an id that is not in the set is a 404.
import type { Metadata } from 'next';
import { photoMetadata, photoParams } from '@/lib/gallery/metadata';
import { PhotoViewer } from '@/components/media/lightbox/PhotoViewer';

type Params = Promise<{ id: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return photoParams('arquivo');
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return photoMetadata('arquivo', id);
}

export default async function ArquivoPhotoPage({ params }: { params: Params }) {
  const { id } = await params;
  return <PhotoViewer set="arquivo" id={id} mode="page" />;
}
