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
        <SectionTitle eyebrow="Registros">Galeria Visual</SectionTitle>

        <p className="mb-10 max-w-2xl text-base text-text-2">
          Uma seleção de registros de shows, turnês e eventos ao longo de mais
          de 55 anos de estrada.
        </p>

        <div className="gap-4 sm:columns-2 md:columns-3 lg:columns-4 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {galleryImages.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden"
              aria-label={`Ver foto: ${img.alt}`}
            >
              <div
                className={
                  i % 4 === 0
                    ? "relative aspect-[3/4] w-full"
                    : i % 4 === 1
                      ? "relative aspect-[4/3] w-full"
                      : i % 4 === 2
                        ? "relative aspect-square w-full"
                        : "relative aspect-[4/5] w-full"
                }
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gold/0 transition-colors duration-300 group-hover:bg-gold/25" />
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
