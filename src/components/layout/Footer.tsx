import { bandInfo, contact } from "@/data/content";

const YEAR_RIBBON = ["1969", "1979", "1989", "1999", "2009", "2019", "2026"];

const FOOTER_LINKS = [
  { label: "Manifesto", href: "#sobre" },
  { label: "Palco", href: "#historia" },
  { label: "Galeria", href: "#galeria" },
  { label: "Eventos", href: "#servicos" },
  { label: "Contato", href: "#contato" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-bg-raise pt-24">
      {/* Giant background wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-4vi] flex select-none items-end justify-center"
      >
        <span
          className="font-display font-semibold leading-[0.7] -tracking-[0.05em] text-transparent"
          style={{
            fontSize: "clamp(8rem, 22vi, 22rem)",
            WebkitTextStroke: "1px color-mix(in oklch, var(--color-red-500) 35%, transparent)",
          }}
        >
          freeband
        </span>
      </div>

      <div className="relative mx-auto flex w-full max-w-[min(92rem,100%)] flex-col gap-16 px-[clamp(1.25rem,4vw,3.5rem)] pb-24">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-text-muted">
              Internacional
            </span>
            <span
              className="font-display text-text -tracking-[0.02em]"
              style={{ fontSize: "var(--text-4xl)" }}
            >
              freeband
            </span>
            <p className="mt-2 max-w-[36ch] text-text-muted">
              Uma banda feita no palco. Desde {bandInfo.founded}, dividindo o
              mesmo pulso com o Brasil.
            </p>
          </div>

          <nav aria-label="Seções do site" className="flex flex-col gap-3">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
              Navegar
            </span>
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="w-fit text-text transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
              Contato
            </span>
            <a
              href={contact.whatsappLink}
              className="w-fit text-text transition-colors hover:text-brand"
            >
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="w-fit text-text transition-colors hover:text-brand"
            >
              {contact.email}
            </a>
            <p className="text-text-muted">{contact.city}</p>
          </div>
        </div>

        {/* Year ribbon */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-8 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
          {YEAR_RIBBON.map((y, i) => (
            <span key={y} className="flex items-center gap-3">
              <span>{y}</span>
              {i < YEAR_RIBBON.length - 1 && (
                <span aria-hidden className="inline-block h-px w-6 bg-border" />
              )}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 text-[0.65rem] uppercase tracking-[0.3em] text-text-muted md:flex-row md:items-center">
          <span>
            © {year} {bandInfo.name}
          </span>
          <span className="opacity-70">Todos os direitos reservados</span>
        </div>
      </div>
    </footer>
  );
}
