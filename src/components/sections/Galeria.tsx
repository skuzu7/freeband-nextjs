"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { galleryImages } from "@/data/images";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function Galeria() {
  const [index, setIndex] = useState(-1);

  const slides = galleryImages.map((img) => ({ src: img.src }));

  return (
    <section
      id="galeria"
      className="section-padding"
      style={{ background: "var(--color-bg)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle>Galeria Visual</SectionTitle>

        <div style={{ columns: "3", columnGap: "1rem" }}>
          {galleryImages.map((img, i) => (
            <div
              key={img.src}
              className="relative mb-4 overflow-hidden cursor-pointer group"
              style={{ breakInside: "avoid" }}
              onClick={() => setIndex(i)}
            >
              <div
                className="relative w-full"
                style={{
                  paddingBottom:
                    i % 3 === 0 ? "75%" : i % 3 === 1 ? "120%" : "100%",
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(201, 168, 76, 0.25)" }}
                />
              </div>
            </div>
          ))}
        </div>

        <Lightbox
          open={index >= 0}
          close={() => setIndex(-1)}
          index={index}
          slides={slides}
        />
      </div>
    </section>
  );
}
