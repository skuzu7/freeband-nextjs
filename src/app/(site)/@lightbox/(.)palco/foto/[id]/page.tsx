// One photograph of the "palco" set inside the lightbox. The same viewer as
// the page at /palco/foto/<id>; only the way out differs.
import { photoParams } from '@/lib/gallery/metadata';
import { PhotoViewer } from '@/components/media/lightbox/PhotoViewer';

type Params = Promise<{ id: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return photoParams('palco');
}

export default async function PalcoLightboxPhoto({ params }: { params: Params }) {
  const { id } = await params;
  return <PhotoViewer set="palco" id={id} mode="modal" />;
}
