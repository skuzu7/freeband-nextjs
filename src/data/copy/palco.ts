// src/data/copy/palco.ts
// /palco — the full gallery: three acts, wardrobe, rig, the four reels.
import { bandLineup, releaseShort } from '../band';
import type { StageCategory } from '../media/frames';

export interface Act {
  numeral: string;
  key: StageCategory;
  title: string;
  note: string;
}

export const palco = {
  seo: {
    title: 'O palco',
    description: `${releaseShort} Fotos e vídeos de shows nossos — sem banco de imagens.`,
  },
  label: 'O palco',
  headline: 'É isto que chega na sua festa.',
  lead: `${releaseShort} As fotos abaixo são de shows nossos — sem banco de imagens.`,
  lineupLabel: `A formação · ${bandLineup.total} no palco`,
  lineupNote: 'Tudo ao vivo',
  // The gallery reads as a programme in three acts. Keys match the
  // StageFrame categories in src/data/media/frames.ts.
  actWord: 'Ato',
  acts: [
    {
      numeral: 'I',
      key: 'vocais',
      title: 'A frente do palco',
      note: 'Os vocalistas — dois cantores, duas cantoras — e as guitarras.',
    },
    {
      numeral: 'II',
      key: 'blocos',
      title: 'Os blocos temáticos',
      note: 'Country, cabaré, anos 70: figurino, coreografia e painel trocam juntos.',
    },
    {
      numeral: 'III',
      key: 'efeitos',
      title: 'Luz, LED e efeitos',
      note: 'Iluminação robotizada via time code e o painel de LED em neon.',
    },
  ] satisfies Act[],
  figurinos: {
    label: 'Bastidores · Figurinos',
    lead: 'O show troca de roupa junto com o repertório: anos 50, anos 70, country, cabaré. Cada bloco tem o seu figurino, e eles viajam com a banda.',
  },
  estrutura: {
    label: 'A estrutura · fotos de montagens nossas',
    lead: 'O que os pacotes listam é isto aqui, montado: pista e painéis de LED, iluminação robotizada e a boate completa. Nada é terceirizado — a estrutura viaja no nosso caminhão.',
  },
  // The reel: four clips filmed at the band's own shows, no sound, no edit.
  video: {
    label: 'O show',
    headline: 'E é assim que ele se move.',
    lead: 'Quatro trechos das gravações oficiais de show, sem trilha e sem edição — o painel de LED, os vocalistas e as guitarras em movimento.',
    pauseLabel: 'Pausar os vídeos',
    playLabel: 'Reproduzir os vídeos',
    footnote: 'Cortes da filmagem oficial, em câmera. O material completo vai por WhatsApp.',
  },
};
