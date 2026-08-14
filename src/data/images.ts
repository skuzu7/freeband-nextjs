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
  // Venues & Event posters
  baileTabatinga: "/images/baile-tabatinga.jpeg",
  barraBonita: "/images/barra-bonita.jpeg",
  nauticoAraraquara: "/images/nautico-araraquara.jpeg",
  freebandJau: "/images/freeband-jau.jpeg",
  freebandSocial: "/images/freeband-social.jpeg",
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

export type StageCategory = 'todos' | 'vocais' | 'blocos' | 'efeitos';

export interface StageFrame {
  id: string;
  src: string;
  alt: string;
  /** Short mono caption rendered under the frame — what the picture shows. */
  caption: string;
  weight: "lead" | "beat";
  category: StageCategory;
  /**
   * The photograph's NATIVE ratio. The gallery renders every frame at its
   * own aspect — a portrait file never goes into a landscape box, so nothing
   * gets amputated by object-cover.
   */
  aspect: string;
  /** object-position, for frames whose subject sits off-centre. */
  crop?: string;
}

// One landscape lead carries the section open; the gallery provides the live
// experience with full native aspect ratios in masonry and category filters.
export const stageFrames: StageFrame[] = [
  {
    id: "vocal-lead",
    src: images.vocalDouradoPalco,
    alt: "Vocalista da Internacional Freeband cantando ao microfone sob a luz de palco",
    caption: "Frente de palco · Vocal principal",
    weight: "lead",
    category: "vocais",
    aspect: "3/2",
  },
  {
    id: "palco-coracoes",
    src: images.palcoLedCoracoes,
    alt: "Bailarina em figurino azul diante do painel de LED durante o show",
    caption: "Painel de LED · efeitos 3D",
    weight: "beat",
    category: "blocos",
    aspect: "1014/1600",
  },
  {
    id: "palco-country",
    src: images.palcoCountryLed,
    alt: "Dupla em figurino country dançando à frente da banda e do painel de LED",
    caption: "Bloco country ao vivo",
    weight: "beat",
    category: "blocos",
    aspect: "1112/1600",
  },
  {
    id: "palco-cabare",
    src: images.palcoCabare,
    alt: "Vocalista em figurino de cabaré à frente da banda e do painel de LED",
    caption: "Bloco cabaré · performance",
    weight: "beat",
    category: "blocos",
    aspect: "1174/1600",
  },
  {
    id: "palco-anos70",
    src: images.palcoAnos70,
    alt: "Bloco anos 70 com plumas laranja diante do painel de LED",
    caption: "Bloco anos 70 · figurinos de época",
    weight: "beat",
    category: "blocos",
    aspect: "1074/1600",
  },
  {
    id: "vocal-guitarras",
    src: images.joao,
    alt: "Vocalista de bandana vermelha à frente, com violão e guitarra ao fundo sob luz vermelha",
    caption: "Vocal e guitarras · rock e hits",
    weight: "beat",
    category: "vocais",
    aspect: "1479/1173",
  },
  {
    id: "palco-asas",
    src: images.palcoAsasLed,
    alt: "Bailarinos com asas iluminadas e vocalista diante do painel de LED",
    caption: "Luz cênica e asas LED iluminadas",
    weight: "beat",
    category: "efeitos",
    aspect: "1179/1328",
  },
  {
    id: "bateria-neon",
    src: images.bateriaFreebandNeon,
    alt: "Baterista tocando diante do letreiro FREEBAND em neon no painel de LED",
    caption: "Bateria acústica · letreiro neon",
    weight: "beat",
    category: "efeitos",
    aspect: "1086/1448",
  },
  {
    id: "vocal-espelhado",
    src: images.vocalEspelhado,
    alt: "Vocalista com jaqueta espelhada de mosaico cantando sob iluminação neon azul",
    caption: "Vocal principal · jaqueta espelhada",
    weight: "beat",
    category: "vocais",
    aspect: "800/1600",
  },
  {
    id: "vocais-femininas",
    src: images.img0690,
    alt: "Duas vocalistas cantando lado a lado ao microfone sob luz quente de palco",
    caption: "Naipe de vozes femininas",
    weight: "beat",
    category: "vocais",
    aspect: "3/2",
  },
  {
    id: "bloco-psicodelico",
    src: images.festa308,
    alt: "Vocalista à frente do bloco anos 70, com bailarinos em estampas psicodélicas sob luz azul",
    caption: "Bloco anos 70 · psicodelia",
    weight: "beat",
    category: "blocos",
    aspect: "1600/1066",
  },
  {
    id: "palco-energia",
    src: images.festa209,
    alt: "Cantora com chapéu country e bailarinos em movimento no palco",
    caption: "Presença de palco e coreografia",
    weight: "beat",
    category: "blocos",
    aspect: "1600/1066",
  },
  {
    id: "palco-completo-luzes",
    src: images.festa55,
    alt: "Banda completa no palco sob feixes de luz robotizada e telão de LED",
    caption: "Banda completa · Iluminação robotizada",
    weight: "beat",
    category: "efeitos",
    aspect: "1600/1066",
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
    caption: "Plumas & Anos 70",
  },
  {
    src: images.figurinoAnos50,
    alt: "Bailarinos em figurino anos 50 de poá com luvas brancas",
    caption: "Anos 50 & Retrô",
  },
  {
    src: images.figurinoCountry,
    alt: "Dupla em figurino country dourado com franjas e chapéu",
    caption: "Country & Sertanejo",
  },
];

