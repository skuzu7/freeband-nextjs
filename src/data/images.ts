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
  // 2026 batch — the current line-up, shot at full shows. These are the
  // highest-resolution frames in the archive and carry the fold.
  vocalDouradoPalco: "/images/vocal-dourado-palco.jpeg",
  vocalEspelhado: "/images/vocal-espelhado.jpeg",
  palcoBandaCompleta: "/images/palco-banda-completa.jpeg",
  palcoLedCoracoes: "/images/palco-led-coracoes.jpeg",
  palcoAsasLed: "/images/palco-asas-led.jpeg",
  palcoCountryLed: "/images/palco-country-led.jpeg",
  palcoAnos70: "/images/palco-anos-70.jpeg",
  palcoCabare: "/images/palco-cabare.jpeg",
  // Wardrobe — shot backstage, one per block of the show.
  figurinoPlumas: "/images/figurino-plumas.jpeg",
  figurinoAnos50: "/images/figurino-anos-50.jpeg",
  figurinoCountry: "/images/figurino-country.jpeg",
  // The rig itself, mounted — the photographic receipt for the Pacotes list.
  bateriaFreebandNeon: "/images/bateria-freeband-neon.jpeg",
  vocalRockPb: "/images/vocal-rock-pb.jpeg",
  estruturaBoate: "/images/estrutura-boate.jpeg",
  estruturaSalao: "/images/estrutura-salao.jpeg",
  estruturaLuz: "/images/estrutura-luz.jpeg",
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
  /**
   * The photograph's NATIVE ratio. The gallery renders every frame at its
   * own aspect — a portrait file never goes into a landscape box, so nothing
   * gets amputated by object-cover.
   */
  aspect: string;
  /** object-position, for frames whose subject sits off-centre. */
  crop?: string;
}

// One landscape lead carries the section open; everything else in the archive
// is PORTRAIT phone photography, so the rest of the gallery runs as masonry
// columns with each frame at its native ratio. The previous grid forced these
// verticals into 3/2 landscape boxes and object-cover amputated half of every
// picture — dancers without legs, a drummer without his FREEBAND sign.
export const stageFrames: StageFrame[] = [
  {
    src: images.vocalDouradoPalco,
    alt: "Vocalista da Internacional Freeband cantando ao microfone sob a luz de palco",
    caption: "Frente de palco",
    weight: "lead",
    aspect: "3/2",
  },
  {
    src: images.palcoLedCoracoes,
    alt: "Bailarina em figurino azul diante do painel de LED durante o show",
    caption: "Painel de LED · efeitos 3D",
    weight: "beat",
    aspect: "1014/1600",
  },
  {
    src: images.palcoCountryLed,
    alt: "Dupla em figurino country dançando à frente da banda e do painel de LED",
    caption: "Bloco country",
    weight: "beat",
    aspect: "1112/1600",
  },
  {
    src: images.palcoCabare,
    alt: "Vocalista em figurino de cabaré à frente da banda e do painel de LED",
    caption: "Bloco cabaré",
    weight: "beat",
    aspect: "1174/1600",
  },
  {
    src: images.palcoAnos70,
    alt: "Bloco anos 70 com plumas laranja diante do painel de LED",
    caption: "Bloco anos 70",
    weight: "beat",
    aspect: "1074/1600",
  },
  // The instrumentalists — the lineup grid just promised guitars and drums.
  {
    src: images.joao,
    alt: "Vocalista de bandana vermelha à frente, com violão e guitarra ao fundo sob luz vermelha",
    caption: "Vocal e guitarras",
    weight: "beat",
    aspect: "1479/1173",
  },
  {
    src: images.palcoAsasLed,
    alt: "Bailarinos com asas iluminadas e vocalista diante do painel de LED",
    caption: "Luz cênica e efeitos",
    weight: "beat",
    aspect: "1179/1328",
  },
  {
    src: images.bateriaFreebandNeon,
    alt: "Baterista tocando diante do letreiro FREEBAND em neon no painel de LED",
    caption: "Bateria",
    weight: "beat",
    aspect: "1086/1448",
  },
];

