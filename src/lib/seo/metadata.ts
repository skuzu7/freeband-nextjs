// src/lib/seo/metadata.ts
// The share card's metadata, in the parts every route repeats. Next merges
// metadata shallowly: a page that sets `openGraph` or `twitter` replaces the
// root layout's whole object, it does not inherit the fields it leaves out.
// So the common fields live here, and the layout and every page spread them
// into their own object.
//
// No object built here names an image. Each route's picture is the
// opengraph-image.tsx beside its page (drawn by src/lib/og/card.tsx): Next
// adds og:image from that file, with its size, type and alt, and copies it to
// twitter:image when the route has no twitter-image of its own. It only does
// so while the same segment's metadata leaves `images` unset — an `images`
// key here would win over the file and bring one picture back to every route.
import type { Metadata } from 'next';
import { bandInfo } from '@/data/band';
import { site } from '@/data/copy/site';

export const sharedOpenGraph = {
  locale: 'pt_BR',
  type: 'website',
  siteName: bandInfo.name,
} satisfies Metadata['openGraph'];

export const sharedTwitter = {
  card: 'summary_large_image',
} satisfies Metadata['twitter'];

/** A page's `seo` copy (src/data/copy/*.ts) and its canonical path. */
interface PageSeo {
  title: string;
  description: string;
  path: string;
}

type Social = Pick<Metadata, 'openGraph' | 'twitter'>;

/**
 * `openGraph` and `twitter` for an inner page: the common fields under the
 * page's own title, description and canonical path. The title is composed
 * here, the way Next composes <title>, because the root layout's
 * `title.template` reaches <title> only — it is not applied to these two.
 */
export function socialMetadata({ title, description, path }: PageSeo): Social {
  const fullTitle = site.seo.titleTemplate.replace(/%s/g, title);
  return {
    openGraph: { ...sharedOpenGraph, title: fullTitle, description, url: path },
    twitter: { ...sharedTwitter, title: fullTitle, description },
  };
}

/**
 * The home's card. The root layout exports it without a URL, as the default
 * for the routes that set no card of their own (/admin, /orcamento); the home
 * page exports it again with its canonical path, and that is what puts og:url
 * on "/" without stamping the home's address on every other route.
 */
export function homeSocialMetadata(path?: string): Social {
  const { ogTitle: title, ogDescription: description } = site.seo;
  return {
    openGraph: { ...sharedOpenGraph, title, description, ...(path ? { url: path } : {}) },
    twitter: { ...sharedTwitter, title, description },
  };
}

/**
 * Where Next serves src/app/(site)/opengraph-image.tsx, for whatever needs
 * the home's card as a plain URL (the structured data in the root layout).
 * A metadata file inside a route group is published under its file name plus
 * a hash of the group's path, so that `(a)/opengraph-image` and
 * `(b)/opengraph-image` cannot collide. The hash changes only if the
 * `(site)` folder is renamed; src/app/__tests__/metadata.test.ts compares
 * this constant with what the installed Next computes.
 */
export const HOME_OG_IMAGE_PATH = '/opengraph-image-12o0cb';
