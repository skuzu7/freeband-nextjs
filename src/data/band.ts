// src/data/band.ts
// Who the band is: identity, line-up, the release in its own words, the five
// eras, the names it has shared stages with. Extracted from the official
// Internacional Freeband brochure and the "Orçamento Exclusivo" portfolio.
import { images, type CaptionedPhoto } from './media/paths';

export const bandInfo = {
  name: 'Internacional Freeband',
  /** The word set above the wordmark wherever the mark is drawn. */
  brandLine: 'Internacional',
  legalName: 'Banda Internacional Freeband — Junior Promoções Artísticas',
  cnpj: '59.457.507/0001-11',
  taglineLong: 'Experiências musicais de alto padrão para eventos inesquecíveis',
  founded: 1969,
  foundedCity: 'Jaú/SP',
  yearsActive: new Date().getFullYear() - 1969,
  location: 'Trabiju/SP',
  founder: 'Antônio Lourenço Morales',
  founderTitle: 'Fundador e idealizador',
};

// On-stage line-up — 11 integrantes, as the band lists them. The counts have
// to keep adding up to `total`; the site prints both.
export const bandLineup = {
  total: 11,
  roles: [
    { count: 2, role: 'Tecladistas' },
    { count: 1, role: 'Baterista' },
    { count: 1, role: 'Baixista' },
    { count: 1, role: 'Guitarrista' },
    { count: 2, role: 'Cantores' },
    { count: 2, role: 'Cantoras' },
    { count: 2, role: 'Bailarinos' },
  ],
};

// Canonical phrases built from the line-up, read by the home, /palco and the
// portfolio PDF so the count is written in one place.
export const lineupLabel = `A formação · ${bandLineup.total} no palco`;
export const bandKicker = (yearsActive: number) => `${bandLineup.total} no palco. ${yearsActive} anos de estrada.`;
export const credentials = [
  { value: String(bandLineup.total), label: 'integrantes no palco' },
  { value: '7+', label: 'estados brasileiros' },
  { value: '2', label: 'turnês internacionais' },
];

// The band's own one-line description of what it delivers. Canonical: the
// meta description, the Palco lead and the closing paragraph of the release
// all read from here, so the sentence is edited in exactly one place.
export const releaseShort =
  'Composta por onze integrantes, oferecemos excelência em som, iluminação moderna, painel de LED e performance vocal, com palco, logística e estrutura completa.';

const YEARS_ACTIVE = bandInfo.yearsActive;

export const release = {
  short: releaseShort,
  full: `Fundada em 1969 na cidade de Jaú/SP por um grupo de amigos com uma proposta inovadora para a época, a Internacional Freeband nasceu para tocar aos finais de semana — todos os integrantes mantinham compromissos profissionais — e rapidamente se tornou uma das trajetórias mais duradouras da música brasileira, ainda presente no cenário até hoje.

Com visão à frente do seu tempo, sempre antenada às tendências tecnológicas, seu fundador S.R. Antônio Lourenço Morales posicionou a Freeband de forma sólida e definitiva no mercado nacional, conquistando espaço nos melhores clubes do Brasil e em empresas dos mais variados segmentos.

A banda realizou duas turnês internacionais ao lado de Jimmy Cliff e Cris Duran e participou de shows de nível nacional com nomes como Lulu Santos, Roupa Nova, Skank, Daniel, Chrystian & Ralf, Ultraje a Rigor, Raça Negra, Erasmo Carlos, César e Paulinho, 14Bis, Beth Carvalho e Jorge Aragão, entre outros. Já se apresentou na maioria dos municípios do estado de São Paulo e em mais de sete estados brasileiros.

Hoje, sediada em Trabiju/SP, a Freeband é totalmente independente em infraestrutura e logística, com equipamentos próprios da mais alta tecnologia — padrão que lhe rendeu vários prêmios de nível nacional e que continua sendo renovado por investimentos constantes.

${releaseShort}`,
  // The band's own release, in its own voice — kept verbatim except for the
  // year, which counts itself so the text never goes stale on the page.
  manifesto: `Há muitos meios de apresentar a música e todas requerem exposição, carisma, conteúdo e vivência, a maioria quase que copiadas e repetitivas, mas sempre contam com particularidades únicas e próprias, talvez no futuro exauram-se através da existência humana e desvaneçam-se entre os interesses fundamentais do homem.

A FREEBAND, contudo, permanece revestida de pontualidade, de firmeza de propósitos e objetivos sempre moldados de cuidados especiais, equilibrados e excessivamente exigentes — afinal, são ${YEARS_ACTIVE} anos de estrada.

FREEBAND: sempre um clima de expectativa em nossas apresentações. Novos recursos, a mais moderna tecnologia e os experientíssimos músicos fazem com que nossa produção ofereça a você uma continuidade de bailes e shows que misturam realidade com fantasia, evidenciando o esmero e os detalhes que são fundamentais para a satisfação, o sucesso e a sua identificação musical.`,
  // The line the band closes its own material with.
  slogan: 'Perto de você, com certeza, sempre haverá alguém que já viu.',
  sloganFootnote: `${YEARS_ACTIVE} anos de sucesso`,
  highlights: [{ value: `${YEARS_ACTIVE}+`, label: 'anos de estrada' }, ...credentials],
  values: ['Pontualidade', 'Honestidade', 'Profissionalismo'],
};

