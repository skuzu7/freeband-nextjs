// src/lib/seo/jsonld.ts
// Structured data for search, built from the same data modules as the visible
// copy so the two cannot disagree. Pure functions returning plain objects;
// components/site/JsonLd.tsx serialises them. Every claim here is one the
// page already makes in text — nothing is stated for search engines only.
import { bandInfo, releaseShort } from '@/data/band';
import { contact } from '@/data/contact';
import type { GallerySet } from '@/data/media/gallery';
import type { VideoClip } from '@/data/media/videos';
import { hrefFor } from '@/lib/gallery/sets';

const SITE = contact.siteUrl;
const BAND_ID = `${SITE}/#banda`;
const SITE_ID = `${SITE}/#site`;

/** An absolute URL for a path on the site. */
export function absolute(path: string): string {
  return path.startsWith('http') ? path : `${SITE}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** "Trabiju/SP" → the two parts a postal address wants. */
function locality(city: string): { addressLocality: string; addressRegion?: string } {
  const [addressLocality, addressRegion] = city.split('/');
  return addressRegion ? { addressLocality, addressRegion } : { addressLocality };
}

/** The band. `image` is a path or URL of a picture that represents it. */
export function musicGroup(image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': BAND_ID,
    name: bandInfo.name,
    alternateName: 'Freeband',
    legalName: bandInfo.legalName,
    description: releaseShort,
    foundingDate: String(bandInfo.founded),
    foundingLocation: { '@type': 'City', name: bandInfo.foundedCity },
    founder: { '@type': 'Person', name: bandInfo.founder },
    url: SITE,
    logo: absolute('/icon.svg'),
    ...(image ? { image: absolute(image) } : {}),
    email: contact.email,
    telephone: contact.phoneIntl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.address,
      ...locality(contact.city),
      addressCountry: 'BR',
    },
    sameAs: [contact.instagramUrl],
  };
}

export function webSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE,
    name: bandInfo.name,
    inLanguage: 'pt-BR',
    publisher: { '@id': BAND_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

/** The trail from the home to the current page, in order. */
export function breadcrumbs(trail: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  /** Page of this one photograph, when it has one. */
  path?: string;
}

/** A gallery set as the list of photographs `imageGallery` takes, each with its own page. */
export function galleryImages(set: GallerySet): GalleryImage[] {
  return set.items.map((item) => ({ src: item.src, alt: item.alt, caption: item.caption, path: hrefFor(set, item.id) }));
}

/** A page that is a set of photographs. */
export function imageGallery(page: { name: string; description: string; path: string; images: GalleryImage[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: page.name,
    description: page.description,
    url: absolute(page.path),
    about: { '@id': BAND_ID },
    image: page.images.map((image) => ({
      '@type': 'ImageObject',
      contentUrl: absolute(image.src),
      description: image.alt,
      ...(image.caption ? { caption: image.caption } : {}),
      ...(image.path ? { url: absolute(image.path) } : {}),
    })),
  };
}

/** Seconds as an ISO 8601 duration, e.g. 83.4 → "PT1M23S". */
export function isoDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `PT${m ? `${m}M` : ''}${s || !m ? `${s}S` : ''}`;
}

/** A clip of src/data/media/videos.ts. The file named is the last source: the one every browser plays. */
export function videoObject(clip: Pick<VideoClip, 'title' | 'description' | 'sources' | 'poster' | 'duration' | 'uploaded'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: clip.title,
    description: clip.description,
    contentUrl: absolute(clip.sources[clip.sources.length - 1].src),
    thumbnailUrl: absolute(clip.poster),
    duration: isoDuration(clip.duration),
    uploadDate: clip.uploaded,
    inLanguage: 'pt-BR',
    creator: { '@id': BAND_ID },
  };
}

/**
 * JSON for a <script type="application/ld+json">. `<` is escaped so no string
 * in the data can close the script element (the XSS the Next.js guide warns of).
 */
export function serialise(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
