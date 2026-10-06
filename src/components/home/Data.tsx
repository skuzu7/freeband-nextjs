// src/components/home/Data.tsx
// Block 5 — "Qual é a data?": the question resolving out of the dots, the WhatsApp
// CTA and every way to reach the production. The footer follows.
import { contact, telHref } from '@/data/contact';
import { data } from '@/data/copy/home';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { WhatsAppCta } from '@/components/site/WhatsAppCta';

export function Data() {
  return (
    <Section id="contato" labelledBy="contato-title" className="border-t border-line">
      <Container className="grid gap-12 md:grid-cols-[1.25fr_1fr] md:items-end">
        <div>
          <SectionHeader id="contato-title" label={data.label} headline={data.headline} lead={data.lead} size="page" />
          <div className="rise mt-8">
            <WhatsAppCta size="lg">{data.whatsappCta}</WhatsAppCta>
          </div>
        </div>
        <dl className="rise rise-late grid gap-6">
          <div>
            <dt className="label-caps text-ink-low">{data.phoneLabel}</dt>
            <dd className="mt-1">
              <a href={telHref} className="transition-quick text-2xl font-semibold text-ink hover:text-led-text">
                {contact.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="label-caps text-ink-low">{data.emailLabel}</dt>
            <dd className="mt-1">
              <a href={`mailto:${contact.email}`} className="transition-quick break-all text-ink hover:text-led-text">
                {contact.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="label-caps text-ink-low">{data.instagramLabel}</dt>
            <dd className="mt-1">
              <a
                href={contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-quick text-ink hover:text-led-text"
              >
                {contact.instagram}
              </a>
            </dd>
          </div>
          <div>
            <dt className="label-caps text-ink-low">{data.addressLabel}</dt>
            <dd className="mt-1 text-ink-muted">{contact.addressFull}</dd>
          </div>
          <p className="text-2xs text-ink-low">{data.meta}</p>
        </dl>
      </Container>
    </Section>
  );
}
