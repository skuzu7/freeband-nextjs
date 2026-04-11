"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { galleryImages } from "@/data/images";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

// Editorial asymmetric row sizing — repeats across the gallery.
const GRID_PATTERN = [
  "md:col-span-6 lg:col-span-5 aspect-[4/5]",
  "md:col-span-6 lg:col-span-7 aspect-[4/3]",
  "md:col-span-4 lg:col-span-3 aspect-square",
  "md:col-span-8 lg:col-span-6 aspect-[16/9]",
  "md:col-span-6 lg:col-span-3 aspect-[3/4]",
  "md:col-span-6 lg:col-span-4 aspect-[4/5]",
  "md:col-span-12 lg:col-span-8 aspect-[21/9]",
  "md:col-span-6 lg:col-span-4 aspect-[4/5]",
];

interface StartTransition {
  (callback: () => void): void;
}
type WithStartViewTransition = Document & {
  startViewTransition?: (cb: () => void) => unknown;
};

export function Galeria() {
  const [index, setIndex] = useState(-1);
  const slides = galleryImages.map((img) => ({ src: img.src, alt: img.alt }));

  const withVT: StartTransition = useCallback((cb) => {
    if (typeof document === "undefined") return cb();
    const doc = document as WithStartViewTransition;
    if (typeof doc.startViewTransition === "function") {
      doc.startViewTransition(cb);
    } else {
      cb();
    }
  }, []);

  return (
    <Section id="galeria" variant="ink" className="overflow-hidden">
      <Container>
        <div className="reveal flex flex-col gap-6 md:max-w-3xl">
          <Eyebrow number="03">Contact sheet</Eyebrow>
          <h2
            className="font-display -tracking-[0.02em] text-balance"
            style={{ fontSize: "var(--text-5xl)", lineHeight: 0.92 }}
          >
            Quadros de um <span className="serif-italic text-brand">show</span>
            .
          </h2>
        </div>
      </Container>

      <div className="mt-[clamp(3rem,6vi,6rem)] px-[clamp(1.25rem,4vw,3.5rem)]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          {galleryImages.map((img, i) => {
            const shape = GRID_PATTERN[i % GRID_PATTERN.length];
            return (
              <button
                key={`${img.src}-${i}`}
                type="button"
                onClick={() => withVT(() => setIndex(i))}
                className={`reveal group relative block w-full overflow-hidden bg-bg-raise ${shape}`}
                aria-label={`Abrir ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                  quality={90}
                  className="object-cover saturate-[0.2] transition-[filter,transform] duration-[1000ms] ease-[var(--ease-stage)] group-hover:saturate-100 group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-95"
                />
                <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-text opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="line-clamp-1 max-w-[75%] text-text">{img.alt}</span>
                  <span className="text-brand">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-border" />
              </button>
            );
          })}
        </div>
      </div>

      <Lightbox
        open={index >= 0}
        close={() => withVT(() => setIndex(-1))}
        index={index}
        slides={slides}
      />
    </Section>
  );
}
