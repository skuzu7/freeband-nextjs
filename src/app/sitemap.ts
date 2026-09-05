import type { MetadataRoute } from 'next';
import { contact } from '@/data/contact';

// Only the public routes. /admin and /orcamento are access-controlled and
// already disallowed in robots.ts — listing them here would be an invitation.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = contact.siteUrl;
  return [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/palco`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/arquivo`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/historia`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${base}/portfolio`, changeFrequency: 'yearly', priority: 0.5 },
  ];
}
