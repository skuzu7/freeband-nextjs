import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { partners } from "@/data/content";

export function Parceiros() {
  return (
    <Section id="parceiros" className="bg-bg-2">
      <Container>
        <SectionTitle eyebrow="Confiança">Nossos Parceiros</SectionTitle>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 md:gap-x-10">
          {partners.map((partner, index) => (
            <li key={partner} className="flex items-center gap-6 md:gap-10">
              <span className="font-display text-base uppercase tracking-[0.15em] text-white md:text-lg">
                {partner}
              </span>
              {index < partners.length - 1 ? (
                <span
                  className="hidden text-xl font-thin text-gold md:inline"
                  aria-hidden="true"
                >
                  |
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
