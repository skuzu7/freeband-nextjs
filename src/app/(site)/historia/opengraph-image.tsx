// "/historia" — its share card: the founders' portrait, whole.
import { timeline } from '@/data/band';
import { historia } from '@/data/copy/historia';
import { images } from '@/data/media/paths';
import { ogAlt, ogCard, ogContentType, ogSize, photoBySrc } from '@/lib/og/card';

const photo = photoBySrc(
  timeline.map((era) => era.lead[0]),
  images.anos70,
);

export const alt = ogAlt(historia.seo.title, photo);
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({ title: historia.seo.title, line: historia.seo.cardLine, photo });
}
