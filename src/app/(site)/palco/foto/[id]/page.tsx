// "/palco/foto/<id>" — one photograph of the "palco" set on a page of its own:
// what a shared link, a reload or a new tab lands on. Static, one page per
// photograph; an id that is not in the set is a 404.
import type { Metadata } from 'next';
import { photoMetadata, photoParams } from '@/lib/gallery/metadata';
import { PhotoViewer } from '@/components/media/lightbox/PhotoViewer';

type Params = Promise<{ id: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return photoParams('palco');
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return photoMetadata('palco', id);
}

export default async function PalcoPhotoPage({ params }: { params: Params }) {
  const { id } = await params;
  return <PhotoViewer set="palco" id={id} mode="page" />;
}
