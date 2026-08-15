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
  // vocal-dourado-palco is re-encoded from a 4331×2887 pro-camera original.
  vocalDouradoPalco: "/images/vocal-dourado-palco.jpeg",
  vocalEspelhado: "/images/vocal-espelhado.jpeg",
  palcoBandaCompleta: "/images/palco-banda-completa.jpeg",
  palcoLedCoracoes: "/images/palco-led-coracoes.jpeg",
  palcoAsasLed: "/images/palco-asas-led.jpeg",
  palcoCountryLed: "/images/palco-country-led.jpeg",
  palcoAnos70: "/images/palco-anos-70.jpeg",
  palcoCabare: "/images/palco-cabare.jpeg",
  // Golden sequin frontman, 2010×2130 camera scan — the manifesto frame.
  vocalPaete: "/images/vocal-paete-ouro.jpeg",
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
  // Show photos — festa-209/308 are 2560px pro-camera frames.
  festa55: "/images/festa-55.jpeg",
  festa209: "/images/festa-209.jpeg",
  festa308: "/images/festa-308.jpeg",
  img0690: "/images/img-0690.jpeg",
  // 600×400 thumbnails from the band's old site. NEVER put these in the web
  // galleries — they only survive here because the portfolio PDF prints them
  // small. The web gallery floor is ~900px on the long edge (see the test).
  festa70: "/images/festa-70.jpeg",
  festa82: "/images/festa-82.jpeg",
  img0437: "/images/img-0437.jpeg",
  img0679: "/images/img-0679.jpeg",
  img0867: "/images/img-0867.jpeg",
  // People
  joao: "/images/joao.jpeg",
  // Venues & Event posters
  baileTabatinga: "/images/baile-tabatinga.jpeg",
  barraBonita: "/images/barra-bonita.jpeg",
  nauticoAraraquara: "/images/nautico-araraquara.jpeg",
  freebandJau: "/images/freeband-jau.jpeg",
  freebandSocial: "/images/freeband-social.jpeg",
  // Historical / vintage — anos-70/80/antigas/2015 are re-encoded WHOLE from
  // the originals in Desktop/Freeband/_originais (the site used to serve
  // 500×350 crops of them).
  anos70: "/images/freeband-anos-70.jpeg",
  anos80: "/images/freeband-anos-80.jpeg",
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

export type StageCategory = 'vocais' | 'blocos' | 'efeitos';

export interface StageFrame {
  id: string;
  src: string;
  alt: string;
  /** Short mono caption rendered under the frame — what the picture shows. */
  caption: string;
  weight: "lead" | "beat";
  /** Which of the three acts of the gallery the frame belongs to. */
  category: StageCategory;
  /**
   * The photograph's NATIVE pixel dimensions as "W/H". The gallery renders
   * every frame at its own aspect — a portrait file never goes into a
   * landscape box, so nothing gets amputated by object-cover. The integrity
   * test compares these against the real files on disk.
   */
  aspect: string;
  /**
   * Row group inside the act. Plate 0 is the full-width lead; frames sharing
   * a plate number render side by side in one equal-height row whose column
   * widths are proportional to each frame's ratio (so every photograph stays
   * whole and the row's bottom edge stays level).
   */
  plate: number;
}

