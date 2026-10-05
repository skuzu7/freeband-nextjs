// src/data/media/frames.ts
// The live-show photography, curated as a programme in three acts. Order here
// IS the reading order on /palco. Nothing below ~900px on the long edge gets
// in — the old site's 600×400 thumbnails live only in the PDF.
import { images, type CaptionedPhoto, type Photo } from './paths';

export const STAGE_CATEGORIES = ['vocais', 'blocos', 'efeitos'] as const;
export type StageCategory = (typeof STAGE_CATEGORIES)[number];

export interface StageFrame extends CaptionedPhoto {
  id: string;
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
  // Clube Náutico Araraquara (Jonas Matheus): the four voices as the lead of
  // their own row, then the singers one by one.
  {
    id: 'nautico-quatro-vozes',
    src: images.nauticoQuatroVozes,
    alt: 'Quatro vocalistas na linha de frente do palco cantando diante do painel de LED',
    caption: 'Quatro vozes na linha de frente · Cantoras e cantores ao vivo',
    category: 'vocais',
    aspect: '1465/888',
    plate: 3,
  },
  {
    id: 'nautico-voz-feminina',
    src: images.nauticoVozFeminina,
    alt: 'Cantora de colete preto cantando ao microfone com a mão erguida diante do painel de LED',
    caption: 'Voz feminina em primeiro plano · Painel de LED ao fundo',
    category: 'vocais',
    aspect: '1465/888',
    plate: 4,
  },
  {
    id: 'nautico-dois-vocalistas',
    src: images.nauticoDoisVocalistas,
    alt: 'Vocalista de jaqueta espelhada e óculos escuros cantando ao microfone, com outro vocalista em primeiro plano',
    caption: 'Dois vocalistas frente a frente · Energia de palco',
    category: 'vocais',
    aspect: '1465/888',
    plate: 4,
  },
  {
    id: 'nautico-vocalistas-palco',
    src: images.nauticoVocalistasPalco,
    alt: 'Vocalista de cabelos longos cantando ao microfone ao lado de vocalista de jaqueta espelhada, sob luz verde',
    caption: 'Dupla de vocalistas · Frente de palco sob luz verde',
    category: 'vocais',
    aspect: '955/1365',
    plate: 5,
  },
  {
    id: 'nautico-vocal-bandana',
    src: images.nauticoVocalBandana,
    alt: 'Vocalista de bandana vermelha e camisa floral cantando ao microfone sob luz verde',
    caption: 'Rock de bandana · Voz em primeiro plano',
    category: 'vocais',
    aspect: '1465/888',
    plate: 5,
  },
  {
    id: 'nautico-vocal-floral',
    src: images.nauticoVocalFloral,
    alt: 'Vocalista de bandana vermelha e casaco floral cantando de braço aberto sob feixes de luz',
    caption: 'Presença de palco · Clássicos do rock',
    category: 'vocais',
    aspect: '955/1365',
    plate: 5,
  },
  {
    id: 'palco-frente-havai',
    src: images.palcoFrenteHavai,
    alt: 'Vocalistas ao microfone no centro do palco e bailarinas nas pontas com os braços erguidos, sob luz vermelha e treliças de iluminação',
    caption: 'Frente de palco completa · Vocalistas e bailarinas no Baile do Havaí',
    category: 'vocais',
    aspect: '2048/1150',
    plate: 6,
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
    aspect: '955/1365',
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
  // Clube Náutico Araraquara (Jonas Matheus): the circus block, then the
  // dancers on either side of the anos 50 block in full swing.
  {
    id: 'nautico-bloco-circo',
    src: images.nauticoBlocoCirco,
    alt: 'Vocalista de jaqueta espelhada entre bailarino e bailarina de cartola e casaca vermelha, com fumaça no palco',
    caption: 'Bloco de circo · Coreografia de cartolas e casacas vermelhas',
    category: 'blocos',
    aspect: '1465/888',
    plate: 4,
  },
  {
    id: 'nautico-circo-frente',
    src: images.nauticoCircoFrente,
    alt: 'Vocalista de jaqueta espelhada cantando à frente de bailarinos de cartola e casaca vermelha diante do painel de LED',
    caption: 'Bloco de circo · Vocal e corpo de baile na frente do palco',
    category: 'blocos',
    aspect: '1465/888',
    plate: 4,
  },
  {
    id: 'nautico-bailarina-circo',
    src: images.nauticoBailarinaCirco,
    alt: 'Bailarina de cartola e casaca vermelha sorrindo em cena diante do painel de LED',
    caption: 'Bailarina do bloco de circo · Cartola e casaca vermelha',
    category: 'blocos',
    aspect: '955/1365',
    plate: 5,
  },
  {
    id: 'nautico-bloco-anos-50',
    src: images.nauticoBlocoAnos50,
    alt: 'Vocalista de jaqueta espelhada entre duas bailarinas de saia de poá rodando, com a banda e o painel de LED ao fundo',
    caption: 'Bloco Anos 50 em cena · Saias de poá em movimento',
    category: 'blocos',
    aspect: '1465/888',
    plate: 5,
  },
  {
    id: 'nautico-bailarino-circo',
    src: images.nauticoBailarinoCirco,
    alt: 'Bailarino de cartola e casaca vermelha com as mãos na cintura no palco',
    caption: 'Bailarino do bloco de circo · Figurino de apresentador',
    category: 'blocos',
    aspect: '955/1365',
    plate: 5,
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
  // Clube Náutico Araraquara (Jonas Matheus): the panel and the rig from the
  // floor, then the drums and the keys under the beams.
  {
    id: 'nautico-banda-triangulo',
    src: images.nauticoBandaTriangulo,
    alt: 'Banda no palco diante do painel de LED com triângulos de luz, vocalistas à frente e teclados e bateria ao fundo',
    caption: 'Painel de LED em cena · Banda completa e fumaça no palco',
    category: 'efeitos',
    aspect: '1465/888',
    plate: 3,
  },
  {
    id: 'nautico-palco-luzes',
    src: images.nauticoPalcoLuzes,
    alt: 'Palco visto da pista com treliças, moving heads em feixes rosa e roxos, painel de LED e a banda em cena',
    caption: 'Treliças, moving heads e painel de LED · Estrutura completa em operação',
    category: 'efeitos',
    aspect: '1465/888',
    plate: 3,
  },
  {
    id: 'nautico-baterista',
    src: images.nauticoBaterista,
    alt: 'Baterista de chapéu e óculos tocando entre os pratos, com o painel de LED ao fundo',
    caption: 'Bateria ao vivo · O pulso do baile',
    category: 'efeitos',
    aspect: '1465/888',
    plate: 4,
  },
  {
    id: 'nautico-teclado-feixes',
    src: images.nauticoTecladoFeixes,
    alt: 'Vocalista de bandana vermelha tocando teclado sob feixes de luz azul e treliças',
    caption: 'Teclado sob feixes azuis · Iluminação robotizada',
    category: 'efeitos',
    aspect: '955/1365',
    plate: 4,
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
