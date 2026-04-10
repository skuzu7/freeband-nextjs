// src/data/content.ts
export const bandInfo = {
  name: "Internacional Freeband",
  tagline: "Desde 1969 criando experiências musicais inesquecíveis",
  subtitle: "Portfolio & Serviços",
  founded: 1969,
  yearsActive: new Date().getFullYear() - 1969,
  location: "Trabiju/SP",
  founder: "Antonio Lourenço Morales",
};

export const release = {
  full: `Fundada em 1969 na cidade de Jaú/SP por um grupo de amigos com uma proposta inovadora para a época, a Internacional Freeband se tornou uma das bandas mais duradouras do Brasil, permanecendo no cenário musical brasileiro até os dias de hoje.

Com qualidade musical, profissionalismo e pontualidade, a banda conquistou seu espaço em vários estados brasileiros, realizando duas turnês internacionais e participando de shows de nível nacional ao lado de grandes artistas como Lulu Santos, Roupa Nova e Jimmy Cliff.

Hoje, sediada em Trabiju, a Freeband é totalmente independente em infraestrutura e logística, com equipamentos próprios de alta tecnologia que mantém o padrão de qualidade que rendeu vários prêmios nacionais.`,
  highlights: [
    { value: `${new Date().getFullYear() - 1969}+`, label: "anos de história" },
    { value: "7+", label: "estados brasileiros" },
    { value: "2", label: "turnês internacionais" },
    { value: "100%", label: "equipamentos próprios" },
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
      "Conquista de espaço no mercado musical em vários estados brasileiros, com apresentações nos melhores clubes do país.",
    image: "/images/freeband-anos-90.jpeg",
  },
  {
    year: "Anos 2000",
    title: "Turnês Internacionais",
    description:
      "Duas turnês internacionais com Jimmy Cliff e Cris Duran, além de participações em shows de nível nacional.",
    image: "/images/freeband-antigas.jpeg",
  },
  {
    year: "2015",
    title: "Premiação Nacional",
    description:
      "Reconhecimento com prêmios de nível nacional pela excelência, qualidade e profissionalismo em mais de 4 décadas.",
    image: "/images/freeband-2015.jpeg",
  },
  {
    year: "Hoje",
    title: "Infraestrutura Própria",
    description:
      "Sediada em Trabiju/SP, totalmente independente com equipamentos de alta tecnologia e investimento constante.",
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
  "14bis",
  "Beth Carvalho",
  "Jorge Aragão",
  "Placa Luminosa",
  "Jimmy Cliff",
  "Cris Duran",
];

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
    title: "Eventos Corporativos",
    description:
      "Profissionalismo e elegância para elevar o nível do seu evento.",
    icon: "◆",
  },
  {
    title: "Festas Premium",
    description:
      "Reveillon, Carnaval, Baile do Havaí e comemorações especiais.",
    icon: "♪",
  },
  {
    title: "Shows Municipais",
    description:
      "Grandes palcos e público em eventos da cidade com estrutura completa.",
    icon: "⌂",
  },
];

export const serviceIncludes = [
  "Banda completa com músicos profissionais",
  "Equipamento de som de alta potência",
  "Iluminação profissional com moving heads",
  "Logística e transporte próprio",
  "Repertório personalizado para seu evento",
  "Equipamento de backup completo",
];

export const partners = [
  "Clube Náutico Araraquara",
  "Cosmopolitano FC",
  "Clube de Campo Céu Azul",
  "Prefeituras Municipais",
];

export const contact = {
  phone: "(16) 99171-2996",
  whatsapp: "(16) 99171-2996",
  whatsappLink: "https://wa.me/5516991712996",
  email: "faleconosco@freeband.com.br",
  city: "Trabiju/SP",
};
