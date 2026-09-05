// src/data/copy/portfolio.ts
// /portfolio — the public download page — and every string printed inside the
// portfolio PDF itself.
import { bandInfo, bandLineup } from '../band';

export const portfolio = {
  seo: {
    title: 'Portfólio',
    description: 'Baixe o portfólio da Internacional Freeband em PDF: história, galeria, serviços e contato.',
  },
  label: 'Portfólio & Serviços',
  headline: 'Portfólio Digital',
  lead: 'Baixe nosso portfólio completo com história, galeria, serviços e informações de contato.',
  prepare: 'Preparar PDF',
  generating: 'Gerando PDF...',
  download: 'Baixar Portfólio PDF',
  fileName: 'Internacional-Freeband-Portfolio.pdf',
  back: 'Voltar ao site',

  // The seven pages of the PDF. Section titles reuse the words the site's own
  // pages open with, so the document reads as the site, printed.
  pdf: {
    docTitle: 'Internacional Freeband — Portfólio & Serviços',
    docSubject: 'Portfólio profissional da banda Internacional Freeband',
    pageOf: (n: number, total: number) => `${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    cover: {
      brandLine: 'Internacional',
      kicker: `${bandLineup.total} no palco. ${bandInfo.yearsActive} anos de estrada.`,
      badge: 'Portfólio & Serviços',
      since: (year: number) => `Desde ${year} · ${bandInfo.foundedCity}`,
      numberLabel: 'fundação em Jaú/SP',
    },
    about: {
      title: 'Quem somos',
      valuesTitle: 'Nossos valores',
      lineupLabel: `A formação · ${bandLineup.total} no palco`,
      photoCaption: 'Banda completa · iluminação robotizada',
    },
    timeline: {
      title: 'A história',
      lead: 'De Jaú para mais de sete estados.',
    },
    partners: {
      title: 'Palcos divididos',
      artistsLabel: 'Nomes com quem a Freeband já dividiu o palco',
      partnersLabel: 'Clubes & parceiros',
      archiveLabel: 'Do arquivo',
      archiveNote: 'Réveillon de praça, baile de clube, arraiá de sócio. Duas destas viradas foram contratadas por prefeitura municipal.',
    },
    gallery: {
      title: 'O palco',
      lead: 'Fotos de shows nossos — sem banco de imagens.',
    },
    services: {
      title: 'O que chega no caminhão',
      headline: 'Dois formatos, nenhum terceirizado.',
      lead: 'Valores por WhatsApp, porque dependem de data, distância e estrutura do local.',
      highlightBadge: 'Mais pedido',
      formatsLabel: 'Formatos atendidos',
      includedLabel: 'O que está incluso',
      optionalNote: 'opcional',
      rigLabel: 'A estrutura, montada',
    },
    contact: {
      title: 'Contato',
      headline: 'Qual é a data?',
      lead: 'Conta o formato, a data e a cidade. Devolvemos uma proposta fechada — som, luz, palco, logística, backup e DJ depois do show.',
      whatsappLabel: 'WhatsApp da produção',
      whatsappCta: 'Abrir conversa no WhatsApp',
      emailLabel: 'E-mail',
      instagramLabel: 'Instagram',
      siteLabel: 'Site',
      addressLabel: 'Endereço',
      cnpjLabel: 'CNPJ',
    },
  },
};
