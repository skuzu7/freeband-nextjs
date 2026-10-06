// "/palco" — its share card: the whole band in front of the LED panel.
import { palco } from '@/data/copy/palco';
import { stageFrames } from '@/data/media/frames';
import { images } from '@/data/media/paths';
import { ogAlt, ogCard, ogContentType, ogSize, photoBySrc } from '@/lib/og/card';

const photo = photoBySrc(stageFrames, images.nauticoBandaTriangulo);

export const alt = ogAlt(palco.seo.title, photo);
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({ title: palco.seo.title, line: palco.seo.cardLine, photo });
}
