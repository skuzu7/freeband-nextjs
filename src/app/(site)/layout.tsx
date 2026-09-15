// The public site shell: skip link, header, <main>, footer, and the panel
// itself — a fixed field of unlit dots behind every page, so the whole site
// sits on the LED wall. /admin and /orcamento sit outside this route group
// and get none of it.
import { Footer } from '@/components/site/Footer';
import { Nav } from '@/components/site/Nav';
import { SkipLink } from '@/components/site/SkipLink';

// Copy such as "57 anos de estrada" and the footer's decade ribbon counts
// from today's date on the server. Regenerating the pages once a day keeps
// a static deployment from stating last year's numbers forever.
export const revalidate = 86400;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div aria-hidden className="dot-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <SkipLink />
      <Nav />
      <main id="conteudo" className="relative">
        {children}
      </main>
      <Footer />
    </>
  );
}
