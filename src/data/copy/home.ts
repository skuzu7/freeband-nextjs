// src/data/copy/home.ts
// The home in five blocks: fold, "o que chega no caminhão", blocos temáticos,
// prova, "qual é a data?". Every string a component on "/" renders.
import { bandInfo, bandLineup } from '../band';
import { images, type Photo } from '../media/paths';

export const fold = {
  badge: `Banda de baile e show · desde ${bandInfo.founded}`,
  kicker: `${bandLineup.total} no palco. ${bandInfo.yearsActive} anos de estrada.`,
  lead: 'Réveillon de prefeitura, baile de clube, casamento e formatura — no interior de São Paulo e em mais de sete estados. Som, luz, palco e logística são nossos.',
  ctaPrimary: 'Pedir orçamento',
  ctaSecondary: 'Ver o palco',
  scrollLabel: 'Role',
  // Credential strip directly under the fold — the numbers a buyer weighs.
  proof: [
    { value: String(bandInfo.founded), label: 'fundada em Jaú/SP' },
    { value: String(bandLineup.total), label: 'integrantes no palco' },
    { value: '7+', label: 'estados brasileiros' },
    { value: '2', label: 'turnês internacionais' },
  ],
};

export const caminhao = {
  label: 'O que chega no caminhão',
  headline: 'Dois formatos,\nnenhum terceirizado.',
  lead: 'Estrutura própria completa em dois formatos de montagem. Valores sob consulta, dimensionados de acordo com a data, distância e estrutura do seu evento.',
  highlightBadge: 'Mais pedido',
  ctaLabel: 'Pedir valores',
  whatsappMessage: 'Olá! Gostaria de saber mais sobre o',
  lineupLabel: `A formação · ${bandLineup.total} no palco`,
  lineupNote: 'Tudo ao vivo',
  formatsLabel: 'Formatos atendidos',
  estruturaLabel: 'A estrutura, montada · fotos de montagens nossas',
};

export interface Bloco {
  id: string;
  title: string;
  note: string;
  photo: Photo;
  /** The wardrobe shot for the block, when one exists. */
  figurino?: Photo & { caption: string };
}

const blocoItems: Bloco[] = [
    {
      id: 'anos-50',
      title: 'Anos 50',
      note: 'Rock and roll clássico, saias de poá, luvas brancas e a energia vibrante dos bailes de época.',
      // Stage frame from the Clube Náutico show (Jonas Matheus); the club's
      // watermark strip is cropped off the file, the credit is in `note`.
      photo: {
        src: images.palcoAnos50,
        alt: 'Vocalista de jaqueta espelhada e bailarina de saia de poá do bloco anos 50 diante do painel de LED',
        aspect: '970/1365',
      },
      figurino: {
        src: images.figurinoAnos50,
        alt: 'Bailarinos em figurino anos 50 de poá com luvas brancas',
        caption: 'Anos 50 & Retrô',
        aspect: '1200/1600',
      },
    },
    {
      id: 'anos-70',
      title: 'Anos 70',
      note: 'Plumas, brilho, coreografias marcadas e os maiores hinos que definiram a era disco.',
      photo: {
        src: images.palcoAnos70,
        alt: 'Bloco anos 70 com plumas laranja diante do painel de LED',
        aspect: '1112/1600',
      },
      figurino: {
        src: images.figurinoPlumas,
        alt: 'Bailarinos em figurino vermelho com plumas e chapéus',
        caption: 'Plumas & Anos 70',
        aspect: '1179/1557',
      },
    },
    {
      id: 'country',
      title: 'Country',
      note: 'Franjas, fivelas e os clássicos do sertanejo e country que contagiam e agitam a pista.',
      photo: {
        src: images.palcoCountryLed,
        alt: 'Dupla em figurino country dançando à frente da banda e do painel de LED',
        aspect: '1074/1600',
      },
      figurino: {
        src: images.figurinoCountry,
        alt: 'Dupla em figurino country dourado com franjas e chapéu',
        caption: 'Country & Sertanejo',
        aspect: '1179/1551',
      },
    },
    {
      id: 'cabare',
      title: 'Cabaré',
      note: 'Performance teatral e sofisticada, figurino elegante e iluminação intimista sob o painel de LED.',
      // No separate wardrobe shot for cabaré in the archive.
      photo: {
        src: images.palcoCabare,
        alt: 'Vocalista em figurino de cabaré à frente da banda e do painel de LED',
        aspect: '1174/1600',
      },
    },
];

export const blocos = {
  label: 'Blocos temáticos',
  headline: 'Os blocos\ntemáticos.',
  lead: 'O show se transforma visualmente a cada época do repertório: anos 50, anos 70, country, cabaré. Cada bloco traz figurino exclusivo e viaja completo com a banda.',
  note: 'Anos 50, country, cabaré, anos 70: figurino, coreografia e painel trocam juntos. Foto do bloco anos 50: Jonas Matheus, Clube Náutico Araraquara.',
  hint: 'Arraste para o lado',
  position: 'Bloco',
  prev: 'Bloco anterior',
  next: 'Próximo bloco',
  items: blocoItems,
};

export const prova = {
  label: 'Prova',
  headline: 'E é assim que\nele se move.',
  videoLead:
    'Trechos de gravações oficiais ao vivo, sem overdubs ou playback — a vibração real dos 11 integrantes, do painel de LED e da iluminação cênica.',
  pauseLabel: 'Pausar os vídeos',
  playLabel: 'Reproduzir os vídeos',
  videoFootnote: 'Cortes da filmagem oficial, em câmera. O material completo vai por WhatsApp.',
  arquivoLabel: 'O arquivo',
  arquivoLead:
    'Grandes réveillons públicos, bailes de clubes tradicionais e eventos corporativos. Mais de cinco décadas registrando momentos inesquecíveis.',
  arquivoCta: 'Ver o arquivo',
  palcoCta: 'Ver o palco inteiro',
  namesLabel: 'Palcos divididos',
  namesLead: 'Nomes com quem a Freeband já dividiu o palco.',
  namesPause: 'Pausar o letreiro',
  namesPlay: 'Rodar o letreiro',
};

export const data = {
  label: 'Contato',
  headline: 'Qual é a data?',
  lead: 'Conta o formato, a data e a cidade. Devolvemos uma proposta fechada — som, luz, palco, logística, backup e DJ depois do show.',
  phoneLabel: 'Fale com a produção',
  whatsappCta: 'Falar pelo WhatsApp',
  // The address already sits in the "Endereço" row right above this line.
  meta: `CNPJ ${bandInfo.cnpj}`,
};
