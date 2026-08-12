import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { AtoI_Manifesto } from "@/components/sections/AtoI_Manifesto";
import { AtoII_Galeria } from "@/components/sections/AtoII_Galeria";
import { AtoIII_Palcos } from "@/components/sections/AtoIII_Palcos";
import { AtoIV_Eventos } from "@/components/sections/AtoIV_Eventos";
import { Ato_Servicos } from "@/components/sections/Ato_Servicos";
import { AtoV_Contato } from "@/components/sections/AtoV_Contato";

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
        <AtoI_Manifesto />
        <Ato_Servicos />
        <AtoII_Galeria />
        <AtoIII_Palcos />
        <AtoIV_Eventos />
        <AtoV_Contato />
      </main>
      <Footer />
    </>
  );
}
