import type { MetadataRoute } from 'next';
import { contact } from '@/data/contact';
import { gallery } from '@/data/media/gallery';
import { videos } from '@/data/media/videos';

// Only the public routes. /admin and /orcamento are access-controlled and
// already disallowed in robots.ts — listing them here would be an invitation.
// The page of a single photograph is not listed either (it is noindex): its
// picture is declared under the gallery it belongs to.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = contact.siteUrl;
  const images = (key: keyof typeof gallery) => gallery[key].items.map((item) => `${base}${item.src}`);
  return [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
    {
      url: `${base}/palco`,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: images('palco'),
      videos: videos.map((clip) => ({
        title: clip.title,
        description: clip.description,
        thumbnail_loc: `${base}${clip.poster}`,
        // The H.264 file: the one any crawler can open.
        content_loc: `${base}${clip.sources[clip.sources.length - 1].src}`,
        duration: Math.round(clip.duration),
      })),
    },
    { url: `${base}/arquivo`, changeFrequency: 'monthly', priority: 0.7, images: images('arquivo') },
    { url: `${base}/historia`, changeFrequency: 'yearly', priority: 0.6, images: images('historia') },
    { url: `${base}/portfolio`, changeFrequency: 'yearly', priority: 0.5 },
  ];
}
