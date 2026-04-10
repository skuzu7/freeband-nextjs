import Image from "next/image";
import { timeline } from "@/data/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function Historia() {
  return (
    <Section id="historia" className="bg-bg-2">
      <Container>
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="Linha do Tempo">Nossa História</SectionTitle>

          <div className="relative">
            <div className="absolute bottom-5 left-[15px] top-5 w-[2px] bg-border" />

            <ol className="space-y-12">
              {timeline.map((item, index) => (
                <li key={index} className="relative flex gap-6 md:gap-10">
                  <div className="relative z-10 flex-shrink-0 pt-1">
                    <div className="h-8 w-8 border-2 border-gold bg-bg-2 shadow-[0_0_0_4px_rgba(10,10,10,1)]" />
                  </div>

                  <div className="grid flex-1 gap-5 sm:grid-cols-[55%_42%] sm:items-start sm:gap-6">
                    <div>
                      <span className="inline-block bg-gold px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-bg">
                        {item.year}
                      </span>
                      <h3 className="mt-3 font-display text-xl font-bold uppercase tracking-wider text-white md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-text-2 md:text-base">
                        {item.description}
                      </p>
                    </div>

                    <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-gold">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 640px) 40vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </Section>
  );
}
