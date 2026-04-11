// src/data/content.ts
// Single source of truth for band copy and metadata. Extracted and
// consolidated from the official Internacional Freeband brochure and
// the "Orçamento Exclusivo" portfolio PDF.

export const bandInfo = {
  name: "Internacional Freeband",
  legalName: "Banda Internacional Freeband — Junior Promoções Artísticas",
  cnpj: "59.457.507/0001-11",
  tagline: "Sinônimo em padrão de qualidade",
  taglineLong:
    "Experiências musicais de alto padrão para eventos inesquecíveis",
  subtitle: "Portfolio & Serviços",
  founded: 1969,
  foundedCity: "Jaú/SP",
  yearsActive: new Date().getFullYear() - 1969,
  location: "Trabiju/SP",
  founder: "Antônio Lourenço Morales",
  founderTitle: "Fundador e idealizador",
  website: "www.freeband.com.br",
};

// On-stage lineup — 11 integrantes, from the official brochure
export const bandLineup = {
  total: 11,
  roles: [
    { count: 2, role: "Tecladistas" },
    { count: 1, role: "Baterista" },
    { count: 1, role: "Baixista" },
    { count: 2, role: "Guitarristas" },
    { count: 2, role: "Cantores" },
    { count: 2, role: "Cantoras" },
    { count: 1, role: "Bailarino" },
  ],
};

export const release = {
  full: `Fundada em 1969 na cidade de Jaú/SP por um grupo de amigos com uma proposta inovadora para a época, a Internacional Freeband nasceu para tocar aos finais de semana — todos os integrantes mantinham compromissos profissionais — e rapidamente se tornou uma das trajetórias mais duradouras da música brasileira, ainda presente no cenário até hoje.

Com visão à frente do seu tempo, sempre antenada às tendências tecnológicas, seu fundador S.R. Antônio Lourenço Morales posicionou a Freeband de forma sólida e definitiva no mercado nacional, conquistando espaço nos melhores clubes do Brasil e em empresas dos mais variados segmentos.

A banda realizou duas turnês internacionais ao lado de Jimmy Cliff e Cris Duran e participou de shows de nível nacional com nomes como Lulu Santos, Roupa Nova, Skank, Daniel, Cristian e Ralf, Ultraje a Rigor, Raça Negra, Erasmo Carlos, César e Paulinho, 14Bis, Beth Carvalho e Jorge Aragão, entre outros. Já se apresentou na maioria dos municípios do estado de São Paulo e em mais de sete estados brasileiros.

Hoje, sediada em Trabiju/SP, a Freeband é totalmente independente em infraestrutura e logística, com equipamentos próprios da mais alta tecnologia — padrão que lhe rendeu vários prêmios de nível nacional e que continua sendo renovado por investimentos constantes.`,
  highlights: [
    { value: `${new Date().getFullYear() - 1969}+`, label: "anos de estrada" },
    { value: "11", label: "integrantes no palco" },
    { value: "7+", label: "estados brasileiros" },
    { value: "2", label: "turnês internacionais" },
  ],
  values: ["Pontualidade", "Honestidade", "Profissionalismo"],
};

export const timeline = [
  {
    year: "1969",
    title: "Fundação em Jaú/SP",
    description:
      "Um grupo de amigos com uma proposta inovadora para a época deu início a uma das trajetórias mais duradouras da música brasileira.",
    image: "/images/freeband-anos-70.jpeg",
  },
  {
    year: "Anos 80–90",
    title: "Expansão Nacional",
    description:
      "Conquista de espaço nos melhores clubes do país, com apresentações em mais de sete estados brasileiros.",
    image: "/images/freeband-anos-90.jpeg",
  },
  {
    year: "Anos 2000",
    title: "Turnês Internacionais",
    description:
      "Duas turnês internacionais ao lado de Jimmy Cliff e Cris Duran, além de palcos nacionais com Lulu Santos, Roupa Nova e Skank.",
    image: "/images/freeband-antigas.jpeg",
  },
  {
    year: "2015",
    title: "Premiação Nacional",
    description:
      "Reconhecimento com prêmios nacionais pela excelência, qualidade e profissionalismo em mais de quatro décadas de estrada.",
    image: "/images/freeband-2015.jpeg",
  },
  {
    year: "Hoje",
    title: "Infraestrutura Própria",
    description:
      "Sediada em Trabiju/SP, totalmente independente com equipamentos próprios de altíssima tecnologia.",
    image: "/images/festa-55.jpeg",
  },
];

