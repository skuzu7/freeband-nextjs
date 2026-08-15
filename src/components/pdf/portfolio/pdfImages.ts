// src/components/pdf/portfolio/pdfImages.ts
// Absolute URLs for images that the PDF pipeline can fetch at render time.
// @react-pdf/renderer needs reachable URLs (not relative paths) when rendered
// in the browser.

import { images } from "@/data/images";

// Only the keys the portfolio PDF actually renders. Adding megabyte-scale
// originals here would embed them into the client-generated PDF.
const pdfImagePaths = {
  festa55: images.festa55,
  festa70: images.festa70,
  festa82: images.festa82,
  img0437: images.img0437,
  img0679: images.img0679,
  img0690: images.img0690,
  img0867: images.img0867,
  joao: images.joao,
  baileTabatinga: images.baileTabatinga,
  nauticoAraraquara: images.nauticoAraraquara,
  anos70: images.anos70,
  anos80: images.anos80,
  anos90: images.anos90,
  antigas: images.antigas,
  fb2015: images.fb2015,
  cartazCosmopolitano: images.cartazCosmopolitano,
  reveillomIacanga: images.reveillomIacanga,
  reveillomItatinga: images.reveillomItatinga,
} as const;

export type PdfImageKey = keyof typeof pdfImagePaths;

// The origin is resolved at property-access time (not at import time), so an
// accidental SSR import can't bake an empty prefix into every URL.
export const pdfImages: Record<PdfImageKey, string> = new Proxy(
  pdfImagePaths as Record<PdfImageKey, string>,
  {
    get(target, key) {
      const path = target[key as PdfImageKey];
      if (typeof path !== "string") return path;
      const prefix =
        typeof window !== "undefined" ? window.location.origin : "";
      return `${prefix}${path}`;
    },
  },
);
