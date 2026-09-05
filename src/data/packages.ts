// src/data/packages.ts
// What the band sells: the two packages, the three premium formats and the
// "o que está incluso" list, all as printed in the official portfolio.

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
    items: [
      'Repertório versátil — todos os estilos',
      'Performance profissional e interativa',
      'Duração: até 3 horas',
    ],
  },
  {
    title: 'DJ exclusivo após o show',
    items: ['Flashback + hits atuais', 'Pista animada até o final do evento'],
  },
  {
    title: 'Sistema de som profissional',
    items: ['Qualidade cristalina', 'Cobertura total do ambiente'],
  },
  {
    title: 'Iluminação cênica e de pista',
    items: ['Iluminação robotizada via time code', 'Clima sofisticado e envolvente'],
  },
  {
    title: 'Estrutura adicional',
    optional: true,
    items: ['Painel de LED', 'Efeitos especiais', 'Estrutura personalizada conforme evento'],
  },
];

// Flat version derived from includedFeatures for the PDF.
export const serviceIncludes = includedFeatures.flatMap((f) => f.items);

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  highlighted: boolean;
  features: string[];
}

// Pacotes comerciais.
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
