// src/data/images.ts
// Single source of truth for all image paths used across the landing page and PDFs.

export const images = {
  // Show photos
  festa55: "/images/festa-55.jpeg",
  festa70: "/images/festa-70.jpeg",
  festa82: "/images/festa-82.jpeg",
  festa209: "/images/festa-209.jpeg",
  festa308: "/images/festa-308.jpeg",
  // Performance photos
  img0437: "/images/img-0437.jpeg",
  img0679: "/images/img-0679.jpeg",
  img0690: "/images/img-0690.jpeg",
  img0867: "/images/img-0867.jpeg",
  // People
  joao: "/images/joao.jpeg",
  // Venues
  baileTabatinga: "/images/baile-tabatinga.jpeg",
  barraBonita: "/images/barra-bonita.jpeg",
  nauticoAraraquara: "/images/nautico-araraquara.jpeg",
  // Historical / vintage
  anos70: "/images/freeband-anos-70.jpeg",
  anos90: "/images/freeband-anos-90.jpeg",
  antigas: "/images/freeband-antigas.jpeg",
  antidas: "/images/freeband-antidas.jpeg",
  fbJau: "/images/freeband-jau.jpeg",
  // Promotional
  fb2015: "/images/freeband-2015.jpeg",
  cartazCosmopolitano: "/images/cartaz-cosmopolitano.jpeg",
  social: "/images/freeband-social.jpeg",
  // New Year events
  reveillomIacanga: "/images/reveillom-iacanga.jpeg",
  reveillomItatinga: "/images/reveillom-itatinga.jpeg",
  reveillomParanapanema: "/images/reveillom-paranapanema.jpeg",
} as const;

export type ImageKey = keyof typeof images;

export const galleryImages: { src: string; alt: string }[] = [
  { src: images.festa55, alt: "Show Freeband" },
  { src: images.festa70, alt: "Show com dançarinas" },
  { src: images.festa82, alt: "Show especial" },
  { src: images.festa209, alt: "Apresentação em festa" },
  { src: images.festa308, alt: "Palco iluminado" },
  { src: images.img0437, alt: "Apresentação ao vivo" },
  { src: images.img0679, alt: "Performance" },
  { src: images.img0690, alt: "Palco" },
  { src: images.img0867, alt: "Show noturno" },
  { src: images.joao, alt: "Músico João" },
  { src: images.baileTabatinga, alt: "Baile Tabatinga" },
  { src: images.barraBonita, alt: "Show em Barra Bonita" },
  { src: images.nauticoAraraquara, alt: "Náutico Araraquara" },
  { src: images.reveillomIacanga, alt: "Reveillon Iacanga" },
  { src: images.reveillomItatinga, alt: "Reveillon Itatinga" },
  { src: images.reveillomParanapanema, alt: "Reveillon Paranapanema" },
  { src: images.anos70, alt: "Freeband anos 70" },
  { src: images.anos90, alt: "Freeband anos 90" },
  { src: images.antigas, alt: "Freeband antigas" },
  { src: images.antidas, alt: "Freeband - arquivo histórico" },
  { src: images.fbJau, alt: "Freeband em Jaú" },
  { src: images.fb2015, alt: "Freeband 2015" },
  { src: images.cartazCosmopolitano, alt: "Cartaz Cosmopolitano" },
  { src: images.social, alt: "Freeband - divulgação" },
];

// Curated set used in the Historia timeline section
export const historiaImages = [
  { src: images.anos70, caption: "1969-1979 - Os primeiros anos" },
  { src: images.anos90, caption: "Década de 90 - Consolidação" },
  { src: images.fb2015, caption: "2015 - Nova geração" },
  { src: images.festa55, caption: "Hoje - Mais de 55 anos de estrada" },
];
