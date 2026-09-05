// The public site shell: skip link, header, <main>, footer. /admin and
// /orcamento sit outside this route group and get none of it.
import { Footer } from '@/components/site/Footer';
import { Nav } from '@/components/site/Nav';
import { SkipLink } from '@/components/site/SkipLink';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="conteudo" className="relative">
        {children}
      </main>
      <Footer />
    </>
  );
}
