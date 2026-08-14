// src/data/content.ts
// Single source of truth for band copy and metadata. Extracted and
// consolidated from the official Internacional Freeband brochure and
// the "Orçamento Exclusivo" portfolio PDF.

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

// On-stage lineup — 11 integrantes, as the band lists them. The counts have to
// keep adding up to `total`; the site prints both.
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

// The band's own one-line description of what it delivers. Canonical: the meta
// description, the Palco lead and the closing paragraph of the release all read
// from here, so the sentence is edited in exactly one place.
const RELEASE_SHORT =
  'Composta por onze integrantes, oferecemos excelência em som, iluminação moderna, painel de LED e performance vocal, com palco, logística e estrutura completa.';

const YEARS_ACTIVE = new Date().getFullYear() - 1969;

export const release = {
  short: RELEASE_SHORT,
  full: `Fundada em 1969 na cidade de Jaú/SP por um grupo de amigos com uma proposta inovadora para a época, a Internacional Freeband nasceu para tocar aos finais de semana — todos os integrantes mantinham compromissos profissionais — e rapidamente se tornou uma das trajetórias mais duradouras da música brasileira, ainda presente no cenário até hoje.

Com visão à frente do seu tempo, sempre antenada às tendências tecnológicas, seu fundador S.R. Antônio Lourenço Morales posicionou a Freeband de forma sólida e definitiva no mercado nacional, conquistando espaço nos melhores clubes do Brasil e em empresas dos mais variados segmentos.

A banda realizou duas turnês internacionais ao lado de Jimmy Cliff e Cris Duran e participou de shows de nível nacional com nomes como Lulu Santos, Roupa Nova, Skank, Daniel, Chrystian & Ralf, Ultraje a Rigor, Raça Negra, Erasmo Carlos, César e Paulinho, 14Bis, Beth Carvalho e Jorge Aragão, entre outros. Já se apresentou na maioria dos municípios do estado de São Paulo e em mais de sete estados brasileiros.

Hoje, sediada em Trabiju/SP, a Freeband é totalmente independente em infraestrutura e logística, com equipamentos próprios da mais alta tecnologia — padrão que lhe rendeu vários prêmios de nível nacional e que continua sendo renovado por investimentos constantes.

${RELEASE_SHORT}`,
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

export const timeline = [
  {
    year: '1969',
    title: 'Fundação em Jaú/SP',
    description:
      'Um grupo de amigos com uma proposta inovadora para a época deu início a uma das trajetórias mais duradouras da música brasileira.',
    image: '/images/freeband-anos-70.jpeg',
  },
  {
    year: 'Anos 80–90',
    title: 'Expansão Nacional',
    description:
      'Conquista de espaço nos melhores clubes do país, com apresentações em mais de sete estados brasileiros.',
    image: '/images/freeband-anos-90.jpeg',
  },
  {
    year: 'Anos 2000',
    title: 'Turnês Internacionais',
    description:
      'Duas turnês internacionais ao lado de Jimmy Cliff e Cris Duran, além de palcos nacionais com Lulu Santos, Roupa Nova e Skank.',
    image: '/images/freeband-antigas.jpeg',
  },
  {
    year: '2015',
    title: 'Premiação Nacional',
    description:
      'Reconhecimento com prêmios nacionais pela excelência, qualidade e profissionalismo em mais de quatro décadas de estrada.',
    image: '/images/freeband-2015.jpeg',
  },
  {
    year: 'Hoje',
    title: 'Infraestrutura Própria',
    description:
      'Sediada em Trabiju/SP, totalmente independente com equipamentos próprios de altíssima tecnologia.',
    image: '/images/festa-55.jpeg',
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

// Especialidades de alta performance destacadas no portfolio "Orçamento
// Exclusivo". São os três formatos premium atendidos com excelência.
export const services = [
  {
    title: 'Casamentos',
    description: 'Experiência musical sofisticada para o dia mais especial da sua vida.',
    icon: '♥',
  },
  {
    title: 'Formaturas',
    description: 'Energia e repertório jovem para celebrar conquistas e novos começos.',
    icon: '★',
  },
  {
    title: 'Eventos Corporativos Premium',
    description: 'Profissionalismo e elegância para elevar o nível do seu evento.',
    icon: '◆',
  },
];

// "O que está incluso" — estrutura hierárquica exata do portfolio oficial.
export const includedFeatures = [
  {
    title: 'Show ao vivo com banda completa',
    icon: 'mic',
    items: [
      'Repertório versátil — todos os estilos',
      'Performance profissional e interativa',
      'Duração: até 3 horas',
    ],
  },
  {
    title: 'DJ exclusivo após o show',
    icon: 'headphones',
    items: ['Flashback + hits atuais', 'Pista animada até o final do evento'],
  },
  {
    title: 'Sistema de som profissional',
    icon: 'speaker',
    items: ['Qualidade cristalina', 'Cobertura total do ambiente'],
  },
  {
    title: 'Iluminação cênica e de pista',
    icon: 'spot',
    items: ['Iluminação robotizada via time code', 'Clima sofisticado e envolvente'],
  },
  {
    title: 'Estrutura adicional',
    optional: true,
    icon: 'grid',
    items: ['Painel de LED', 'Efeitos especiais', 'Estrutura personalizada conforme evento'],
  },
];

// Flat version derived from includedFeatures for PDF / legacy consumers.
export const serviceIncludes = includedFeatures.flatMap((f) => f.items);


export const partners = [
  'Clube Náutico Araraquara',
  'Cosmopolitano FC',
  'Clube de Campo Céu Azul',
  'Prefeituras Municipais',
];

// Pacotes comerciais exibidos na seção #pacotes.
export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  highlighted: boolean;
  features: string[];
}

export const servicePackages: ServicePackage[] = [
  {
    id: 'premium',
    name: 'PACOTE PREMIUM',
    description: 'A experiência completa e definitiva para eventos inesquecíveis.',
    highlighted: true,
    features: [
      'Som Completo (PA compatível com local e público)',
      'Banda Freeband',
      'DJ Buru + Estrutura de DJ',
      'Painel de LED com efeitos 3D',
      'Pista de LED',
      'Estrutura de Boate (Box truss)',
      'Iluminação robotizada via time code',
      'Máquinas de fumaça + Máquina de Sparkles',
      'Letreiro NEON 15 Anos / Parabéns',
    ],
  },
  {
    id: 'classic',
    name: 'PACOTE CLASSIC',
    description: 'Alta performance com um setup elegante e eficiente.',
    highlighted: false,
    features: [
      'Som Completo (PA compatível)',
      'Banda Freeband ou DJ Buru',
      'Iluminação Básica (LEDs)',
      'Estrutura de Boate Padrão',
      'Máquina de fumaça',
    ],
  },
];

export const contact = {
  phone: '(16) 99773-2749',
  whatsapp: '(16) 99773-2749',
  whatsappLink: 'https://wa.me/5516997732749',
  // Same number, but the conversation opens with the three answers the
  // production needs anyway — one less round-trip before a proposal exists.
  whatsappQuoteLink: `https://wa.me/5516997732749?text=${encodeURIComponent(
    'Olá! Quero um orçamento da Freeband. O evento é: (formato, data e cidade)',
  )}`,
  email: 'faleconosco@freeband.com.br',
  city: 'Trabiju/SP',
  address: 'Rua Gabriel Tannuri, 210',
  addressFull: 'Rua Gabriel Tannuri, 210 — Trabiju/SP',
  instagram: '@internacionalfreeband',
  instagramUrl: 'https://instagram.com/internacionalfreeband',
  website: 'www.freeband.com.br',
  cnpj: '59.457.507/0001-11',
};

// =============================================================================
// pageCopy — single source of truth for all UI-visible strings on the landing
// route ("/"). Components import from here instead of hard-coding headlines,
// eyebrows, CTA labels, etc. Keeps tone-of-voice edits to one file.
// =============================================================================

export const pageCopy = {
  seo: {
    // "Banda de baile e show" is the phrase a buyer actually types into
    // Google; the year is the credential no competitor can copy.
    title: 'Internacional Freeband — Banda de Baile e Show desde 1969',
    description: RELEASE_SHORT,
    ogTitle: 'Internacional Freeband — Banda de Baile e Show',
    ogDescription: RELEASE_SHORT,
  },

  nav: {
    // Shared array: consumed by NavBar (with num) and Footer (label-only).
    // Every entry points at a section whose own headline uses the same word,
    // and #pacotes is in here now — it is what a buyer actually comes for.
    sections: [
      { num: '01', label: 'PALCO', href: '#palco' },
      { num: '02', label: 'VÍDEO', href: '#video' },
      { num: '03', label: 'ARQUIVO', href: '#arquivo' },
      { num: '04', label: 'HISTÓRIA', href: '#historia' },
      { num: '05', label: 'PACOTES', href: '#pacotes' },
      { num: '06', label: 'CONTATO', href: '#contato' },
    ],
    ctaLabel: 'ORÇAMENTO',
    brandLine: `Desde ${bandInfo.founded} · ${bandInfo.location}`,
  },

  // The old hero said "A Experiência Definitiva" and "entretenimento premium",
  // which describes no particular business. This one says what the band is,
  // since when, and where it plays — all of it backed by the poster archive
  // further down the page.
  hero: {
    badge: `Banda de baile e show · desde ${bandInfo.founded}`,
    wordmarkMain: 'FREEBAND',
    wordmarkSub: 'INTERNACIONAL',
    kicker: `${bandLineup.total} no palco. ${bandInfo.yearsActive} anos de estrada.`,
    leadParagraph:
      'Réveillon de prefeitura, baile de clube, casamento e formatura — no interior de São Paulo e em mais de sete estados. Som, luz, palco e logística são nossos.',
    ctaPrimary: 'Pedir orçamento',
    ctaSecondary: 'Ver o arquivo',
    scrollLabel: 'Role',
    // Credential strip directly under the fold — the numbers a buyer weighs.
    proof: [
      { value: String(bandInfo.founded), label: 'fundada em Jaú/SP' },
      { value: String(bandLineup.total), label: 'integrantes no palco' },
      { value: '7+', label: 'estados brasileiros' },
      { value: '2', label: 'turnês internacionais' },
    ],
  },

  palco: {
    eyebrowNumber: '01',
    eyebrowLabel: 'O palco',
    headlinePrefix: 'É isto que chega na ',
    headlineEmphasis: 'sua festa',
    headlineSuffix: '.',
    lead: `${RELEASE_SHORT} As fotos abaixo são de shows nossos — sem banco de imagens.`,
    lineupEyebrow: `A formação · ${bandLineup.total} no palco`,
    figurinosEyebrow: 'Figurinos',
    figurinosLead:
      'O show troca de roupa junto com o repertório: anos 50, anos 70, country, cabaré. Cada bloco tem o seu figurino, e eles viajam com a banda.',
  },

  // The reel: four clips filmed at the band's own shows, no sound, no edit.
  // Photographs prove the structure exists; only moving pictures prove the
  // room fills up and the light rig actually does something.
  video: {
    eyebrowNumber: '02',
    eyebrowLabel: 'O show',
    headlinePrefix: 'E é assim que ele ',
    headlineEmphasis: 'se move',
    headlineSuffix: '.',
    lead: 'Quatro trechos gravados em shows nossos, sem trilha e sem edição — luz cênica, painel de LED, bailarinos e o naipe de vocais em movimento.',
    pauseLabel: 'Pausar os vídeos',
    playLabel: 'Reproduzir os vídeos',
    footnote: 'Gravações de celular, feitas na pista. O material em alta resolução vai por WhatsApp.',
  },

  arquivo: {
    eyebrowNumber: '03',
    eyebrowLabel: 'O arquivo',
    headlinePrefix: 'Cartazes de quem ',
    headlineEmphasis: 'já tocou',
    headlineSuffix: '.',
    lead: 'Réveillon de praça, baile de clube, arraiá de sócio. Duas destas viradas foram contratadas por prefeitura municipal.',
    municipalNote: 'Realização da prefeitura',
    footnote: 'Um recorte do arquivo — a agenda completa vai por WhatsApp.',
  },

  historia: {
    eyebrowNumber: '04',
    eyebrowLabel: 'A história',
    headlinePrefix: 'Começou em 1969, num fim de semana em ',
    headlineEmphasis: 'Jaú',
    headlineSuffix: '.',
    numberScrubLabel: 'fundação em Jaú/SP',
    manifestoEyebrow: 'Nas nossas palavras',
    namesEyebrow: 'Palcos divididos',
    namesLead: 'Nomes com quem a Freeband já dividiu o palco.',
    valuesLine: 'Pontualidade · honestidade · profissionalismo',
  },

  pacotes: {
    eyebrowNumber: '05',
    eyebrowLabel: 'Pacotes',
    headlinePrefix: 'Dois formatos, ',
    headlineEmphasis: 'nenhum terceirizado',
    headlineSuffix: '.',
    lead: 'O que entra no caminhão em cada um. Valores por WhatsApp, porque dependem de data, distância e estrutura do local.',
    highlightBadge: 'Mais pedido',
    ctaLabel: 'Pedir valores',
    whatsappMessage: 'Olá! Gostaria de saber mais sobre o',
    formatsEyebrow: 'Formatos atendidos',
    estruturaEyebrow: 'A estrutura · fotos de montagens nossas',
    estruturaLead:
      'O que os pacotes listam é isto aqui, montado: pista e painéis de LED, iluminação robotizada e a boate completa. Nada é terceirizado — a estrutura viaja no nosso caminhão.',
  },

  contato: {
    eyebrowNumber: '06',
    eyebrowLabel: `CNPJ ${bandInfo.cnpj} · ${contact.address}`,
    headlinePrefix: 'Qual é a ',
    headlineEmphasis: 'data',
    headlineSuffix: '?',
    lead: 'Conta o formato, a data e a cidade. Devolvemos uma proposta fechada — som, luz, palco, logística, backup e DJ depois do show.',
    phoneScrubLabel: 'Fale com a produção',
    whatsappCta: 'Falar pelo WhatsApp',
  },

  footer: {
    brandTagline: 'Uma banda feita no palco.',
    brandTaglineLong: `Desde ${bandInfo.founded}, dividindo o mesmo pulso com o Brasil.`,
    navHeading: 'Navegar',
    contactHeading: 'Contato',
    rightsNote: 'Todos os direitos reservados',
  },
};

// yearRibbon — derived at build/render time so the ribbon always ends at the
// current year without annual edits. Replaces the hard-coded array that was
// in Footer.tsx (frozen at '2026').
const CURRENT_YEAR = new Date().getFullYear();
export const yearRibbon: string[] = [
  ...[1969, 1979, 1989, 1999, 2009, 2019].filter((y) => y < CURRENT_YEAR),
  CURRENT_YEAR,
].map(String);
