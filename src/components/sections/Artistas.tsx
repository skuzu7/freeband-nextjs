import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { artists } from "@/data/content";

export function Artistas() {
  return (
    <Section id="artistas" className="bg-bg-2">
      <Container>
        <SectionTitle eyebrow="Palco Compartilhado">
          Já tocamos ao lado de
        </SectionTitle>

        <ul className="mt-10 grid grid-cols-1 gap-x-10 gap-y-4 divide-y divide-border sm:grid-cols-2 sm:divide-y-0 md:gap-x-16">
          {artists.map((artist) => (
            <li
              key={artist}
              className="flex items-center gap-4 py-3 text-base sm:border-b sm:border-border md:text-lg"
            >
              <span className="text-gold" aria-hidden="true">
                &rsaquo;
              </span>
              <span className="font-display uppercase tracking-wider text-white">
                {artist}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
