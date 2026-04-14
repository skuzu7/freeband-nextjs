import { bandInfo, contact, pageCopy, yearRibbon } from '@/data/content';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-bg-raise pt-24">
      {/* Neon top accent */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-60"
      />

      {/* Giant background wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-4vi] flex select-none items-end justify-center"
      >
        <span
          className="font-display font-semibold leading-[0.7] -tracking-[0.05em] text-transparent"
          style={{
            fontSize: 'clamp(8rem, 22vi, 22rem)',
            WebkitTextStroke: '1px color-mix(in oklch, var(--color-brand) 25%, transparent)',
          }}
        >
          freeband
        </span>
      </div>

      <div className="max-w-container px-section relative mx-auto flex w-full flex-col gap-16 pb-24">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-text-muted">
              Internacional
            </span>
            <span
              className="font-display text-text -tracking-[0.02em] text-glow-red"
              style={{ fontSize: 'var(--text-4xl)' }}
            >
              freeband
            </span>
            <p className="mt-2 max-w-[36ch] text-text-muted">
              {pageCopy.footer.brandTagline} {pageCopy.footer.brandTaglineLong}
            </p>
          </div>

          <nav aria-label="Seções do site" className="flex flex-col gap-3">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
              {pageCopy.footer.navHeading}
            </span>
            {pageCopy.nav.sections.map((link) => (
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
              {pageCopy.footer.contactHeading}
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
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener"
              className="w-fit text-text transition-colors hover:text-brand"
            >
              {contact.instagram}
            </a>
            <p className="text-text-muted">
              {contact.address}
              <br />
              {contact.city}
            </p>
          </div>
        </div>

        {/* Year ribbon */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-8 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-text-muted">
          {yearRibbon.map((y, i) => (
            <span key={y} className="flex items-center gap-3">
              <span>{y}</span>
              {i < yearRibbon.length - 1 && (
                <span aria-hidden className="inline-block h-px w-6 bg-border" />
              )}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 text-[0.65rem] uppercase tracking-[0.3em] text-text-muted md:flex-row md:items-center">
          <span>
            © {year} {bandInfo.name} · CNPJ {bandInfo.cnpj}
          </span>
          <span className="opacity-70">{pageCopy.footer.rightsNote}</span>
        </div>
      </div>
    </footer>
  );
}
