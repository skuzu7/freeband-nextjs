// src/components/home/Data.tsx
// Block 5 — "Qual é a data?": the question resolving out of the dots, the WhatsApp
// CTA and every way to reach the production. The footer follows.
import { contact, telHref } from '@/data/contact';
import { data } from '@/data/copy/home';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { WhatsAppCta } from '@/components/site/WhatsAppCta';
import { BriefingBuilder } from './BriefingBuilder';

export function Data() {
  return (
    <Section id="contato" labelledBy="contato-title" className="border-t border-line">
      <Container className="flex flex-col gap-12">
        <div className="grid gap-12 md:grid-cols-[1.25fr_1fr] md:items-end">
          <div>
            <SectionHeader id="contato-title" label={data.label} headline={data.headline} lead={data.lead} size="page" />
            <div className="rise mt-8">
              <WhatsAppCta size="lg">{data.whatsappCta}</WhatsAppCta>
            </div>
          </div>
          <div className="rise rise-late grid gap-6">
            {/* A <dl> holds only its groups: the note under it sits beside it. */}
            <dl className="grid gap-6">
              <div>
                <dt className="label-caps text-ink-low">{data.phoneLabel}</dt>
                <dd className="mt-1">
                  <a href={telHref} className="transition-quick tap inline-flex items-center text-2xl font-semibold text-ink hover:text-led-text">
                    {contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label-caps text-ink-low">{data.emailLabel}</dt>
                <dd className="mt-1">
                  <a href={`mailto:${contact.email}`} className="transition-quick tap inline-flex items-center break-all text-ink hover:text-led-text">
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
                    className="transition-quick tap inline-flex items-center text-ink hover:text-led-text"
                  >
                    {contact.instagram}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="label-caps text-ink-low">{data.addressLabel}</dt>
                <dd className="mt-1 text-ink-muted">{contact.addressFull}</dd>
              </div>
            </dl>
            <p className="text-2xs text-ink-low">{data.meta}</p>
          </div>
        </div>

        <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <BriefingBuilder />
          <div className="rise flex flex-col gap-4 border border-line bg-surface/85 p-6 backdrop-blur-sm md:p-8">
            <Label dot>{data.faq.label}</Label>
            <div className="divide-y divide-line border-y border-line">
              {data.faq.items.map((item) => (
                <details key={item.q} className="group py-2">
                  <summary className="tap flex cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm font-semibold text-ink hover:text-led-text [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span
                      aria-hidden
                      className="label-caps shrink-0 text-led transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="pb-3 text-sm text-ink-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
