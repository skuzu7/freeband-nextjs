// src/components/site/Footer.tsx
import Link from 'next/link';
import { bandInfo } from '@/data/band';
import { contact } from '@/data/contact';
import { site } from '@/data/copy/site';
import { Logotipo } from '@/components/brand/Logotipo';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';

const telHref = `tel:${contact.phoneIntl.replace(/[^\d+]/g, '')}`;

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-5">
          <Logotipo title={bandInfo.name} markClassName="h-8 w-auto" className="max-w-xs" />
          <p className="text-lg text-ink">{site.footer.brandTagline}</p>
          <p className="text-sm text-ink-muted">{site.footer.brandTaglineLong}</p>
        </div>

        <nav aria-label={site.footer.navHeading} className="flex flex-col gap-4">
          <Label>{site.footer.navHeading}</Label>
          <ul className="flex flex-col gap-2.5">
            <li>
              <Link href="/" className="transition-quick text-ink-muted hover:text-ink">
                Início
              </Link>
            </li>
            {site.nav.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-quick text-ink-muted hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4">
          <Label>{site.footer.contactHeading}</Label>
          <ul className="flex flex-col gap-2.5 text-ink-muted">
            <li>
              <a href={telHref} className="transition-quick hover:text-ink">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className="transition-quick break-all hover:text-ink">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="transition-quick hover:text-ink">
                {contact.instagram}
              </a>
            </li>
            <li className="text-sm">{contact.addressFull}</li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col gap-4 border-t border-line py-6 text-2xs text-ink-low sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {bandInfo.name} · {site.footer.rightsNote}
        </p>
        <p>CNPJ {bandInfo.cnpj}</p>
        <ul aria-label="Décadas de estrada" className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {site.footer.years.map((y, i) => (
            <li key={y} className="flex items-center gap-3">
              {i > 0 && <i aria-hidden className="size-1 rounded-pill bg-led-dim" />}
              <span className="tabular-nums">{y}</span>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
