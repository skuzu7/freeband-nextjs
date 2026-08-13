import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Palco } from '@/components/sections/Palco';
import { Video } from '@/components/sections/Video';
import { Arquivo } from '@/components/sections/Arquivo';
import { Historia } from '@/components/sections/Historia';
import { Pacotes } from '@/components/sections/Pacotes';
import { Contato } from '@/components/sections/Contato';

// Order is an argument, not a menu: show what arrives (Palco), show it moving
// (Video), prove it has been arriving for 57 years (Arquivo), explain where
// that came from (Historia), then price it (Pacotes) and take the booking
// (Contato).
export default function HomePage() {
  return (
    <>
      {/* Skip link lives here rather than in the root layout: this is the only
          route with a <main> to jump to, and the only one fronted by a nav. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-brand focus:px-5 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-void-950"
      >
        Pular para o conteúdo
      </a>
      <NavBar />
      <main id="conteudo">
        <Hero />
        <Palco />
        <Video />
        <Arquivo />
        <Historia />
        <Pacotes />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