// =============================================================================
// estrutura — the mounted rig, photographed at real setups. This is the
// receipt for every line the Pacotes section lists: each caption points at a
// package feature, so a buyer can match claim to photograph one-to-one.
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
  tag: string;
}

export const reels: Reel[] = [
  {
    src: "/video/reel-baile.mp4",
    poster: "/video/reel-baile.jpg",
    alt: "Vocalista à frente da banda sob luz magenta, com o painel de LED aceso ao fundo",
    caption: "Baile · luz cênica",
    tag: "Luz Cênica",
  },
  {
    src: "/video/reel-led.mp4",
    poster: "/video/reel-led.jpg",
    alt: "Dois vocais cantando diante do painel de LED colorido, com a banda ao fundo",
    caption: "Painel de LED",
    tag: "Painel 3D",
  },
  {
    src: "/video/reel-dancarinos.mp4",
    poster: "/video/reel-dancarinos.jpg",
    alt: "Bailarinos com asas iluminadas atravessando o palco sob lasers",
    caption: "Bailarinos e efeitos",
    tag: "Efeitos Visuais",
  },
  {
    src: "/video/reel-vocal.mp4",
    poster: "/video/reel-vocal.jpg",
    alt: "Bloco anos 70 dançando com plumas laranja sob feixes de luz",
    caption: "Bloco anos 70",
    tag: "Show Temático",
  },
];

// =============================================================================
// posters — the gig archive. Every field below is transcribed from the artwork
// itself; nothing here is inferred. This is the section that no competitor can
// reproduce, so the metadata has to be exactly right.
// =============================================================================

export type PosterCategory = 'todos' | 'municipal' | 'clube' | 'reveillon';

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
  category: PosterCategory;
}

export const posters: Poster[] = [
  {
    src: images.barraBonita,
    alt: "Cartaz do Réveillon 2020 da Estância Turística de Barra Bonita",
    town: "Barra Bonita",
    event: "Réveillon",
    when: "2020",
    venue: "Praça do Teleférico · 28 a 31 dez",
    category: "reveillon",
  },
  {
    src: images.reveillomParanapanema,
    alt: "Cartaz do Réveillon 2017 na Praça da Matriz de Paranapanema",
    town: "Paranapanema",
    event: "Réveillon",
    when: "2017",
    venue: "Praça da Matriz · 31/12, 23h",
    municipal: true,
    category: "municipal",
  },
  {
    src: images.reveillomItatinga,
    alt: "Cartaz da Festa Virada de Ano 2023 de Itatinga",
    town: "Itatinga",
    event: "Festa Virada de Ano",
    when: "2023",
    venue: "Prefeitura Municipal · 30/12",
    municipal: true,
    category: "municipal",
  },
  {
    src: images.freebandJau,
    alt: "Cartaz do show da Internacional Freeband no Palco do Salão Social do Caiçara Clube Jaú",
    town: "Jaú",
    event: "Show Salão Social",
    when: "09/Nov",
    venue: "Caiçara Clube Jaú · Palco Social",
    category: "clube",
  },
  {
    src: images.freebandSocial,
    alt: "Cartaz do Baile do Havaí da Internacional Freeband no Clube de Campo Céu Azul",
    town: "Céu Azul",
    event: "Baile do Havaí",
    when: "07/Dez",
    venue: "Clube de Campo Céu Azul",
    category: "clube",
  },
  {
    src: images.reveillomIacanga,
    alt: "Cartaz da virada de 2026 na Praia das Palmeiras",
    town: "Iacanga",
    event: "A virada é aqui",
    when: "2026",
    venue: "Praia das Palmeiras · 22h",
    category: "reveillon",
  },
  {
    src: images.nauticoAraraquara,
    alt: "Cartaz do Arraiá do Náutico com aviso de mesas esgotadas",
    town: "Araraquara",
    event: "Arraiá do Náutico",
    when: "08/06",
    venue: "Clube Náutico · mesas esgotadas",
    category: "clube",
  },
  {
    src: images.cartazCosmopolitano,
    alt: "Cartaz do Baile do Havaí no Cosmopolitano FC",
    town: "Cosmopolitano FC",
    event: "Baile do Havaí",
    when: "—",
    venue: "Cosmopolitano Futebol Clube",
    category: "clube",
  },
  {
    src: images.baileTabatinga,
    alt: "Cartaz do Baile do Havaí em Tabatinga",
    town: "Tabatinga",
    event: "Baile do Havaí",
    when: "07/12",
    venue: "Clube de Campo de Tabatinga",
    category: "clube",
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

// Ordered chronologically, oldest first. Each alt describes the photograph that
// is actually in the file — they had drifted apart, and on a page whose whole
// argument is "this is our real archive" a caption that describes a different
// picture costs more than a missing one.
export const heritage: HeritageShot[] = [
  {
    src: images.anos70,
    alt: "Retrato sépia dos integrantes fundadores de terno, três sentados à frente do grupo",
    caption: "Os fundadores · Jaú/SP",
  },
  {
    src: images.anos90,
    alt: "Cartaz da formação dos anos 80 com sete integrantes sobre fundo de chamas e o logotipo original 'free band'",
    caption: "A formação dos anos 80",
  },
  {
    src: images.fb2015,
    alt: "Cartaz comemorativo em colagem com fotos de show e os dizeres '30 anos de sucesso'",
    caption: "Cartaz · 30 anos de sucesso",
  },
];

/**
 * `sizes` for a frame occupying `fraction` of the container on desktop.
 * Below the md breakpoint every frame is full width.
 */
export function framesSizes(fraction: number): string {
  return `(min-width: 768px) ${Math.ceil(fraction * 100)}vw, 100vw`;
}