// Splits the release texts into paragraphs at their blank lines.
export const paragraphsOf = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/** How an era's photograph is treated: stage colour, printed artefact, or faded print. */
export type ImageGrade = 'live' | 'poster' | 'vintage';

/** One photograph of the band's history. `id` is its address in the viewer: /historia/foto/<id>. */
export type EraImage = CaptionedPhoto & { id: string; grade: ImageGrade };

export interface Era {
  year: string;
  title: string;
  description: string;
  /**
   * The era's face: one photograph, or two shown as a pair. The portfolio PDF
   * prints these, and the first of the founding era is the page's share card.
   */
  lead: EraImage[];
  /**
   * More from the same years. Each inner list is one plate on /historia — a
   * row of whole photographs at one height — in reading order.
   */
  album?: EraImage[][];
}

/** Every photograph of an era, lead first, in the order /historia shows them. */
export const eraPhotos = (era: Era): EraImage[] => [...era.lead, ...(era.album ?? []).flat()];

// Each era carries its own archival photographs, rendered WHOLE at the file's
// native ratio (the media test checks every aspect against the real file).
//
// The albums are paper prints from the band's own keeping. Two of them carry a
// lab stamp, FEV/85, and are captioned with it; none of the others is dated.
// Those are placed by what they show — white suits and bell-bottoms beside
// the founding, the stage of the eighties beside the stamped pair — and their
// captions say only what is in the picture, never a year or a place.
export const timeline: Era[] = [
  {
    year: '1969',
    title: 'Fundação em Jaú/SP',
    description:
      'Um grupo de amigos com uma proposta inovadora para a época deu início a uma das trajetórias mais duradouras da música brasileira.',
    lead: [
      {
        id: 'freeband-anos-70',
        src: images.anos70,
        alt: 'Retrato sépia dos seis integrantes fundadores de terno, com o nome da banda à frente',
        aspect: '768/1024',
        grade: 'vintage',
        caption: 'Os fundadores, em Jaú/SP',
      },
    ],
    album: [
      [
        {
          id: 'arquivo-bateria-e-metais',
          src: images.arquivoBateriaMetais,
          alt: 'Fotografia em preto e branco de um baile: o baterista de terno à frente, guitarrista e metais atrás dele, caixas de som empilhadas ao lado',
          aspect: '1171/719',
          grade: 'poster',
          caption: 'Baile, em preto e branco',
        },
        {
          id: 'arquivo-formacao-de-branco',
          src: images.arquivoFormacaoBranco,
          alt: 'Seis integrantes de terno branco e calça boca de sino em fila no palco, ao lado de um teclado',
          aspect: '998/611',
          grade: 'poster',
          caption: 'A formação, de branco',
        },
      ],
      [
        {
          id: 'arquivo-cartaz-de-branco',
          src: images.arquivoCartazBranco,
          alt: 'Cartaz de divulgação antigo: seis integrantes de terno branco sobre um fundo estampado laranja, com a faixa FREEBAND e o crédito Celso Campos Promoções Artísticas',
          aspect: '960/1120',
          grade: 'poster',
          caption: 'Cartaz de divulgação · Celso Campos Promoções Artísticas',
        },
        {
          id: 'arquivo-guitarra-e-teclado',
          src: images.arquivoGuitarraTeclado,
          alt: 'Guitarrista de branco com guitarra vermelha ao lado do tecladista, sobre um palco de madeira com caixas de som',
          aspect: '719/1203',
          grade: 'poster',
          caption: 'Guitarra e teclado',
        },
      ],
      [
        {
          id: 'arquivo-palco-de-branco',
          src: images.arquivoPalcoBranco,
          alt: 'A banda tocando de branco num palco de salão, com guitarra, bateria, saxofone e teclado',
          aspect: '1190/697',
          grade: 'poster',
          caption: 'No palco, de branco',
        },
      ],
    ],
  },
  {
    year: 'Anos 80–90',
    title: 'Expansão Nacional',
    description:
      'Conquista de espaço nos melhores clubes do país, com apresentações em mais de sete estados brasileiros.',
    lead: [
      {
        id: 'freeband-anos-80',
        src: images.anos80,
        alt: 'Integrantes de camiseta da banda reunidos nos bastidores de um baile dos anos 80',
        aspect: '768/768',
        grade: 'vintage',
        caption: 'Bastidores de baile, anos 80',
      },
    ],
    album: [
      [
        {
          id: 'arquivo-guitarrista-fev-85',
          src: images.arquivoGuitarristaFev85,
          alt: 'Guitarrista de camiseta azul e calça branca com uma guitarra vermelha, diante de uma estante de partitura; a cópia traz o carimbo FEV/85',
          aspect: '1101/1536',
          grade: 'poster',
          caption: 'Guitarra, fevereiro de 1985',
        },
        {
          id: 'arquivo-vozes-fev-85',
          src: images.arquivoVozesFev85,
          alt: 'Três músicos lado a lado no palco: dois com instrumentos de corda e, ao centro, o vocalista ao microfone; a cópia traz o carimbo FEV/85',
          aspect: '1472/998',
          grade: 'poster',
          caption: 'No palco, fevereiro de 1985',
        },
      ],
      [
        {
          id: 'arquivo-grupo-de-vermelho',
          src: images.arquivoGrupoVermelho,
          alt: 'Integrantes de camiseta vermelha posam em duas fileiras à frente do palco, com uma cortina clara ao fundo',
          aspect: '1460/944',
          grade: 'poster',
          caption: 'A turma reunida, de vermelho',
        },
        {
          id: 'arquivo-palco-cortina-vermelha',
          src: images.arquivoPalcoCortina,
          alt: 'A banda de branco num palco de cortina vermelha com arranjos de flores, vista de trás do técnico na mesa de som',
          aspect: '1487/1211',
          grade: 'poster',
          caption: 'O palco, visto da mesa de som',
        },
      ],
      [
        {
          id: 'arquivo-palco-e-mesa-de-som',
          src: images.arquivoPalcoMesaSom,
          alt: 'A banda num palco baixo diante de uma parede de concreto com cartazes, vista de trás do técnico de som sentado',
          aspect: '1583/934',
          grade: 'poster',
          caption: 'Palco montado, técnico a postos',
        },
      ],
    ],
  },
  {
    year: 'Anos 2000',
    title: 'Turnês Internacionais',
    description:
      'Duas turnês internacionais ao lado de Jimmy Cliff e Cris Duran, além de palcos nacionais com Lulu Santos, Roupa Nova e Skank.',
    lead: [
      {
        id: 'freeband-antigas',
        src: images.antigas,
        alt: 'Cartaz da formação dos anos 2000 com naipe de metais, bailarinas e o logotipo Internacional Freeband',
        aspect: '800/800',
        grade: 'poster',
        caption: 'A formação internacional',
      },
      {
        id: 'freeband-anos-2000',
        src: images.anos2000,
        alt: 'Cartaz dos anos 2000 com retratos dos integrantes sobre fundo espacial e duas fotos de grupo com o logotipo Internacional Freeband',
        aspect: '800/800',
        grade: 'poster',
        caption: 'Os integrantes, um a um',
      },
    ],
  },
  {
    year: '2015',
    title: 'Premiação Nacional',
    description:
      'Reconhecimento com prêmios nacionais pela excelência, qualidade e profissionalismo em mais de quatro décadas de estrada.',
    lead: [
      {
        id: 'freeband-2015',
        src: images.fb2015,
        alt: 'Colagem comemorativa com fotos de show e os dizeres 30 anos de sucesso',
        aspect: '457/640',
        grade: 'poster',
        caption: 'Cartaz comemorativo',
      },
    ],
  },
  {
    year: 'Hoje',
    title: 'Infraestrutura Própria',
    description:
      'Sediada em Trabiju/SP, totalmente independente com equipamentos próprios de altíssima tecnologia.',
    lead: [
      {
        id: 'festa-55',
        src: images.festa55,
        alt: 'Banda completa no palco sob feixes de luz robotizada e telão de LED',
        aspect: '1200/800',
        grade: 'live',
        caption: 'O palco de hoje',
      },
    ],
  },
];

export const artists = [
  'Lulu Santos',
  'Roupa Nova',
  'Skank',
  'Daniel',
  'Chrystian & Ralf',
  'Ultraje a Rigor',
  'Raça Negra',
  'Erasmo Carlos',
  'César e Paulinho',
  '14Bis',
  'Beth Carvalho',
  'Jorge Aragão',
  'Placa Luminosa',
  'Jimmy Cliff',
  'Cris Duran',
];

export const partners = [
  'Clube Náutico Araraquara',
  'Cosmopolitano FC',
  'Clube de Campo Céu Azul',
  'Prefeituras Municipais',
];
