// @vitest-environment node
//
// What a link to each page shows when it is shared. Next merges metadata
// shallowly: a page that sets `openGraph` or `twitter` replaces the root
// layout's whole object, it does not inherit the fields it leaves out. So
// every page has to name itself (title, description, URL) and still carry the
// rest of the home's card (locale, type, site name).
//
// The picture is not in these objects at all. Each route has an
// opengraph-image.tsx beside its page and Next adds og:image from that file —
// but only while the same segment's metadata leaves `images` unset
// (mergeStaticMetadata in next/dist/lib/metadata/resolve-metadata.js). An
// `images` key in any object below would silently put one picture back on
// every route, which is what these tests keep from happening.
import type { Metadata } from 'next';
import { fillStaticMetadataSegment } from 'next/dist/lib/metadata/get-metadata-route';
import { describe, expect, it, vi } from 'vitest';
import { arquivo } from '@/data/copy/arquivo';
import { historia } from '@/data/copy/historia';
import { palco } from '@/data/copy/palco';
import { portfolio } from '@/data/copy/portfolio';
import { site } from '@/data/copy/site';
import { HOME_OG_IMAGE_PATH } from '@/lib/seo/metadata';
import { metadata as layout } from '../layout';
import { metadata as homePage } from '../(site)/page';
import { metadata as arquivoPage } from '../(site)/arquivo/page';
import { metadata as historiaPage } from '../(site)/historia/page';
import { metadata as palcoPage } from '../(site)/palco/page';
import { metadata as portfolioPage } from '../(site)/portfolio/page';
import * as homeImage from '../(site)/opengraph-image';
import * as arquivoImage from '../(site)/arquivo/opengraph-image';
import * as historiaImage from '../(site)/historia/opengraph-image';
import * as palcoImage from '../(site)/palco/opengraph-image';
import * as portfolioImage from '../(site)/portfolio/opengraph-image';

// next/font exists only through the Next compiler; outside it the import is
// empty and the layout module would throw before exporting its metadata.
vi.mock('next/font/google', () => ({ Outfit: () => ({ variable: '--font-outfit' }) }));

// `openGraph` and `twitter` are typed as unions over og:type and the card
// kind, which hides `type` and `card`; the assertions read plain records.
type Card = Record<string, unknown>;
const og = (m: Metadata) => (m.openGraph ?? {}) as Card;
const twitter = (m: Metadata) => (m.twitter ?? {}) as Card;

const pages = [
  { path: '/palco', seo: palco.seo, page: palcoPage, image: palcoImage },
  { path: '/arquivo', seo: arquivo.seo, page: arquivoPage, image: arquivoImage },
  { path: '/historia', seo: historia.seo, page: historiaPage, image: historiaImage },
  { path: '/portfolio', seo: portfolio.seo, page: portfolioPage, image: portfolioImage },
];

describe.each(pages)('share card of $path', ({ path, seo, page }) => {
  // The <title> Next renders for the page: the root layout's template around
  // the page's own title. The card is titled the same way.
  const { template } = layout.title as { template: string };
  const title = template.replace(/%s/g, seo.title);

  it('is titled and described as the page, not as the home', () => {
    expect(og(page).title).toBe(title);
    expect(og(page).title).toContain(seo.title);
    expect(og(page).title).not.toBe(og(layout).title);
    expect(og(page).description).toBe(seo.description);

    expect(twitter(page).title).toBe(title);
    expect(twitter(page).title).not.toBe(twitter(layout).title);
    expect(twitter(page).description).toBe(seo.description);
  });

  it('points at its own canonical URL', () => {
    expect(og(page).url).toBe(page.alternates?.canonical);
    expect(og(page).url).toMatch(new RegExp(`${path}$`));
  });

  it('keeps every other field of the home card', () => {
    for (const field of ['locale', 'type', 'siteName']) {
      expect(og(layout)[field], `layout openGraph.${field}`).toBeDefined();
      expect(og(page)[field], `openGraph.${field}`).toEqual(og(layout)[field]);
    }
    expect(twitter(layout).card, 'layout twitter.card').toBe('summary_large_image');
    expect(twitter(page).card, 'twitter.card').toEqual(twitter(layout).card);
  });
});

describe('share card of /', () => {
  it('emits og:url, at the home’s canonical address', () => {
    expect(homePage.alternates?.canonical).toBe('/');
    expect(og(homePage).url).toBe(homePage.alternates?.canonical);
  });

  it('is the card the root layout hands every route by default', () => {
    for (const field of ['title', 'description', 'locale', 'type', 'siteName']) {
      expect(og(homePage)[field], `openGraph.${field}`).toEqual(og(layout)[field]);
    }
    for (const field of ['card', 'title', 'description']) {
      expect(twitter(homePage)[field], `twitter.${field}`).toEqual(twitter(layout)[field]);
    }
    expect(og(homePage).title).toBe(site.seo.ogTitle);
  });

  it('is not stamped on the routes that only inherit the layout', () => {
    // /admin and /orcamento set no card: a URL here would be theirs too.
    expect(og(layout)).not.toHaveProperty('url');
  });
});

describe('the picture', () => {
  const everyMetadata = [
    { name: 'the root layout', metadata: layout },
    { name: '/', metadata: homePage },
    ...pages.map(({ path, page }) => ({ name: path, metadata: page })),
  ];

  it.each(everyMetadata)('is left to the opengraph-image file by $name', ({ metadata }) => {
    expect(og(metadata)).not.toHaveProperty('images');
    expect(twitter(metadata)).not.toHaveProperty('images');
  });

  const everyImage = [{ path: '/', image: homeImage }, ...pages.map(({ path, image }) => ({ path, image }))];

  it.each(everyImage)('has a file beside the page of $path, with the exports Next reads', ({ image }) => {
    expect(image.default).toBeTypeOf('function');
    expect(image.size).toEqual({ width: 1200, height: 630 });
    expect(image.contentType).toBe('image/png');
    expect(image.alt.trim().length).toBeGreaterThan(20);
  });

  it('is described differently on every route', () => {
    const alts = everyImage.map(({ image }) => image.alt);
    expect(new Set(alts).size).toBe(alts.length);
  });

  it('is served, for the home, where the structured data says it is', () => {
    // A metadata file inside a route group is published under a hashed name;
    // this is the function Next itself names the route with.
    expect(fillStaticMetadataSegment('/(site)', 'opengraph-image')).toBe(HOME_OG_IMAGE_PATH);
  });
});
