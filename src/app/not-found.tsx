// The 404 for the whole app. It renders inside the root layout, which has no
// header or footer of its own, so it brings the public shell with it: a
// visitor who mistyped an address still gets the wall, the nav and the routes.
import type { Metadata } from 'next';
import { site } from '@/data/copy/site';
import { system } from '@/data/copy/system';
import { LedNumber } from '@/components/brand/LedNumber';
import { LedStage } from '@/components/brand/LedStage';
import { Footer } from '@/components/site/Footer';
import { Nav } from '@/components/site/Nav';
import { SkipLink } from '@/components/site/SkipLink';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: system.notFound.title,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const { notFound } = system;
  return (
    <>
      <LedStage />
      <SkipLink />
      <Nav />
      <main id="conteudo" className="relative">
        <Container className="flex min-h-[70svh] flex-col justify-center gap-10 py-24">
          <LedNumber value={notFound.code} matrixClassName="h-20 md:h-28" />
          <SectionHeader as="h1" size="page" id="not-found-title" label={notFound.label} headline={notFound.headline} lead={notFound.lead} />
          <ul className="flex flex-wrap gap-3">
            <li>
              <Button href="/">{notFound.home}</Button>
            </li>
            {site.nav.links.map((link) => (
              <li key={link.href}>
                <Button variant="secondary" href={link.href}>
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </>
  );
}
