// src/components/home/Data.tsx
// Block 5 — "Qual é a data?": the WhatsApp CTA and every way to reach the
// production. The footer follows.
import { contact } from '@/data/contact';
import { data } from '@/data/copy/home';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { WhatsAppCta } from '@/components/site/WhatsAppCta';

const telHref = `tel:${contact.phoneIntl.replace(/[^\d+]/g, '')}`;

export function Data() {
  return (
    <Section id="contato" labelledBy="contato-title" className="border-t border-line">
      <Container className="grid gap-12 md:grid-cols-[1.25fr_1fr] md:items-end">
        <div>
          <Label dot>{data.label}</Label>
          <h2 id="contato-title" className="mt-4 text-5xl font-semibold tracking-display text-ink">
            {data.headline}
          </h2>
          <p className="mt-5 max-w-[52ch] text-lg text-ink-muted">{data.lead}</p>
          <div className="mt-8">
            <WhatsAppCta size="lg">{data.whatsappCta}</WhatsAppCta>
          </div>
        </div>
        <dl className="grid gap-6">
          <div>
            <dt className="label-caps text-ink-low">{data.phoneLabel}</dt>
            <dd className="mt-1">
              <a href={telHref} className="transition-quick text-2xl font-semibold text-ink hover:text-led-text">
                {contact.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="label-caps text-ink-low">E-mail</dt>
            <dd className="mt-1">
              <a href={`mailto:${contact.email}`} className="transition-quick break-all text-ink hover:text-led-text">
                {contact.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="label-caps text-ink-low">Instagram</dt>
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
            <dt className="label-caps text-ink-low">Endereço</dt>
            <dd className="mt-1 text-ink-muted">{contact.addressFull}</dd>
          </div>
          <p className="text-2xs text-ink-low">{data.meta}</p>
        </dl>
      </Container>
    </Section>
  );
}
