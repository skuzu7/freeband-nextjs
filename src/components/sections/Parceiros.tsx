"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { partners } from "@/data/content";

export function Parceiros() {
  return (
    <Section id="parceiros" className="bg-bg border-t border-white/5">
      <Container>
        <div className="flex flex-col items-center">
          <SectionTitle eyebrow="Confiança" centered>Nossos Parceiros</SectionTitle>
          <div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 hover:opacity-100 transition-opacity duration-700">
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
