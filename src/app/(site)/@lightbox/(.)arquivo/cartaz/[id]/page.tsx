// One photograph of the "arquivo" set inside the lightbox. The same viewer as
// the page at /arquivo/cartaz/<id>; only the way out differs.
import { photoParams } from '@/lib/gallery/metadata';
import { PhotoViewer } from '@/components/media/lightbox/PhotoViewer';

type Params = Promise<{ id: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return photoParams('arquivo');
}

export default async function ArquivoLightboxPhoto({ params }: { params: Params }) {
  const { id } = await params;
  return <PhotoViewer set="arquivo" id={id} mode="modal" />;
}
