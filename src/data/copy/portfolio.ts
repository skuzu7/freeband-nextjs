// src/data/copy/portfolio.ts
// /portfolio — the public download page — and every string printed inside the
// portfolio PDF itself.
import { bandInfo, bandKicker, lineupLabel } from '../band';
import type { StageCategory } from '../media/frames';
import { palco } from './palco';

export const portfolio = {
  seo: {
    title: 'Portfólio',
    description: 'Baixe o portfólio da Internacional Freeband em PDF: história, galeria, serviços e contato.',
    // The line under the title on the share card (opengraph-image.tsx).
    cardLine: 'História, galeria, serviços e contato em um PDF.',
  },
  label: 'Portfólio & Serviços',
  headline: 'Portfólio Digital',
  lead: 'Baixe nosso portfólio completo com história, galeria, serviços e informações de contato.',
  // Shown while the PDF module itself is still loading.
  prepare: 'Preparando…',
  generating: 'Gerando PDF…',
  generatingNote: 'Montando as sete páginas no seu navegador. O download começa sozinho.',
  error: 'Não foi possível gerar o PDF. Tente de novo em instantes.',
  download: 'Baixar portfólio (PDF)',
  fileName: 'Internacional-Freeband-Portfolio.pdf',
  back: 'Voltar ao site',

  // The seven pages of the PDF. Section titles reuse the words the site's own
  // pages open with, so the document reads as the site, printed.
  pdf: {
    docTitle: 'Internacional Freeband — Portfólio & Serviços',
    docSubject: 'Portfólio profissional da banda Internacional Freeband',
    pageOf: (n: number, total: number) => `${String(n).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    cover: {
      brandLine: bandInfo.brandLine,
      kicker: bandKicker(bandInfo.yearsActive),
      badge: 'Portfólio & Serviços',
      since: (year: number) => `Desde ${year} · ${bandInfo.foundedCity}`,
      numberLabel: 'fundação em Jaú/SP',
      // The cover photograph is one of the Clube Náutico frames, whose credit
      // was cropped off the file (see src/data/media/paths.ts).
      photoCredit: 'Foto: Jonas Matheus · Clube Náutico Araraquara',
    },
    about: {
      title: 'Quem somos',
      valuesTitle: 'Nossos valores',
      lineupLabel,
      photoCaption: 'Banda completa · iluminação robotizada',
    },
    timeline: {
      title: 'A história',
      lead: 'De Jaú para mais de sete estados.',
      // The first node of the axis is the founding chapter, as on /historia.
      chapter: `Capítulo ${bandInfo.founded}`,
      founderLabel: bandInfo.founderTitle,
      founder: bandInfo.founder,
    },
    partners: {
      title: 'Palcos divididos',
      artistsLabel: 'Nomes com quem a Freeband já dividiu o palco',
      partnersLabel: 'Clubes & parceiros',
      archiveLabel: 'Do arquivo',
      archiveNote: 'Réveillon de praça, arraiá de sócio, baile de clube. No arquivo completo, duas viradas de ano contratadas por prefeituras municipais.',
    },
    gallery: {
      title: 'O palco',
      lead: 'Fotos de shows nossos — sem banco de imagens.',
      // One plate row per act of /palco, under the act's own name there.
      acts: Object.fromEntries(
        palco.acts.map((act) => [act.key, `${palco.actWord} ${act.numeral} · ${act.title}`]),
      ) as Record<StageCategory, string>,
      // Two of the document's photographs are Clube Náutico frames, whose
      // credit was cropped off the files: the anos 50 block here, and the cover.
      photoCredit: 'Bloco anos 50 (Ato II) e foto da capa: Jonas Matheus, no Clube Náutico Araraquara.',
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