// The gallery is a programme in three acts (vocais → blocos → efeitos), each
// act composed of "plates": deterministic equal-height rows built from the
// photographs' own ratios. Order here IS the reading order on the page.
// Curation rule: nothing below ~900px on the long edge gets in — the old
// site's 600×400 thumbnails live only in the PDF.
export const stageFrames: StageFrame[] = [
  // ── ATO I · vocais ─────────────────────────────────────────────────────
  {
    id: "vocal-lead",
    src: images.vocalDouradoPalco,
    alt: "Dois vocalistas da Internacional Freeband cantando ao microfone, um de jaqueta dourada bordada, sob a luz de palco",
    caption: "Frente de palco · vocal principal",
    weight: "lead",
    category: "vocais",
    aspect: "2560/1706",
    plate: 0,
  },
  {
    id: "vocal-guitarras",
    src: images.joao,
    alt: "Vocalista de bandana vermelha à frente, com violão e guitarra ao fundo sob luz vermelha",
    caption: "Vocal e guitarras · rock e hits",
    weight: "beat",
    category: "vocais",
    aspect: "1479/1173",
    plate: 1,
  },
  {
    id: "vocal-espelhado",
    src: images.vocalEspelhado,
    alt: "Vocalista com jaqueta espelhada de mosaico cantando sob iluminação neon azul",
    caption: "Vocal principal · jaqueta espelhada",
    weight: "beat",
    category: "vocais",
    aspect: "1170/2349",
    plate: 1,
  },
  {
    id: "vocais-femininas",
    src: images.img0690,
    alt: "Duas vocalistas cantando lado a lado ao microfone sob luz quente de palco",
    caption: "Naipe de vozes femininas",
    weight: "beat",
    category: "vocais",
    aspect: "1200/800",
    plate: 1,
  },
  // ── ATO II · blocos temáticos ──────────────────────────────────────────
  {
    id: "palco-coracoes",
    src: images.palcoLedCoracoes,
    alt: "Bailarina em figurino azul diante do painel de LED durante o show",
    caption: "Painel de LED · efeitos 3D",
    weight: "beat",
    category: "blocos",
    aspect: "1014/1600",
    plate: 1,
  },
  {
    id: "palco-country",
    src: images.palcoCountryLed,
    alt: "Dupla em figurino country dançando à frente da banda e do painel de LED",
    caption: "Bloco country ao vivo",
    weight: "beat",
    category: "blocos",
    aspect: "1112/1600",
    plate: 1,
  },
  {
    id: "palco-cabare",
    src: images.palcoCabare,
    alt: "Vocalista em figurino de cabaré à frente da banda e do painel de LED",
    caption: "Bloco cabaré · performance",
    weight: "beat",
    category: "blocos",
    aspect: "1174/1600",
    plate: 2,
  },
  {
    id: "palco-anos70",
    src: images.palcoAnos70,
    alt: "Bloco anos 70 com plumas laranja diante do painel de LED",
    caption: "Bloco anos 70 · figurinos de época",
    weight: "beat",
    category: "blocos",
    aspect: "1074/1600",
    plate: 2,
  },
  {
    id: "bloco-anos70-baile",
    src: images.festa308,
    alt: "Vocalista à frente do bloco anos 70, com o corpo de baile em estampas coloridas sob luz azul",
    caption: "Bloco anos 70 · corpo de baile",
    weight: "beat",
    category: "blocos",
    aspect: "2560/1707",
    plate: 3,
  },
  {
    id: "palco-energia",
    src: images.festa209,
    alt: "Cantora com chapéu country e bailarinos em movimento no palco",
    caption: "Presença de palco e coreografia",
    weight: "beat",
    category: "blocos",
    aspect: "2560/1707",
    plate: 3,
  },
  // ── ATO III · luz e efeitos ────────────────────────────────────────────
  {
    id: "palco-asas",
    src: images.palcoAsasLed,
    alt: "Bailarinos com asas iluminadas e vocalista diante do painel de LED",
    caption: "Luz cênica e asas LED iluminadas",
    weight: "beat",
    category: "efeitos",
    aspect: "1179/1328",
    plate: 1,
  },
  {
    id: "bateria-neon",
    src: images.bateriaFreebandNeon,
    alt: "Baterista tocando diante do letreiro FREEBAND em neon no painel de LED",
    caption: "Bateria acústica · letreiro neon",
    weight: "beat",
    category: "efeitos",
    aspect: "1086/1448",
    plate: 1,
  },
  {
    id: "palco-completo-luzes",
    src: images.festa55,
    alt: "Banda completa no palco sob feixes de luz robotizada e telão de LED",
    caption: "Banda completa · iluminação robotizada",
    weight: "beat",
    category: "efeitos",
    aspect: "1200/800",
    plate: 1,
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

// The frame beside the band's own manifesto in Historia: the golden-sequin
// frontman, scanned from the archive at 2010×2130 — the picture that bridges
// the band's classic era and the current show.
export const manifestoFrame = {
  src: images.vocalPaete,
  alt: "Vocalista de paetê dourado cantando ao microfone com os olhos fechados, sob luz de palco",
  aspect: "2010/2130",
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

// All four clips are cut from the band's own AVCHD camera footage
// (1440×1080i masters), deinterlaced and delivered at 1280×720/30.
export const reels: Reel[] = [
  {
    src: "/video/reel-dueto.mp4",
    poster: "/video/reel-dueto.jpg",
    alt: "Dueto de vocalistas à frente do letreiro Internacional Freeband aceso no painel de LED",
    caption: "Dueto · letreiro Freeband",
    tag: "Vozes",
  },
  {
    src: "/video/reel-vocal-rock.mp4",
    poster: "/video/reel-vocal-rock.jpg",
    alt: "Vocalista de bandana cantando em close sob luz azul e magenta",
    caption: "Bloco rock · frente de palco",
    tag: "Blocos",
  },
  {
    src: "/video/reel-vocal-fem.mp4",
    poster: "/video/reel-vocal-fem.jpg",
    alt: "Vocalista cantando em close sob luz magenta, com o painel de LED ao fundo",
    caption: "Vocal feminino · ao vivo",
    tag: "Vozes",
  },
  {
    src: "/video/reel-guitarra.mp4",
    poster: "/video/reel-guitarra.jpg",
    alt: "Guitarrista em solo sob luz azul, com uma guitarra gigante no telão de LED",
    caption: "Solo de guitarra",
    tag: "A banda",
  },
];

// The hero fold: a twelve-second wide of the full stage under the moving-head
// show, looping silently behind the wordmark. The poster is the loop's own
// first frame, so the video takes over without a visible scene change.
export const heroMedia = {
  video: "/video/hero-loop.mp4",
  poster: "/video/hero-loop.jpg",
  alt: "Palco completo da Internacional Freeband sob feixes de luz robotizada e fumaça, com o painel de LED em triângulos",
} as const;

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

// The pre-digital band photography now lives inside `timeline` in
// src/data/content.ts — each era of the history section carries its own
// archival photograph, whole, at the file's native ratio.

/**
 * `sizes` for a frame occupying `fraction` of the container on desktop.
 * Below the md breakpoint every frame is full width.
 */
export function framesSizes(fraction: number): string {
  return `(min-width: 768px) ${Math.ceil(fraction * 100)}vw, 100vw`;
}
