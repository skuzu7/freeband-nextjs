// The public site shell: skip link, header, <main>, footer, and the panel
// itself — a fixed field of unlit dots behind every page, so the whole site
// sits on the LED wall. /admin and /orcamento sit outside this route group
// and get none of it.
import { Footer } from '@/components/site/Footer';
import { Nav } from '@/components/site/Nav';
import { SkipLink } from '@/components/site/SkipLink';

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
