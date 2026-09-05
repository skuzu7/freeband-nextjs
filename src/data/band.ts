// src/data/band.ts
// Who the band is: identity, line-up, the release in its own words, the five
// eras, the names it has shared stages with. Extracted from the official
// Internacional Freeband brochure and the "Orçamento Exclusivo" portfolio.
import { images, type Photo } from './media/paths';

export const bandInfo = {
  name: 'Internacional Freeband',
  legalName: 'Banda Internacional Freeband — Junior Promoções Artísticas',
  cnpj: '59.457.507/0001-11',
  tagline: 'Sinônimo em padrão de qualidade',
  taglineLong: 'Experiências musicais de alto padrão para eventos inesquecíveis',
  subtitle: 'Portfólio & Serviços',
  founded: 1969,
  foundedCity: 'Jaú/SP',
  yearsActive: new Date().getFullYear() - 1969,
  location: 'Trabiju/SP',
  founder: 'Antônio Lourenço Morales',
  founderTitle: 'Fundador e idealizador',
  website: 'www.freeband.com.br',
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
  highlights: [
    { value: `${YEARS_ACTIVE}+`, label: 'anos de estrada' },
    { value: '11', label: 'integrantes no palco' },
    { value: '7+', label: 'estados brasileiros' },
    { value: '2', label: 'turnês internacionais' },
  ],
  values: ['Pontualidade', 'Honestidade', 'Profissionalismo'],
};

/** How an era's photograph is treated: stage colour, printed artefact, or faded print. */
export type ImageGrade = 'live' | 'poster' | 'vintage';

export interface Era {
  year: string;
  title: string;
  description: string;
  image: Photo & { caption: string; grade: ImageGrade };
}

// Each era carries its own archival photograph, rendered WHOLE at the file's
// native ratio (the media test checks the aspect against the real file).
export const timeline: Era[] = [
  {
    year: '1969',
    title: 'Fundação em Jaú/SP',
    description:
      'Um grupo de amigos com uma proposta inovadora para a época deu início a uma das trajetórias mais duradouras da música brasileira.',
    image: {
      src: images.anos70,
      alt: 'Retrato sépia dos seis integrantes fundadores de terno, com o nome da banda à frente',
      aspect: '768/1024',
      grade: 'vintage',
      caption: 'Os fundadores, em Jaú/SP',
    },
  },
  {
    year: 'Anos 80–90',
    title: 'Expansão Nacional',
    description:
      'Conquista de espaço nos melhores clubes do país, com apresentações em mais de sete estados brasileiros.',
    image: {
      src: images.anos80,
      alt: 'Integrantes de camiseta da banda reunidos nos bastidores de um baile dos anos 80',
      aspect: '768/768',
      grade: 'vintage',
      caption: 'Bastidores de baile, anos 80',
    },
  },
  {
    year: 'Anos 2000',
    title: 'Turnês Internacionais',
    description:
      'Duas turnês internacionais ao lado de Jimmy Cliff e Cris Duran, além de palcos nacionais com Lulu Santos, Roupa Nova e Skank.',
    image: {
      src: images.antigas,
      alt: 'Cartaz da formação dos anos 2000 com naipe de metais, bailarinas e o logotipo Internacional Freeband',
      aspect: '800/800',
      grade: 'poster',
      caption: 'A formação internacional',
    },
  },
  {
    year: '2015',
    title: 'Premiação Nacional',
    description:
      'Reconhecimento com prêmios nacionais pela excelência, qualidade e profissionalismo em mais de quatro décadas de estrada.',
    image: {
      src: images.fb2015,
      alt: 'Colagem comemorativa com fotos de show e os dizeres 30 anos de sucesso',
      aspect: '457/640',
      grade: 'poster',
      caption: 'Cartaz comemorativo',
    },
  },
  {
    year: 'Hoje',
    title: 'Infraestrutura Própria',
    description:
      'Sediada em Trabiju/SP, totalmente independente com equipamentos próprios de altíssima tecnologia.',
    image: {
      src: images.festa55,
      alt: 'Banda completa no palco sob feixes de luz robotizada e telão de LED',
      aspect: '1200/800',
      grade: 'live',
      caption: 'O palco de hoje',
    },
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
