import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { AtoI_Manifesto } from "@/components/sections/AtoI_Manifesto";
import { AtoII_Galeria } from "@/components/sections/AtoII_Galeria";
import { AtoIII_Palcos } from "@/components/sections/AtoIII_Palcos";
import { AtoIV_Eventos } from "@/components/sections/AtoIV_Eventos";
import { Contato } from "@/components/sections/Contato";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <AtoI_Manifesto />
        <AtoII_Galeria />
        <AtoIII_Palcos />
        <AtoIV_Eventos />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
