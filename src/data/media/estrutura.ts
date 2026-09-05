// src/data/media/estrutura.ts
// The mounted rig, photographed at real setups: the receipt for every line
// the packages list. Each caption points at a package feature.
import { images, type Photo } from './paths';

export interface EstruturaShot extends Photo {
  caption: string;
}

export const estrutura: EstruturaShot[] = [
  {
    src: images.estruturaBoate,
    alt: 'Estrutura de boate montada com pista de LED, painéis e iluminação em neon rosa e azul',
    caption: 'Pista e painéis de LED',
    aspect: '1600/1200',
  },
  {
    src: images.estruturaSalao,
    alt: 'Salão de evento com moving heads, esferas de luz e globos espelhados instalados no teto',
    caption: 'Montagem em salão',
    aspect: '1600/1200',
  },
  {
    src: images.estruturaLuz,
    alt: 'Feixes verdes da iluminação robotizada cruzando a pista de LED durante o ajuste',
    caption: 'Iluminação robotizada',
    aspect: '1200/1600',
  },
];
