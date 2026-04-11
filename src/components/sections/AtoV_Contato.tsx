// src/components/sections/AtoV_Contato.tsx
// PALCO II — Ato V: Entre no palco.
// Cinematic closing: oversized tagline + NumberScrub phone number, aurora
// WhatsApp button with magnetic hover + ripple bloom on click, Instagram +
// email pills, CNPJ + website eyebrow.
import { contact, bandInfo } from "@/data/content";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { NumberScrub } from "@/components/ui/NumberScrub";
import { Button } from "@/components/ui/Button";

const InstagramIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    className="h-[0.95em] w-[0.95em]"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="h-5 w-5 fill-current"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.556-5.338 11.891-11.893 11.891a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export function AtoV_Contato() {
  return (
    <Section
      id="contato"
      variant="ink-raise"
      pad="hero"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent"
      />

      <Container>
        <Eyebrow number="V" tone="mono">
          CNPJ {bandInfo.cnpj} · {contact.address}
        </Eyebrow>

        <h2
          className="reveal-lead mt-8 font-display -tracking-[0.02em] text-balance max-w-4xl"
          style={{ fontSize: "var(--text-6xl)", lineHeight: 0.9 }}
        >
          Vamos{" "}
          <span className="serif-italic text-brand">entrar no palco</span>{" "}
          juntos?
        </h2>

        <p
          className="reveal-mid mt-8 max-w-[58ch] text-text-muted"
          style={{ fontSize: "var(--text-lg)", lineHeight: 1.55 }}
        >
          Conta pra gente o formato, a data e o sonho. Retornamos com uma
          proposta sob medida — som, luz, logística, backup, DJ pós-show.
          Tudo nosso.
        </p>

        {/* Huge phone number — static NumberScrub variant="phone" */}
        <div className="reveal-mid mt-[clamp(3rem,5vi,5rem)]">
          <NumberScrub
            value={contact.phone}
            variant="phone"
            label="Fale com a produção"
          />
        </div>

        {/* Aurora CTA + contact pills */}
        <div className="reveal-tail mt-10 flex flex-col flex-wrap items-start gap-8 md:flex-row md:items-center md:gap-6">
          <Button
            as="a"
            variant="aurora"
            magnetic
            ripple
            href={contact.whatsappLink}
            target="_blank"
            rel="noopener"
          >
            <WhatsAppIcon />
            Falar pelo WhatsApp
            <span aria-hidden>→</span>
          </Button>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={contact.instagramUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-3 border border-border px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-text transition-colors hover:border-brand hover:text-brand"
            >
              <InstagramIcon />
              {contact.instagram}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-3 border border-border px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-text transition-colors hover:border-brand hover:text-brand"
            >
              {contact.email}
            </a>
          </div>
        </div>

        <div className="mt-[clamp(4rem,6vi,5rem)] flex flex-wrap items-center gap-6 border-t border-border pt-8 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-text-muted">
          <span className="flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-8 bg-brand" />
            {bandInfo.legalName}
          </span>
          <span aria-hidden>·</span>
          <span className="normal-case tracking-[0.1em]">
            {contact.website}
          </span>
        </div>
      </Container>
    </Section>
  );
}