export const artists = [
  "Lulu Santos",
  "Roupa Nova",
  "Skank",
  "Daniel",
  "Cristian e Ralf",
  "Ultraje a Rigor",
  "Raça Negra",
  "Erasmo Carlos",
  "César e Paulinho",
  "14Bis",
  "Beth Carvalho",
  "Jorge Aragão",
  "Placa Luminosa",
  "Jimmy Cliff",
  "Cris Duran",
];

// Especialidades de alta performance destacadas no portfolio "Orçamento
// Exclusivo". São os três formatos premium atendidos com excelência.
export const services = [
  {
    title: "Casamentos",
    description:
      "Experiência musical sofisticada para o dia mais especial da sua vida.",
    icon: "♥",
  },
  {
    title: "Formaturas",
    description:
      "Energia e repertório jovem para celebrar conquistas e novos começos.",
    icon: "★",
  },
  {
    title: "Eventos Corporativos Premium",
    description:
      "Profissionalismo e elegância para elevar o nível do seu evento.",
    icon: "◆",
  },
];

// "O que está incluso" — estrutura hierárquica exata do portfolio oficial.
export const includedFeatures = [
  {
    title: "Show ao vivo com banda completa",
    icon: "mic",
    items: [
      "Repertório versátil — todos os estilos",
      "Performance profissional e interativa",
      "Duração: até 3 horas",
    ],
  },
  {
    title: "DJ exclusivo após o show",
    icon: "headphones",
    items: [
      "Flashback + hits atuais",
      "Pista animada até o final do evento",
    ],
  },
  {
    title: "Sistema de som profissional",
    icon: "speaker",
    items: [
      "Qualidade cristalina",
      "Cobertura total do ambiente",
    ],
  },
  {
    title: "Iluminação cênica e de pista",
    icon: "spot",
    items: [
      "Moving heads, efeitos e ambientação",
      "Clima sofisticado e envolvente",
    ],
  },
  {
    title: "Estrutura adicional",
    optional: true,
    icon: "grid",
    items: [
      "Painel de LED",
      "Efeitos especiais",
      "Estrutura personalizada conforme evento",
    ],
  },
];

// Flat version derived from includedFeatures for PDF / legacy consumers.
export const serviceIncludes = includedFeatures.flatMap((f) => f.items);

// Condições comerciais padrão impressas no portfolio "Orçamento Exclusivo".
export const proposalTerms = {
  entradaPct: 30,
  entradaLabel: "30% de entrada para reservar a data",
  saldoLabel: "Saldo restante até o dia do evento",
  validadeDias: 7,
  validadeLabel: "Validade deste orçamento: 7 dias",
};

export const partners = [
  "Clube Náutico Araraquara",
  "Cosmopolitano FC",
  "Clube de Campo Céu Azul",
  "Prefeituras Municipais",
];

export const contact = {
  phone: "(16) 99773-2749",
  whatsapp: "(16) 99773-2749",
  whatsappLink: "https://wa.me/5516997732749",
  email: "faleconosco@freeband.com.br",
  city: "Trabiju/SP",
  address: "Rua Gabriel Tannuri, 210",
  addressFull: "Rua Gabriel Tannuri, 210 — Trabiju/SP",
  instagram: "@internacionalfreeband",
  instagramUrl: "https://instagram.com/internacionalfreeband",
  website: "www.freeband.com.br",
  cnpj: "59.457.507/0001-11",
};
