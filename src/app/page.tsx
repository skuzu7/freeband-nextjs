import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { AtoI_Manifesto } from "@/components/sections/AtoI_Manifesto";
import { Galeria } from "@/components/sections/Galeria";
import { AtoIII_Palcos } from "@/components/sections/AtoIII_Palcos";
import { Servicos } from "@/components/sections/Servicos";
import { Contato } from "@/components/sections/Contato";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <AtoI_Manifesto />
        <Galeria />
        <AtoIII_Palcos />
        <Servicos />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
