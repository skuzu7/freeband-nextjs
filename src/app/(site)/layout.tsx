// The public site shell: skip link, header, <main>, footer, and the panel
// itself — LedStage, a fixed wall of dots behind every page that light
// answers, so the whole site sits on the LED wall. /admin and /orcamento sit
// outside this route group and get none of it.
//
// `lightbox` is the parallel slot (@lightbox): empty until a photograph is
// opened from inside the site, when its intercepted route renders the photo
// viewer as a dialog over whatever page is in `children`. It comes last, a
// sibling of everything else, so the dialog can make the rest inert.
import { HOME_OG_IMAGE_PATH } from '@/lib/seo/metadata';
import { musicGroup, webSite } from '@/lib/seo/jsonld';
import { LedStage } from '@/components/brand/LedStage';
import { HistoryKeeper } from '@/components/media/lightbox/HistoryKeeper';
import { Footer } from '@/components/site/Footer';
import { JsonLd } from '@/components/site/JsonLd';
import { Nav } from '@/components/site/Nav';
import { SkipLink } from '@/components/site/SkipLink';

// Copy such as "57 anos de estrada" and the footer's decade ribbon counts
// from today's date on the server. Regenerating the pages once a day keeps
// a static deployment from stating last year's numbers forever.
export const revalidate = 86400;

interface SiteLayoutProps {
  children: React.ReactNode;
  lightbox: React.ReactNode;
}

export default function SiteLayout({ children, lightbox }: SiteLayoutProps) {
  return (
    <>
      {/* Who the site belongs to, stated once for search on every public
          page — and on none of the protected ones, which sit outside. */}
      <JsonLd data={[musicGroup(HOME_OG_IMAGE_PATH), webSite()]} />
      <LedStage />
      <SkipLink />
      <Nav />
      <main id="conteudo" className="relative">
        {children}
      </main>
      <Footer />
      <HistoryKeeper />
      {lightbox}
    </>
  );
}
