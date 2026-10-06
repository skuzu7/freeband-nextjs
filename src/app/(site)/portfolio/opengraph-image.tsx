// "/portfolio" — its share card: the lead vocal under stage light, the frame
// that opens the first act on /palco.
import { portfolio } from '@/data/copy/portfolio';
import { stageFrames } from '@/data/media/frames';
import { images } from '@/data/media/paths';
import { ogAlt, ogCard, ogContentType, ogSize, photoBySrc } from '@/lib/og/card';

const photo = photoBySrc(stageFrames, images.vocalDouradoPalco);

export const alt = ogAlt(portfolio.seo.title, photo);
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogCard({ title: portfolio.seo.title, line: portfolio.seo.cardLine, photo });
}
