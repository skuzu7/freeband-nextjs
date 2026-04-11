"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { partners, contact } from "@/data/content";

export function Parceiros() {
  return (
    <Section id="parceiros" className="bg-bg border-t border-white/5">
      <Container>
        <div className="flex flex-col items-center">
          <SectionTitle eyebrow="Confiança" centered>Nossos Parceiros</SectionTitle>
          <div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-50 hover:opacity-100 transition-opacity duration-700">
            {partners.map((p) => (
              <span key={p} className="text-sm sm:text-base font-bold uppercase tracking-[0.4em]">
                {p}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function Contato() {
  return (
    <Section id="contato" className="bg-bg-alt relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <Container className="relative z-10 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <SectionTitle eyebrow="Contato" centered>
            Vamos criar algo inesquecível
          </SectionTitle>
          <p className="text-text-muted mb-12 max-w-2xl mx-auto">
            Estamos prontos para transformar seu evento em uma experiência musical de altíssimo nível. Solicite seu orçamento personalizado.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="glass p-8 group">
              <p className="text-gold text-[0.6rem] uppercase font-bold tracking-widest mb-2">WhatsApp Geral</p>
              <a href={contact.whatsappLink} className="text-2xl font-black hover:text-gold transition-colors">
                {contact.phone}
              </a>
            </div>
            <div className="glass p-8 group">
              <p className="text-gold text-[0.6rem] uppercase font-bold tracking-widest mb-2">E-mail</p>
              <a href={`mailto:${contact.email}`} className="text-xl font-black hover:text-gold transition-colors">
                {contact.email}
              </a>
            </div>
          </div>

          <a
            href={contact.whatsappLink}
            className="inline-flex items-center gap-4 bg-green-500 px-12 py-5 rounded-full text-white font-bold uppercase tracking-[0.2em] text-sm hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(34,197,94,0.3)]"
          >
            Falar pelo WhatsApp
          </a>

          <div className="mt-16 pt-8 border-t border-white/5 text-[0.65rem] uppercase tracking-[0.5em] text-text-muted">
            {contact.city} • São Paulo • Brasil
          </div>
        </div>
      </Container>
    </Section>
  );
}
