import { bandInfo } from "@/data/content";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bg py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs uppercase tracking-[0.4em] text-text-muted">Internacional</span>
            <span className="text-2xl font-black uppercase tracking-[0.2em] text-gold">Freeband</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-8">
            {["Sobre", "História", "Galeria", "Serviços", "Contato"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-[0.6rem] uppercase tracking-[0.3em] text-text-muted hover:text-gold transition-colors">
                {l}
              </a>
            ))}
          </nav>

          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-text-muted text-center md:text-right">
            © {year} {bandInfo.name} <br />
            <span className="opacity-50">Todos os direitos reservados</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
