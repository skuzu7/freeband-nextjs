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
    description: `${releaseShort} Registros 100% autênticos de shows nossos — sem fotos de banco de imagens.`,
  },
  label: 'O palco',
  headline: 'O espetáculo ao vivo,\ndo primeiro ao último acorde.',
  lead: `${releaseShort} Todas as fotografias abaixo são registros reais dos nossos eventos — sem modelos ou fotos de banco de imagens.`,
  lineupLabel: `A formação · ${bandLineup.total} no palco`,
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
  figurinos: {
    label: 'Bastidores · Figurinos',
    lead: 'O espetáculo se transforma junto com o repertório: dezenas de trocas completas de figurino, adereços e coreografias exclusivas para transportar o público pelas grandes eras da música.',
  },
  estrutura: {
    label: 'A estrutura · fotos de montagens nossas',
    lead: 'Infraestrutura de ponta transportada em frota própria: som de alta fidelidade dimensionado para o espaço, painéis e pista de LED, iluminação inteligente e boate completa. Nada é terceirizado — montagem e operação pela nossa equipe.',
  },
  // The reel: four clips filmed at the band's own shows, no sound, no edit.
  video: {
    label: 'O show',
    headline: 'E é assim que ele se move.',
    lead: 'Cortes reais das gravações de show, direto da câmera e sem overdubs de estúdio — o painel de LED, os vocalistas e a energia exatamente como o seu público vai sentir.',
    pauseLabel: 'Pausar os vídeos',
    playLabel: 'Reproduzir os vídeos',
    footnote: 'Cortes da filmagem oficial, em câmera. O material completo vai por WhatsApp.',
  },
};
