// @vitest-environment node
//
// What a link to each page shows when it is shared. Next merges metadata
// shallowly: a page that sets `openGraph` or `twitter` replaces the root
// layout's whole object, it does not inherit the fields it leaves out. So
// every inner page has to name itself (title, description, URL) and still
// carry the rest of the home's card (image, locale, type, site name) — a
// page with neither object previews as the home, one with half of it
// previews without a picture.
import type { Metadata } from 'next';
import { describe, expect, it, vi } from 'vitest';
import { arquivo } from '@/data/copy/arquivo';
import { historia } from '@/data/copy/historia';
import { palco } from '@/data/copy/palco';
import { portfolio } from '@/data/copy/portfolio';
import { metadata as home } from '../layout';
import { metadata as arquivoPage } from '../(site)/arquivo/page';
import { metadata as historiaPage } from '../(site)/historia/page';
import { metadata as palcoPage } from '../(site)/palco/page';
import { metadata as portfolioPage } from '../(site)/portfolio/page';

// next/font exists only through the Next compiler; outside it the import is
// empty and the layout module would throw before exporting its metadata.
vi.mock('next/font/google', () => ({ Outfit: () => ({ variable: '--font-outfit' }) }));

// `openGraph` and `twitter` are typed as unions over og:type and the card
// kind, which hides `type` and `card`; the assertions read plain records.
type Card = Record<string, unknown>;
const og = (m: Metadata) => (m.openGraph ?? {}) as Card;
const twitter = (m: Metadata) => (m.twitter ?? {}) as Card;

const pages = [
  { path: '/palco', seo: palco.seo, page: palcoPage },
  { path: '/arquivo', seo: arquivo.seo, page: arquivoPage },
  { path: '/historia', seo: historia.seo, page: historiaPage },
  { path: '/portfolio', seo: portfolio.seo, page: portfolioPage },
];

describe.each(pages)('share card of $path', ({ path, seo, page }) => {
  // The <title> Next renders for the page: the root layout's template around
  // the page's own title. The card is titled the same way.
  const { template } = home.title as { template: string };
  const title = template.replace(/%s/g, seo.title);

  it('is titled and described as the page, not as the home', () => {
    expect(og(page).title).toBe(title);
    expect(og(page).title).toContain(seo.title);
    expect(og(page).title).not.toBe(og(home).title);
    expect(og(page).description).toBe(seo.description);

    expect(twitter(page).title).toBe(title);
    expect(twitter(page).title).not.toBe(twitter(home).title);
    expect(twitter(page).description).toBe(seo.description);
  });

  it('points at its own canonical URL', () => {
    expect(og(page).url).toBe(page.alternates?.canonical);
    expect(og(page).url).toMatch(new RegExp(`${path}$`));
  });

  it('keeps every other field of the home card', () => {
    for (const field of ['images', 'locale', 'type', 'siteName']) {
      expect(og(home)[field], `home openGraph.${field}`).toBeDefined();
      expect(og(page)[field], `openGraph.${field}`).toEqual(og(home)[field]);
    }
    for (const field of ['card', 'images']) {
      expect(twitter(home)[field], `home twitter.${field}`).toBeDefined();
      expect(twitter(page)[field], `twitter.${field}`).toEqual(twitter(home)[field]);
    }
  });
});