// =============================================================================
// figurinos — the wardrobe, shot backstage. Three frames, run small and in a
// row: they are evidence that the show has blocks, not a gallery of their own.
// =============================================================================

export interface WardrobeShot {
  src: string;
  alt: string;
  caption: string;
}

export const figurinos: WardrobeShot[] = [
  {
    src: images.figurinoPlumas,
    alt: "Bailarinos em figurino vermelho com plumas e chapéus",
    caption: "Plumas",
  },
  {
    src: images.figurinoAnos50,
    alt: "Bailarinos em figurino anos 50 de poá com luvas brancas",
    caption: "Anos 50",
  },
  {
    src: images.figurinoCountry,
    alt: "Dupla em figurino country dourado com franjas e chapéu",
    caption: "Country",
  },
];

// =============================================================================
// estrutura — the mounted rig, photographed at real setups. This is the
// receipt for every line the Pacotes section lists: each caption points at a
// package feature, so a buyer can match claim to photograph one-to-one.
//
// Two landscapes and one portrait. The grid template in Pacotes.tsx sizes the
// columns 16:16:9 so all three render at the SAME height with every frame at
// its native ratio — no crop on any of them.
// =============================================================================

export interface EstruturaShot extends WardrobeShot {
  aspect: string;
}

export const estrutura: EstruturaShot[] = [
  {
    src: images.estruturaBoate,
    alt: "Estrutura de boate montada com pista de LED, painéis e iluminação em neon rosa e azul",
    caption: "Pista e painéis de LED",
    aspect: "4/3",
  },
  {
    src: images.estruturaSalao,
    alt: "Salão de evento com moving heads, esferas de luz e globos espelhados instalados no teto",
    caption: "Montagem em salão",
    aspect: "4/3",
  },
  {
    src: images.estruturaLuz,
    alt: "Feixes verdes da iluminação robotizada cruzando a pista de LED durante o ajuste",
    caption: "Iluminação robotizada",
    aspect: "3/4",
  },
];

// The one deliberately black-and-white frame in the archive — editorial, not
// documentary — reserved for the manifesto block in Historia.
export const manifestoFrame = {
  src: images.vocalRockPb,
  alt: "Vocalista de bandana e óculos escuros ao microfone com o braço estendido, em preto e branco",
} as const;

// =============================================================================
// reels — ten-second clips cut from full-show recordings. Vertical, silent and
// deliberately tiny (under 1.5 MB each): they are proof of movement, not a
// broadcast. `poster` is the clip's own first frame, so nothing pops when the
// video takes over.
// =============================================================================

export interface Reel {
  src: string;
  poster: string;
  /** What the clip shows — read out to anyone who can't watch it. */
  alt: string;
  caption: string;
}

export const reels: Reel[] = [
  {
    src: "/video/reel-baile.mp4",
    poster: "/video/reel-baile.jpg",
    alt: "Vocalista à frente da banda sob luz magenta, com o painel de LED aceso ao fundo",
    caption: "Baile · luz cênica",
  },
  {
    src: "/video/reel-led.mp4",
    poster: "/video/reel-led.jpg",
    alt: "Dois vocais cantando diante do painel de LED colorido, com a banda ao fundo",
    caption: "Painel de LED",
  },
  {
    src: "/video/reel-dancarinos.mp4",
    poster: "/video/reel-dancarinos.jpg",
    alt: "Bailarinos com asas iluminadas atravessando o palco sob lasers",
    caption: "Bailarinos e efeitos",
  },
  {
    src: "/video/reel-vocal.mp4",
    poster: "/video/reel-vocal.jpg",
    alt: "Bloco anos 70 dançando com plumas laranja sob feixes de luz",
    caption: "Bloco anos 70",
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
