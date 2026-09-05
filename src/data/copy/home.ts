// src/data/copy/home.ts
// The home in five blocks: fold, "o que chega no caminhão", blocos temáticos,
// prova, "qual é a data?". Every string a component on "/" renders.
import { bandInfo, bandLineup } from '../band';
import { contact } from '../contact';
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
  lead: 'O que entra no caminhão em cada um. Valores por WhatsApp, porque dependem de data, distância e estrutura do local.',
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
      note: 'Poá, luvas brancas e rock de baile.',
      // No stage frame of this block exists in the archive; the wardrobe shot
      // carries it. (Noted in the rebuild report.)
      photo: {
        src: images.figurinoAnos50,
        alt: 'Bailarinos em figurino anos 50 de poá com luvas brancas',
        aspect: '1200/1600',
      },
    },
    {
      id: 'anos-70',
      title: 'Anos 70',
      note: 'Plumas, estampas e o corpo de baile inteiro.',
      photo: {
        src: images.palcoAnos70,
        alt: 'Bloco anos 70 com plumas laranja diante do painel de LED',
        aspect: '1074/1600',
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
      note: 'Franjas, chapéu e sertanejo para a pista.',
      photo: {
        src: images.palcoCountryLed,
        alt: 'Dupla em figurino country dançando à frente da banda e do painel de LED',
        aspect: '1112/1600',
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
      note: 'Performance de frente de palco com o painel em vermelho.',
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
  lead: 'O show troca de roupa junto com o repertório: anos 50, anos 70, country, cabaré. Cada bloco tem o seu figurino, e eles viajam com a banda.',
  note: 'Country, cabaré, anos 70: figurino, coreografia e painel trocam juntos.',
  hint: 'Arraste para o lado',
  position: 'Bloco',
  items: blocoItems,
};

export const prova = {
  label: 'Prova',
  headline: 'E é assim que\nele se move.',
  videoLead:
    'Trechos das gravações oficiais de show, sem trilha e sem edição — o painel de LED, os vocalistas e as guitarras em movimento.',
  pauseLabel: 'Pausar os vídeos',
  playLabel: 'Reproduzir os vídeos',
  videoFootnote: 'Cortes da filmagem oficial, em câmera. O material completo vai por WhatsApp.',
  arquivoLabel: 'O arquivo',
  arquivoLead:
    'Réveillon de praça, baile de clube, arraiá de sócio. Duas destas viradas foram contratadas por prefeitura municipal.',
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
  meta: `CNPJ ${bandInfo.cnpj} · ${contact.address}`,
};
