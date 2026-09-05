// src/data/copy/site.ts
// Strings shared by every page: SEO defaults, navigation, footer.
import { bandInfo, releaseShort } from '../band';
import { contact } from '../contact';

export const site = {
  seo: {
    // "Banda de baile e show" is the phrase a buyer actually types into
    // Google; the year is the credential no competitor can copy.
    title: 'Internacional Freeband — Banda de Baile e Show desde 1969',
    titleTemplate: '%s — Internacional Freeband',
    description: releaseShort,
    ogTitle: 'Internacional Freeband — Banda de Baile e Show',
    ogDescription: releaseShort,
  },

  nav: {
    // Every entry is a route whose own headline uses the same word.
    links: [
      { label: 'Palco', href: '/palco' },
      { label: 'Arquivo', href: '/arquivo' },
      { label: 'História', href: '/historia' },
      { label: 'Portfólio', href: '/portfolio' },
    ],
    cta: { label: 'Orçamento', href: contact.whatsappQuoteLink },
    brandLine: `Desde ${bandInfo.founded} · ${bandInfo.location}`,
    homeLabel: 'Internacional Freeband — início',
    menuOpen: 'Abrir menu',
    menuClose: 'Fechar menu',
    skipLink: 'Pular para o conteúdo',
  },

  footer: {
    brandTagline: 'Uma banda feita no palco.',
    brandTaglineLong: `Desde ${bandInfo.founded}, dividindo o mesmo pulso com o Brasil.`,
    navHeading: 'Navegar',
    contactHeading: 'Contato',
    rightsNote: 'Todos os direitos reservados',
    // The decade ribbon, ending at the current year without annual edits.
    years: [
      ...[1969, 1979, 1989, 1999, 2009, 2019].filter((y) => y < new Date().getFullYear()),
      new Date().getFullYear(),
    ].map(String),
  },
};
