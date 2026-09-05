// src/data/copy/historia.ts
// /historia — the 1969 chapter in sepia, five eras, the release, the names.
import { bandInfo } from '../band';

export const historia = {
  seo: {
    title: 'A história',
    description:
      'Fundada em 1969 em Jaú/SP, a Internacional Freeband é uma das trajetórias mais duradouras da música brasileira: cinco eras, duas turnês internacionais, prêmios nacionais.',
  },
  label: 'A história',
  headline: 'Começou em 1969, num fim de semana em Jaú.',
  numberLabel: 'fundação em Jaú/SP',
  capitulo: {
    label: 'Capítulo 1969',
    title: 'Seis amigos, um fim de semana.',
    lead: 'Fundada em 1969 na cidade de Jaú/SP por um grupo de amigos com uma proposta inovadora para a época, a Internacional Freeband nasceu para tocar aos finais de semana — todos os integrantes mantinham compromissos profissionais.',
    founderLabel: bandInfo.founderTitle,
    founder: bandInfo.founder,
  },
  eras: { label: 'Cinco eras', headline: 'De Jaú para mais de sete estados.' },
  release: { label: 'O release', headline: 'Nas palavras da banda.' },
  manifestoLabel: 'Nas nossas palavras',
  names: {
    label: 'Palcos divididos',
    lead: 'Nomes com quem a Freeband já dividiu o palco.',
    partnersLabel: 'Clubes & parceiros',
  },
  valuesLine: 'Pontualidade · honestidade · profissionalismo',
};
