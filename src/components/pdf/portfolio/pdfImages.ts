// src/components/pdf/portfolio/pdfImages.ts
// Absolute URLs for images that the PDF pipeline can fetch at render time.
// @react-pdf/renderer needs reachable URLs (not relative paths) when rendered
// in the browser, so we prefix every path with the current window.location.origin.

import { images } from "@/data/images";

const prefix = typeof window !== "undefined" ? window.location.origin : "";

function toUrl(path: string): string {
  return `${prefix}${path}`;
}

export const pdfImages = {
  festa55: toUrl(images.festa55),
  festa70: toUrl(images.festa70),
  festa82: toUrl(images.festa82),
  festa209: toUrl(images.festa209),
  festa308: toUrl(images.festa308),
  img0437: toUrl(images.img0437),
  img0679: toUrl(images.img0679),
  img0690: toUrl(images.img0690),
  img0867: toUrl(images.img0867),
  joao: toUrl(images.joao),
  baileTabatinga: toUrl(images.baileTabatinga),
  barraBonita: toUrl(images.barraBonita),
  nauticoAraraquara: toUrl(images.nauticoAraraquara),
  anos70: toUrl(images.anos70),
  anos90: toUrl(images.anos90),
  antigas: toUrl(images.antigas),
  antidas: toUrl(images.antidas),
  fbJau: toUrl(images.fbJau),
  fb2015: toUrl(images.fb2015),
  cartazCosmopolitano: toUrl(images.cartazCosmopolitano),
  social: toUrl(images.social),
  reveillomIacanga: toUrl(images.reveillomIacanga),
  reveillomItatinga: toUrl(images.reveillomItatinga),
  reveillomParanapanema: toUrl(images.reveillomParanapanema),
} as const;

export type PdfImageKey = keyof typeof pdfImages;
