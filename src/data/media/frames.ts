// src/data/media/frames.ts
// The live-show photography, curated as a programme in three acts. Order here
// IS the reading order on /palco. Nothing below ~900px on the long edge gets
// in — the old site's 600×400 thumbnails live only in the PDF.
import { images, type Photo } from './paths';

export const STAGE_CATEGORIES = ['vocais', 'blocos', 'efeitos'] as const;
export type StageCategory = (typeof STAGE_CATEGORIES)[number];

export interface StageFrame extends Photo {
  id: string;
  /** Short caption rendered under the frame — what the picture shows. */
  caption: string;
  /** Which of the three acts the frame belongs to. */
  category: StageCategory;
  /**
   * Row group inside the act. Plate 0 is the full-width lead; frames sharing
   * a plate number render side by side in one equal-height row whose column
   * widths are proportional to each frame's ratio, so every photograph stays
   * whole and the row's bottom edge stays level.
   */
  plate: number;
}

export const stageFrames: StageFrame[] = [
  // ── ATO I · vocais ─────────────────────────────────────────────────────
  {
    id: 'vocal-lead',
    src: images.vocalDouradoPalco,
    alt: 'Vocalistas da Internacional Freeband cantando ao microfone sob a luz de palco',
    caption: 'Frente de palco ao vivo · Vocais principais sob luz cênica',
    category: 'vocais',
    aspect: '2560/1706',
    plate: 0,
  },
  {
    id: 'vocal-paete',
    src: images.vocalPaete,
    alt: 'Vocalista em jaqueta de paetê cantando ao microfone sob luz cênica',
    caption: 'Performance e presença · Emoção e entrega vocal',
    category: 'vocais',
    aspect: '2010/2130',
    plate: 1,
  },
  {
    id: 'vocal-guitarras',
    src: images.joao,
    alt: 'Vocalista de bandana vermelha à frente, com violão e guitarra ao fundo sob luz vermelha',
    caption: 'Guitarras e clássicos do rock · Energia contagiante',
    category: 'vocais',
    aspect: '1479/1173',
    plate: 1,
  },
  {
    id: 'vocal-espelhado',
    src: images.vocalEspelhado,
    alt: 'Vocalista cantando ao microfone sob iluminação neon azul',
    caption: 'Figurino espelhado · Iluminação cênica em neon azul',
    category: 'vocais',
    aspect: '1170/2349',
    plate: 1,
  },
  {
    id: 'dueto-vocal-feminino',
    src: images.img0690,
    alt: 'Duas vocalistas da banda cantando juntas ao microfone com fones de retorno sob iluminação cênica',
    caption: 'Harmonia vocal ao vivo · Dueto feminino e afinação impecável',
    category: 'vocais',
    aspect: '1200/800',
    plate: 2,
  },
  {
    id: 'vocal-rock-atitude',
    src: images.vocalRockPb,
    alt: 'Vocalista de bandana e crucifixo cantando clássicos do rock com banda ao fundo',
    caption: 'Rock clássico e atitude · Presença marcante de frente de palco',
    category: 'vocais',
    aspect: '1355/903',
    plate: 2,
  },
  // ── ATO II · blocos temáticos ──────────────────────────────────────────
  {
    id: 'palco-coracoes',
    src: images.palcoLedCoracoes,
    alt: 'Bailarina em figurino azul diante do painel de LED com corações 3D',
    caption: 'Efeitos 3D no painel · Bailarinos e projeção sincronizada',
    category: 'blocos',
    aspect: '1014/1600',
    plate: 1,
  },
  {
    id: 'palco-country',
    src: images.palcoCountryLed,
    alt: 'Dupla em figurino country dançando à frente da banda e do painel de LED',
    caption: 'Bloco Country & Sertanejo · Interação total com a pista',
    category: 'blocos',
    aspect: '1074/1600',
    plate: 1,
  },
  {
    id: 'palco-cabare',
    src: images.palcoCabare,
    alt: 'Vocalista em figurino de cabaré à frente da banda e do painel de LED',
    caption: 'Bloco Cabaré · Performance teatral e figurino exclusivo',
    category: 'blocos',
    aspect: '1174/1600',
    plate: 2,
  },
  {
    id: 'palco-anos70',
    src: images.palcoAnos70,
    alt: 'Bloco anos 70 com plumas laranja diante do painel de LED',
    caption: 'Bloco Anos 70 · Plumas vibrantes e os clássicos da era disco',
    category: 'blocos',
    aspect: '1112/1600',
    plate: 2,
  },
  {
    id: 'palco-anos50',
    src: images.palcoAnos50,
    alt: 'Vocalista de jaqueta espelhada e bailarina de saia de poá do bloco anos 50 diante do painel de LED',
    caption: 'Bloco Anos 50 & Retrô · O rock de baile em poá e luvas brancas',
    category: 'blocos',
    aspect: '970/1365',
    plate: 2,
  },
  {
    id: 'bloco-anos70-baile',
    src: images.festa308,
    alt: 'Vocalista à frente do bloco anos 70, com o corpo de baile em estampas coloridas sob luz azul',
    caption: 'Corpo de baile completo · Figurinos de época e sincronia visual',
    category: 'blocos',
    aspect: '2560/1707',
    plate: 3,
  },
  {
    id: 'palco-energia',
    src: images.festa209,
    alt: 'Cantora com chapéu country e bailarinos em movimento no palco',
    caption: 'Presença de palco eletrizante · Coreografias exclusivas',
    category: 'blocos',
    aspect: '2560/1707',
    plate: 3,
  },
  // ── ATO III · luz e efeitos ────────────────────────────────────────────
  {
    id: 'palco-asas',
    src: images.palcoAsasLed,
    alt: 'Bailarinos com asas iluminadas e vocalista diante do painel de LED',
    caption: 'Luz cênica e asas de LED · Efeito visual de grande impacto',
    category: 'efeitos',
    aspect: '1179/1328',
    plate: 1,
  },
  {
    id: 'bateria-neon',
    src: images.bateriaFreebandNeon,
    alt: 'Baterista tocando diante do painel de LED aceso em neon',
    caption: 'Bateria acústica sob feixes neon · A pulsação do show',
    category: 'efeitos',
    aspect: '1086/1448',
    plate: 1,
  },
  {
    id: 'palco-banda',
    src: images.palcoBandaCompleta,
    alt: 'Banda completa no palco com onze integrantes sob iluminação robotizada e telão de LED',
    caption: 'Banda completa em cena · Onze integrantes e estrutura própria',
    category: 'efeitos',
    aspect: '1179/1438',
    plate: 1,
  },
  {
    id: 'palco-mega-producao',
    src: images.festa55,
    alt: 'Banda completa no palco sob grande jogo de luzes móveis, moving heads e telão de LED ao fundo',
    caption: 'Mega estrutura de som e luz · 100% própria, sem intermediários',
    category: 'efeitos',
    aspect: '1200/800',
    plate: 2,
  },
];

/** Frames of one act, grouped by plate in reading order. */
export function platesOf(category: StageCategory): StageFrame[][] {
  const frames = stageFrames.filter((f) => f.category === category);
  const byPlate = new Map<number, StageFrame[]>();
  for (const f of frames) byPlate.set(f.plate, [...(byPlate.get(f.plate) ?? []), f]);
  return [...byPlate.entries()].sort(([a], [b]) => a - b).map(([, v]) => v);
}

// The golden-sequin frontman beside the band's own manifesto in /historia —
// the picture that bridges the classic era and the current show.
export const retratoPaete: Photo = {
  src: images.vocalPaete,
  alt: 'Vocalista de paetê dourado cantando ao microfone com os olhos fechados, sob luz de palco',
  aspect: '2010/2130',
};
