// "/historia/foto/<id>" — one photograph of the timeline on a page of its own:
// what a shared link, a reload or a new tab lands on. Static, one page per
// photograph; an id that is not in the set is a 404.
import type { Metadata } from 'next';
import { photoMetadata, photoParams } from '@/lib/gallery/metadata';
import { PhotoViewer } from '@/components/media/lightbox/PhotoViewer';

type Params = Promise<{ id: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return photoParams('historia');
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  return photoMetadata('historia', id);
}

export default async function HistoriaPhotoPage({ params }: { params: Params }) {
  const { id } = await params;
  return <PhotoViewer set="historia" id={id} mode="page" />;
}
