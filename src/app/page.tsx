import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { Historia } from "@/components/sections/Historia";
import Galeria from "@/components/sections/Galeria";
import Artistas from "@/components/sections/Artistas";
import Servicos from "@/components/sections/Servicos";
import Parceiros from "@/components/sections/Parceiros";
import Contato from "@/components/sections/Contato";

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
      <footer
        style={{
          background: "#000",
          borderTop: "1px solid var(--color-border)",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <p style={{ color: "var(--color-text-2)", fontSize: "0.875rem" }}>
          © {new Date().getFullYear()} Internacional Freeband. Todos os direitos
          reservados.
        </p>
      </footer>
    </>
  );
}
