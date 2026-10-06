// src/data/copy/historia.ts
// /historia — the timeline (the 1969 chapter in sepia, then four eras, each
// with its album), the release, the names.
import { bandInfo } from '../band';
import type { ViewerLabels } from '../media/gallery';

export const historia = {
  seo: {
    title: 'A história',
    description:
      'Fundada em 1969 em Jaú/SP, a Internacional Freeband é uma das trajetórias mais duradouras da música brasileira: cinco eras, duas turnês internacionais, prêmios nacionais.',
    // The line under the title on the share card (opengraph-image.tsx).
    cardLine: `Fundada em ${bandInfo.founded} em ${bandInfo.foundedCity}. Cinco eras de estrada.`,
  },
  label: 'A história',
  headline: 'Começou em 1969,\nnum fim de semana em Jaú.',
  numberLabel: 'fundação em Jaú/SP',
  capitulo: {
    label: 'Capítulo 1969',
    title: 'Seis amigos, um fim de semana.',
    lead: 'Fundada em 1969 na cidade de Jaú/SP por um grupo de amigos com uma proposta inovadora para a época, a Internacional Freeband nasceu para tocar aos finais de semana — todos os integrantes mantinham compromissos profissionais.',
    founderLabel: bandInfo.founderTitle,
    founder: bandInfo.founder,
  },
  eras: { label: 'Cinco eras', headline: 'De Jaú para mais de sete estados.' },
  // Over the rows of prints that follow an era's own photograph.
  albumLabel: 'Do álbum da banda',
  // The viewer: one photograph at a time, over the timeline or on its own
  // page (/historia/foto/<id>).
  viewer: {
    title: 'Fotos da história',
    open: 'Ampliar foto',
    close: 'Fechar',
    back: 'Voltar à história',
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
  release: { label: 'O release', headline: 'Nas palavras da banda.' },
  manifestoLabel: 'Nas nossas palavras',
  names: {
    label: 'Palcos divididos',
    lead: 'Nomes com quem a Freeband já dividiu o palco.',
    partnersLabel: 'Clubes & parceiros',
  },
  valuesLine: 'Pontualidade · honestidade · profissionalismo',
};
