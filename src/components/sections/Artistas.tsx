"use client";

import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { artists } from "@/data/content";

export function Artistas() {
  const doubledArtists = [...artists, ...artists];

  return (
    <Section id="artistas" className="bg-bg-alt overflow-hidden border-y border-white/5">
      <Container>
        <SectionTitle eyebrow="Legado" centered>
          Já dividimos o palco com
        </SectionTitle>
      </Container>

      <div className="relative mt-4 py-8">
        {/* Row 1 */}
        <div className="flex overflow-hidden group">
          <div className="flex animate-marquee whitespace-nowrap py-4">
            {doubledArtists.map((artist, i) => (
              <div key={i} className="flex items-center gap-6 mx-8">
                <span className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tighter text-white/20 hover:text-gold transition-colors duration-500 cursor-default">
                  {artist}
                </span>
                <span className="h-1.5 w-1.5 rotate-45 bg-gold/30" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Reverse */}
        <div className="flex overflow-hidden group mt-4">
          <div className="flex animate-marquee-reverse whitespace-nowrap py-4">
            {doubledArtists.map((artist, i) => (
              <div key={i} className="flex items-center gap-6 mx-8">
                <span className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tighter text-white/10 hover:text-gold/50 transition-colors duration-500 cursor-default">
                  {artist}
                </span>
                <span className="h-1 w-1 rotate-45 bg-gold/10" />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Fades */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-alt to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-alt to-transparent z-10" />
      </div>
    </Section>
  );
}
