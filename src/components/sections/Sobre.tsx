"use client";

import Image from "next/image";
import { release } from "@/data/content";
import { images } from "@/data/images";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function Sobre() {
  const paragraphs = release.full.split("\n\n");

  return (
    <Section id="sobre" className="bg-bg overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <SectionTitle eyebrow="A Banda">Quem Somos</SectionTitle>
            <div className="space-y-6 text-text-muted leading-relaxed">
              {paragraphs.map((para, i) => (
                <p key={i} className="text-sm sm:text-base">
                  {para}
                </p>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {release.values.map((v) => (
                <span key={v} className="text-[0.6rem] font-bold uppercase tracking-[0.3em] border border-gold/30 px-4 py-1.5 text-gold">
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div className="order-1 md:order-2 relative aspect-[4/5] w-full max-w-md mx-auto md:max-w-none">
            {/* Decoration */}
            <div className="absolute -inset-4 border border-gold/10 -z-10 translate-x-4 translate-y-4" />
            <Image
              src={images.anos70}
              alt="Histórico"
              fill
              className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24">
          {release.highlights.map((h) => (
            <div key={h.label} className="text-center group">
              <p className="text-4xl md:text-5xl font-black text-gold mb-2 group-hover:scale-110 transition-transform">
                {h.value}
              </p>
              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-text-muted">
                {h.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
