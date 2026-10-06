// "/arquivo" — its share card: one flyer of the archive, whole — a city hall's
// New Year's Eve with the band's name on it.
import { arquivo } from '@/data/copy/arquivo';
import { images } from '@/data/media/paths';
import { posters } from '@/data/media/posters';
import { ogAlt, ogCard, ogContentType, ogSize, photoBySrc } from '@/lib/og/card';

const photo = photoBySrc(posters, images.reveillomParanapanema);

export const alt = ogAlt(arquivo.seo.title, photo);
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({ title: arquivo.seo.title, line: arquivo.seo.cardLine, photo });
}
