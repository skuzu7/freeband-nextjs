// "/" — the home's share card: the name in red acrylic on the lit wall, no
// photograph. Drawn by src/lib/og/card.tsx, prerendered at build time.
import { site } from '@/data/copy/site';
import { ogCard, ogContentType, ogSize } from '@/lib/og/card';

export const alt = site.seo.cardAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({ title: site.seo.cardTitle, line: site.seo.cardLine });
}
