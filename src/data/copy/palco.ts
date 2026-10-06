// src/data/copy/palco.ts
// /palco — the full gallery: three acts, wardrobe, rig, the four clips.
import { lineupLabel, releaseShort } from '../band';
import type { StageCategory } from '../media/frames';
import type { ViewerLabels } from '../media/gallery';

export interface Act {
  numeral: string;
  key: StageCategory;
  title: string;
  note: string;
}

export const palco = {
  seo: {
    title: 'O palco',
    description: `${releaseShort} Registros 100% autênticos de shows nossos — sem fotos de banco de imagens.`,
    // The line under the title on the share card (opengraph-image.tsx).
    cardLine: 'Fotos e vídeos reais dos nossos shows, sem banco de imagens.',
  },
  label: 'O palco',
  headline: 'O espetáculo ao vivo,\ndo primeiro ao último acorde.',
  lead: `${releaseShort} Todas as fotografias abaixo são registros reais dos nossos eventos — sem modelos ou fotos de banco de imagens.`,
  lineupLabel,
  lineupNote: 'Tudo ao vivo',
  // The gallery reads as a programme in three acts. Keys match the
  // StageFrame categories in src/data/media/frames.ts.
  actWord: 'Ato',
  acts: [
    {
      numeral: 'I',
      key: 'vocais',
      title: 'Vozes & Frente de Palco',
      note: 'Quatro vocalistas principais — duas cantoras e dois cantores —, harmonias ao vivo, solos de guitarra e dinâmica contagiante.',
    },
    {
      numeral: 'II',
      key: 'blocos',
      title: 'A Jornada dos Blocos Temáticos',
      note: 'Anos 50, anos 70, country e cabaré: figurinos de época, coreografias sincronizadas e efeitos visuais no painel de LED que transformam a pista a cada virada.',
    },
    {
      numeral: 'III',
      key: 'efeitos',
      title: 'Luz, LED & Alta Tecnologia',
      note: 'Moving heads e feixes robotizados sincronizados via timecode, painel de LED de alta definição e impacto visual de grande festival.',
    },
  ] satisfies Act[],
  // The club's stamp and the credit were cropped off those files (see
  // src/data/media/paths.ts), so the credit is printed here.
  photoCredit: 'Fotos do show no Clube Náutico Araraquara: Jonas Matheus.',
  // The index above the first act: one anchor per act, with its photo count.
  index: {
    label: 'Programa',
    photos: (count: number) => `${count} fotos`,
  },
  figurinos: {
    label: 'Bastidores',
    headline: 'Figurinos',
    lead: 'O espetáculo se transforma junto com o repertório: dezenas de trocas completas de figurino, adereços e coreografias exclusivas para transportar o público pelas grandes eras da música.',
  },
  estrutura: {
    label: 'A estrutura',
    headline: 'Fotos de montagens nossas',
    lead: 'Infraestrutura de ponta transportada em frota própria: som de alta fidelidade dimensionado para o espaço, painéis e pista de LED, iluminação inteligente e boate completa. Nada é terceirizado — montagem e operação pela nossa equipe.',
  },
  // The viewer: one photograph at a time, over the gallery or on its own
  // page (/palco/foto/<id>).
  viewer: {
    title: 'Fotos do palco',
    open: 'Ampliar foto',
    close: 'Fechar',
    back: 'Voltar ao palco',
    prev: 'Foto anterior',
    next: 'Próxima foto',
    counter: (index: number, total: number) => `${index} de ${total}`,
    zoomIn: 'Aproximar',
    zoomOut: 'Afastar',
    share: 'Compartilhar',
    copied: 'Link copiado',
    shareFailed: 'Copie o endereço da barra do navegador',
    keys: 'Setas trocam de foto, Home e End vão à primeira e à última, mais e menos aproximam e afastam, zero ajusta à tela, Esc fecha.',
  } satisfies ViewerLabels,
  // The four clips filmed at the band's own shows, played with sound. The
  // player's own labels live in ./player.ts.
  video: {
    label: 'O show',
    headline: 'E é assim que ele se move.',
    lead: 'Cortes reais das gravações de show, direto da câmera e sem overdubs de estúdio — o painel de LED, os vocalistas e a energia exatamente como o seu público vai sentir.',
    footnote: 'Cortes da filmagem oficial, em câmera e com som. O material completo vai por WhatsApp.',
  },
};
