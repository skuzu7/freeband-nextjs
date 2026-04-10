import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { Historia } from "@/components/sections/Historia";
import { Galeria } from "@/components/sections/Galeria";
import { Artistas } from "@/components/sections/Artistas";
import { Servicos } from "@/components/sections/Servicos";
import { Parceiros } from "@/components/sections/Parceiros";
import { Contato } from "@/components/sections/Contato";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <Sobre />
        <Historia />
        <Galeria />
        <Artistas />
        <Servicos />
        <Parceiros />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
