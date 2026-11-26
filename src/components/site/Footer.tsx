// src/components/site/Footer.tsx
import Link from 'next/link';
import { bandInfo } from '@/data/band';
import { contact, telHref } from '@/data/contact';
import { site } from '@/data/copy/site';
import { Logotipo } from '@/components/brand/Logotipo';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <Logotipo acrylic glow title={bandInfo.name} markClassName="h-8 md:h-9 w-auto" className="max-w-xs" />
          <p className="text-lg text-ink">{site.footer.brandTagline}</p>
          <p className="text-sm text-ink-muted">{site.footer.brandTaglineLong}</p>
        </div>

        <nav aria-label={site.footer.navHeading} className="flex flex-col gap-4">
          <Label>{site.footer.navHeading}</Label>
          <ul className="flex flex-col">
            <li>
              <Link href="/" className="transition-quick tap inline-flex items-center text-ink-muted hover:text-ink">
                {site.nav.homeLink}
              </Link>
            </li>
            {site.nav.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-quick tap inline-flex items-center text-ink-muted hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <Label>{site.footer.contactHeading}</Label>
          <ul className="flex flex-col text-ink-muted">
            <li>
              <a href={telHref} className="transition-quick tap inline-flex items-center hover:text-ink">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="transition-quick tap inline-flex items-center break-all hover:text-ink">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="transition-quick tap inline-flex items-center hover:text-ink">
                {contact.instagram}
              </a>
            </li>
            <li className="mt-2 text-sm">{contact.addressFull}</li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col gap-4 border-t border-line py-6 pb-24 text-2xs text-ink-low sm:flex-row sm:items-center sm:justify-between md:pb-6">
        <p>
          © {year} {bandInfo.name} · {site.footer.rightsNote}
        </p>
        <p className="tabular-nums">
          {site.footer.cnpjLabel} {bandInfo.cnpj}
        </p>
        <ul aria-label={site.footer.decadesLabel} className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          {site.footer.years.map((y, i) => (
            <li key={y} className="flex items-center gap-2.5">
              {i > 0 && (
                <span aria-hidden className="text-ink-low/60">
                  ·
                </span>
              )}
              <span className="tabular-nums">{y}</span>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
