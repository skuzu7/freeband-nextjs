// src/lib/gallery/metadata.ts
// What a photograph's own address says about itself: the caption as the
// title, the description of the picture, and the photograph itself as the
// share image. Only the page at that address exports it: opened in the
// lightbox, the same URL keeps the head of the gallery underneath.
import type { Metadata } from 'next';
import { site } from '@/data/copy/site';
import { gallery, type GalleryKey } from '@/data/media/gallery';
import { sharedOpenGraph, sharedTwitter } from '@/lib/seo/metadata';
import { findItem, hrefFor, naturalSize } from './sets';

/** One `{ id }` per photograph of the set, for `generateStaticParams`. */
export function photoParams(key: GalleryKey): { id: string }[] {
  return gallery[key].items.map(({ id }) => ({ id }));
}

export function photoMetadata(key: GalleryKey, id: string): Metadata {
  const set = gallery[key];
  const item = findItem(set, id);
  if (!item) return {};
  const path = hrefFor(set, item.id);
  const { width, height } = naturalSize(item.aspect);
  // The root layout's title template reaches <title> only, so the card's
  // title is composed here the same way (see src/lib/seo/metadata.ts).
  const cardTitle = site.seo.titleTemplate.replace(/%s/g, item.caption);
  return {
    title: item.caption,
    description: item.alt,
    alternates: { canonical: path },
    // A single photograph is a door into the gallery, not a page to rank:
    // the gallery is indexed, this is followed.
    robots: { index: false, follow: true },
    // `images` is set on purpose: the shared fields name no picture, and the
    // gallery's own opengraph-image must not stand in for the photograph.
    openGraph: {
      ...sharedOpenGraph,
      title: cardTitle,
      description: item.alt,
      url: path,
      images: [{ url: item.src, width, height, alt: item.alt }],
    },
    twitter: { ...sharedTwitter, title: cardTitle, description: item.alt, images: [item.src] },
  };
}
