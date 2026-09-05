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
    alt: 'Dois vocalistas da Internacional Freeband cantando ao microfone, um de jaqueta dourada bordada, sob a luz de palco',
    caption: 'Frente de palco · vocal principal',
    category: 'vocais',
    aspect: '2560/1706',
    plate: 0,
  },
  {
    id: 'vocal-guitarras',
    src: images.joao,
    alt: 'Vocalista de bandana vermelha à frente, com violão e guitarra ao fundo sob luz vermelha',
    caption: 'Vocal e guitarras · rock e hits',
    category: 'vocais',
    aspect: '1479/1173',
    plate: 1,
  },
  {
    id: 'vocal-espelhado',
    src: images.vocalEspelhado,
    alt: 'Vocalista cantando ao microfone sob iluminação neon azul',
    caption: 'Vocal principal · ao vivo',
    category: 'vocais',
    aspect: '1170/2349',
    plate: 1,
  },
  {
    id: 'vocais-femininas',
    src: images.img0690,
    alt: 'Duas vocalistas cantando lado a lado ao microfone sob luz quente de palco',
    caption: 'Vocalistas',
    category: 'vocais',
    aspect: '1200/800',
    plate: 1,
  },
  // ── ATO II · blocos temáticos ──────────────────────────────────────────
  {
    id: 'palco-coracoes',
    src: images.palcoLedCoracoes,
    alt: 'Bailarina em figurino azul diante do painel de LED durante o show',
    caption: 'Painel de LED · efeitos 3D',
    category: 'blocos',
    aspect: '1014/1600',
    plate: 1,
  },
  {
    id: 'palco-country',
    src: images.palcoCountryLed,
    alt: 'Dupla em figurino country dançando à frente da banda e do painel de LED',
    caption: 'Bloco country ao vivo',
    category: 'blocos',
    aspect: '1112/1600',
    plate: 1,
  },
  {
    id: 'palco-cabare',
    src: images.palcoCabare,
    alt: 'Vocalista em figurino de cabaré à frente da banda e do painel de LED',
    caption: 'Bloco cabaré · performance',
    category: 'blocos',
    aspect: '1174/1600',
    plate: 2,
  },
  {
    id: 'palco-anos70',
    src: images.palcoAnos70,
    alt: 'Bloco anos 70 com plumas laranja diante do painel de LED',
    caption: 'Bloco anos 70 · figurinos de época',
    category: 'blocos',
    aspect: '1074/1600',
    plate: 2,
  },
  {
    id: 'bloco-anos70-baile',
    src: images.festa308,
    alt: 'Vocalista à frente do bloco anos 70, com o corpo de baile em estampas coloridas sob luz azul',
    caption: 'Bloco anos 70 · corpo de baile',
    category: 'blocos',
    aspect: '2560/1707',
    plate: 3,
  },
  {
    id: 'palco-energia',
    src: images.festa209,
    alt: 'Cantora com chapéu country e bailarinos em movimento no palco',
    caption: 'Presença de palco e coreografia',
    category: 'blocos',
    aspect: '2560/1707',
    plate: 3,
  },
  // ── ATO III · luz e efeitos ────────────────────────────────────────────
  {
    id: 'palco-asas',
    src: images.palcoAsasLed,
    alt: 'Bailarinos com asas iluminadas e vocalista diante do painel de LED',
    caption: 'Luz cênica e asas LED iluminadas',
    category: 'efeitos',
    aspect: '1179/1328',
    plate: 1,
  },
  {
    id: 'bateria-neon',
    src: images.bateriaFreebandNeon,
    alt: 'Baterista tocando diante do painel de LED aceso em neon',
    caption: 'Bateria acústica · painel em neon',
    category: 'efeitos',
    aspect: '1086/1448',
    plate: 1,
  },
  {
    id: 'palco-completo-luzes',
    src: images.festa55,
    alt: 'Banda completa no palco sob feixes de luz robotizada e telão de LED',
    caption: 'Banda completa · iluminação robotizada',
    category: 'efeitos',
    aspect: '1200/800',
    plate: 1,
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
