import { bandInfo, contact, pageCopy, yearRibbon } from '@/data/content';
import { Wordmark } from '@/components/ui/Wordmark';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-bg-raise pt-24">
      {/* Neon top accent */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent opacity-60"
      />

      {/* Giant background wordmark — the real mark now, dropped to a whisper
          so it reads as a watermark rather than a second logo. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-2vi] flex select-none items-end justify-center overflow-hidden"
      >
        <Wordmark className="w-[130%] max-w-none text-logo-red/[0.07]" />
      </div>

      <div className="max-w-container px-section relative mx-auto flex w-full flex-col gap-16 pb-24">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <span className="flex items-center gap-4">
              <span className="font-mono text-[0.65rem] uppercase leading-none tracking-[0.35em] text-text-muted">
                Internacional
              </span>
              <span aria-hidden className="h-px flex-1 bg-logo-red/40" />
            </span>
            <Wordmark
              className="h-[clamp(2rem,4vi,2.75rem)] w-auto self-start text-logo-red"
              title={bandInfo.name}
            />
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
            {[contact.email, contact.emailAlt].map((address) => (
              <a
                key={address}
                href={`mailto:${address}`}
                className="w-fit text-text transition-colors hover:text-brand"
              >
                {address}
              </a>
            ))}
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
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
