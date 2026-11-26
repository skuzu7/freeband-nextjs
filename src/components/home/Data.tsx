// src/components/home/Data.tsx
// Block 5 — "Qual é a data?": leads directly with the 3-step guided Briefing
// Builder (the primary conversion funnel), paired cleanly with direct
// production contact channels and technical FAQ.
import { contact, telHref } from '@/data/contact';
import { data } from '@/data/copy/home';
import { Container } from '@/components/ui/Container';
import { Label } from '@/components/ui/Label';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BriefingBuilder } from './BriefingBuilder';

export function Data() {
  return (
    <Section id="contato" labelledBy="contato-title" className="border-t border-line">
      <Container className="flex flex-col gap-10 md:gap-12">
        <SectionHeader id="contato-title" label={data.label} headline={data.headline} lead={data.lead} size="page" />

        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start lg:gap-10">
          <BriefingBuilder />

          <div className="flex flex-col gap-8">
            <div className="rise border border-line bg-surface/90 p-5 sm:p-6 md:p-7">
              <Label>{data.phoneLabel}</Label>
              <dl className="mt-5 grid gap-5">
                <div>
                  <dt className="text-xs text-ink-low">Telefone & WhatsApp</dt>
                  <dd className="mt-1">
                    <a
                      href={telHref}
                      className="transition-quick tap inline-flex items-center text-2xl font-semibold tabular-nums text-ink hover:text-led-text"
                    >
                      {contact.phone}
                    </a>
                  </dd>
                </div>
                <div className="grid gap-4 border-t border-line/70 pt-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div>
                    <dt className="text-xs text-ink-low">{data.emailLabel}</dt>
                    <dd className="mt-0.5">
                      <a
                        href={`mailto:${contact.email}`}
                        className="transition-quick tap inline-flex items-center break-all text-sm text-ink hover:text-led-text"
                      >
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-ink-low">{data.instagramLabel}</dt>
                    <dd className="mt-0.5">
                      <a
                        href={contact.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-quick tap inline-flex items-center text-sm text-ink hover:text-led-text"
                      >
                        {contact.instagram}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="border-t border-line/70 pt-4">
                  <dt className="text-xs text-ink-low">{data.addressLabel}</dt>
                  <dd className="mt-0.5 text-sm text-ink-muted">{contact.addressFull}</dd>
                  <p className="mt-1.5 text-2xs tabular-nums text-ink-low">{data.meta}</p>
                </div>
              </dl>
            </div>

            <div className="rise flex flex-col gap-4 border border-line bg-surface/90 p-5 sm:p-6 md:p-7">
              <Label>{data.faq.label}</Label>
              <div className="divide-y divide-line border-t border-line">
                {data.faq.items.map((item) => (
                  <details key={item.q} className="group py-1.5">
                    <summary className="tap flex cursor-pointer list-none items-center justify-between gap-4 py-2 text-sm font-semibold text-ink hover:text-led-text [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span
                        aria-hidden
                        className="label-caps shrink-0 text-led transition-transform duration-200 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="pb-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
