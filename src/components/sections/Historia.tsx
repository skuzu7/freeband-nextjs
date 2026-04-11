"use client";

import Image from "next/image";
import { timeline } from "@/data/content";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function Historia() {
  return (
    <Section id="historia" className="bg-bg-alt">
      <Container>
        <SectionTitle eyebrow="História" centered>
          55 Anos de Estrada
        </SectionTitle>

        <div className="relative mt-8">
          {/* Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10" />

          <div className="space-y-16">
            {timeline.map((item, i) => (
              <div key={i} className={`relative flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gold z-10 border-4 border-bg-alt" />

                <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-12">
                  <span className="text-gold text-xs font-bold font-mono py-1 px-3 border border-gold/40 mb-4 inline-block">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-12">
                  <div className="relative aspect-video w-full overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-700">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
