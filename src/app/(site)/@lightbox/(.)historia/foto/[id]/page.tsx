// One photograph of the timeline inside the lightbox. The same viewer as the
// page at /historia/foto/<id>; only the way out differs.
import { photoParams } from '@/lib/gallery/metadata';
import { PhotoViewer } from '@/components/media/lightbox/PhotoViewer';

type Params = Promise<{ id: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return photoParams('historia');
}

export default async function HistoriaLightboxPhoto({ params }: { params: Params }) {
  const { id } = await params;
  return <PhotoViewer set="historia" id={id} mode="modal" />;
}
