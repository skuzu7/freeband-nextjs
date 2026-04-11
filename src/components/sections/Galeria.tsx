"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { galleryImages } from "@/data/images";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function Galeria() {
  const [index, setIndex] = useState(-1);
  const slides = galleryImages.map((img) => ({ src: img.src, alt: img.alt }));

  return (
    <Section id="galeria" className="bg-bg">
      <Container>
        <SectionTitle eyebrow="Momentos">Galeria Visual</SectionTitle>

        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {galleryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="relative w-full group overflow-hidden border border-white/5 block"
            >
              <div className="relative">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-bg text-xs font-bold uppercase tracking-[0.3em] bg-gold px-4 py-2">Ver Foto</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          index={index}
          slides={slides}
        />
      </Container>
    </Section>
  );
}
