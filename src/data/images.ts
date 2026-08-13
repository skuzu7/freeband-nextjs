// src/data/images.ts
// Single source of truth for all image paths used across the landing page and PDFs.
//
// The archive holds three genuinely different kinds of picture, and the site
// treats them differently because they are not interchangeable:
//
//   stageFrames — real live-show photography, high enough resolution to run
//                 large, shot under saturated stage light. These run in FULL
//                 COLOUR. Desaturating them throws away the one thing that
//                 makes them persuasive.
//   posters     — actual event flyers from real gigs. They are not photographs
//                 and must never get a "cinematic grade": they are artefacts,
//                 presented as artefacts, and the town + date on each one is
//                 the credential.
//   heritage    — the pre-digital band shots. Already faded; graded warm.

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
  // Promotional
  fb2015: "/images/freeband-2015.jpeg",
  cartazCosmopolitano: "/images/cartaz-cosmopolitano.jpeg",
  // New Year events
  reveillomIacanga: "/images/reveillom-iacanga.jpeg",
  reveillomItatinga: "/images/reveillom-itatinga.jpeg",
  reveillomParanapanema: "/images/reveillom-paranapanema.jpeg",
} as const;

export type ImageKey = keyof typeof images;

// =============================================================================
// stageFrames — the live-show photography.
// `weight` drives the editorial layout: "lead" frames get the big slots, "beat"
// frames fill the rhythm between them. Ordered as they should read down-page.
// =============================================================================

export interface StageFrame {
  src: string;
  alt: string;
  /** Short mono caption rendered under the frame — what the picture shows. */
  caption: string;
  weight: "lead" | "beat";
  aspect: string;
  /** object-position, for frames whose subject sits off-centre. */
  crop?: string;
}

// Six frames, not nine. Every picture here runs at least 460px tall, so nine
// of them made the section five thousand pixels of photo dump rather than an
// edit. `lead` frames are cropped to 16/9 so they read as cinematic bands
// instead of near-square walls; the two strongest shots in the archive
// (festa-308, festa-209) are spent on the hero and the closing section.
export const stageFrames: StageFrame[] = [
  {
    src: images.festa70,
    alt: "Banda completa e bailarinas em figurino sob luz azul de palco",
    caption: "Banda completa · 11 no palco",
    weight: "lead",
    aspect: "16/9",
  },
  {
    src: images.img0690,
    alt: "Duas vocalistas cantando lado a lado ao microfone",
    caption: "Dois vocais na frente",
    weight: "beat",
    aspect: "3/2",
  },
  {
    src: images.img0679,
    alt: "Cantora ao microfone sob luz de palco",
    caption: "Vocal",
    weight: "beat",
    aspect: "3/2",
    crop: "center 35%",
  },
  {
    src: images.festa82,
    alt: "Apresentação com plumas vermelhas e a banda ao fundo",
    caption: "Bloco de dança · figurino",
    weight: "lead",
    aspect: "16/9",
  },
  {
    src: images.img0867,
    alt: "Guitarrista tocando sob feixes de luz amarela",
    caption: "Guitarra",
    weight: "beat",
    aspect: "3/2",
  },
  {
    src: images.img0437,
    alt: "Baterista tocando com a bateria iluminada em verde",
    caption: "Bateria",
    weight: "beat",
    aspect: "3/2",
  },
];

// =============================================================================
// posters — the gig archive. Every field below is transcribed from the artwork
// itself; nothing here is inferred. This is the section that no competitor can
// reproduce, so the metadata has to be exactly right.
// =============================================================================

export interface Poster {
  src: string;
  alt: string;
  /** Town, as printed on the flyer. */
  town: string;
  /** Event name, as printed. */
  event: string;
  /** Year as printed, or the date when the flyer carries no year. */
  when: string;
  /** Venue or promoter line, as printed. */
  venue?: string;
  /** True when a city hall is the named promoter. */
  municipal?: boolean;
}

export const posters: Poster[] = [
  {
    src: images.barraBonita,
    alt: "Cartaz do Réveillon 2020 da Estância Turística de Barra Bonita",
    town: "Barra Bonita",
    event: "Réveillon",
    when: "2020",
    venue: "Praça do Teleférico · 28 a 31 dez",
  },
  {
    src: images.reveillomParanapanema,
    alt: "Cartaz do Réveillon 2017 na Praça da Matriz de Paranapanema",
    town: "Paranapanema",
    event: "Réveillon",
    when: "2017",
    venue: "Praça da Matriz · 31/12, 23h",
    municipal: true,
  },
  {
    src: images.reveillomItatinga,
    alt: "Cartaz da Festa Virada de Ano 2023 de Itatinga",
    town: "Itatinga",
    event: "Festa Virada de Ano",
    when: "2023",
    venue: "Prefeitura Municipal · 30/12",
    municipal: true,
  },
  {
    src: images.reveillomIacanga,
    alt: "Cartaz da virada de 2026 na Praia das Palmeiras",
    town: "Iacanga",
    event: "A virada é aqui",
    when: "2026",
    venue: "Praia das Palmeiras · 22h",
  },
  {
    src: images.nauticoAraraquara,
    alt: "Cartaz do Arraiá do Náutico com aviso de mesas esgotadas",
    town: "Araraquara",
    event: "Arraiá do Náutico",
    when: "08/06",
    venue: "Clube Náutico · mesas esgotadas",
  },
  {
    src: images.cartazCosmopolitano,
    alt: "Cartaz do Baile do Havaí no Cosmopolitano FC",
    town: "Cosmopolitano FC",
    event: "Baile do Havaí",
    when: "—",
  },
  {
    src: images.baileTabatinga,
    alt: "Cartaz do Baile do Havaí em Tabatinga",
    town: "Tabatinga",
    event: "Baile do Havaí",
    when: "07/12",
  },
];

// =============================================================================
// heritage — pre-digital band photography, used by the history section.
// =============================================================================

export interface HeritageShot {
  src: string;
  alt: string;
  caption: string;
}

export const heritage: HeritageShot[] = [
  {
    src: images.anos90,
    alt: "Retrato em preto e branco de três integrantes fundadores",
    caption: "Os fundadores",
  },
  {
    src: images.anos70,
    alt: "A banda Free Band posando nos anos 70",
    caption: "Anos 70",
  },
  {
    src: images.fb2015,
    alt: "A Internacional Freeband em 2015",
    caption: "2015",
  },
];

/**
 * `sizes` for a frame occupying `fraction` of the container on desktop.
 * Below the md breakpoint every frame is full width.
 */
export function framesSizes(fraction: number): string {
  return `(min-width: 768px) ${Math.ceil(fraction * 100)}vw, 100vw`;
}
