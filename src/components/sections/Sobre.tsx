import Image from "next/image";
import { release } from "@/data/content";
import { images } from "@/data/images";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function Sobre() {
  const paragraphs = release.full.split("\n\n");

  return (
    <Section id="sobre" className="bg-bg">
      <Container>
        <SectionTitle eyebrow="A Banda">Quem Somos</SectionTitle>

        <div className="mb-14 grid gap-10 md:grid-cols-[60%_38%] md:gap-12">
          <div className="space-y-5 text-base leading-relaxed text-text-2 md:text-lg">
            {paragraphs.map((para, index) => (
              <p key={index} className="text-justify">
                {para}
              </p>
            ))}
            <ul className="flex flex-wrap gap-3 pt-2">
              {release.values.map((value) => (
                <li
                  key={value}
                  className="border border-gold/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-gold"
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative aspect-[4/5] w-full overflow-hidden border-2 border-gold md:aspect-auto md:min-h-[440px]">
            <Image
              src={images.anos70}
              alt="Freeband anos 70"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover grayscale contrast-125"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
          {release.highlights.map((highlight) => (
            <div
              key={highlight.label}
              className="bg-bg-card px-4 py-8 text-center md:px-6 md:py-10"
            >
              <div className="font-display text-5xl font-bold leading-none text-gold md:text-6xl">
                {highlight.value}
              </div>
              <div className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-2">
                {highlight.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
