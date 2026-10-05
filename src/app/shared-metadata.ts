// src/app/shared-metadata.ts
// The share card, in the parts every route repeats. Next merges metadata
// shallowly: a page that sets `openGraph` or `twitter` replaces the root
// layout's whole object, it does not inherit the fields it leaves out. So the
// common fields live here, and the layout and every inner page spread them
// into their own object.
import type { Metadata } from 'next';
import { bandInfo } from '@/data/band';
import { site } from '@/data/copy/site';

export const sharedOpenGraph = {
  // /og.jpg is a 1200×630 card built from the wordmark and the stage frame.
  images: [{ url: '/og.jpg', width: 1200, height: 630, alt: site.seo.ogTitle }],
  locale: 'pt_BR',
  type: 'website',
  siteName: bandInfo.name,
} satisfies Metadata['openGraph'];

export const sharedTwitter = {
  card: 'summary_large_image',
  images: ['/og.jpg'],
} satisfies Metadata['twitter'];

/** A page's `seo` copy (src/data/copy/*.ts) and its canonical path. */
interface PageSeo {
  title: string;
  description: string;
  path: string;
}

/**
 * `openGraph` and `twitter` for an inner page: the common fields under the
 * page's own title, description and canonical path. The title is composed
 * here, the way Next composes <title>, because the root layout's
 * `title.template` reaches <title> only — it is not applied to these two.
 */
export function socialMetadata({ title, description, path }: PageSeo): Pick<Metadata, 'openGraph' | 'twitter'> {
  const fullTitle = site.seo.titleTemplate.replace(/%s/g, title);
  return {
    openGraph: { ...sharedOpenGraph, title: fullTitle, description, url: path },
    twitter: { ...sharedTwitter, title: fullTitle, description },
  };
}
