// src/components/arquivo/Cartazes.tsx
// The poster archive. This half runs on the server: it pairs every flyer with
// its blur placeholder and its address in the photo viewer, counts what each
// filter holds, and hands the lot to CartazGrid, which owns the filter. Every
// fact printed under a flyer is transcribed from the artwork
// (src/data/media/posters.ts).
import { blurMap } from '@/data/blur';
import { arquivo, type FilterKey } from '@/data/copy/arquivo';
import { gallery, posterMeta, posterTitle } from '@/data/media/gallery';
import { posters } from '@/data/media/posters';
import { linkFor } from '@/lib/gallery/sets';
import { CartazGrid, type Cartaz } from './CartazGrid';

const cartazes: Cartaz[] = posters.map((p) => ({
  id: p.id,
  photo: { src: p.src, alt: p.alt, aspect: p.aspect },
  blur: blurMap[p.src],
  link: linkFor(gallery.arquivo, p.id),
  title: posterTitle(p),
  meta: posterMeta(p),
  municipal: p.municipal === true,
  category: p.category,
}));

const countOf = (key: FilterKey) =>
  key === 'todos' ? posters.length : posters.filter((p) => p.category === key).length;

const counts = Object.fromEntries(arquivo.filters.map((f) => [f.key, countOf(f.key)])) as Record<FilterKey, number>;

export function Cartazes() {
  return <CartazGrid cartazes={cartazes} counts={counts} />;
}
