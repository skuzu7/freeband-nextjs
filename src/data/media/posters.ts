// src/data/media/posters.ts
// The gig archive. Every field is transcribed from the artwork itself;
// nothing here is inferred. No competitor can reproduce this section, so the
// metadata has to be exactly right.
import { images, type Photo } from './paths';

export const POSTER_CATEGORIES = ['municipal', 'clube', 'reveillon'] as const;
export type PosterCategory = (typeof POSTER_CATEGORIES)[number];

export interface Poster extends Photo {
  /** Town, as printed on the flyer. */
  town: string;
  /** Event name, as printed. */
  event: string;
  /** Year as printed, or the date when the flyer carries no year. */
  when: string;
  /** Venue or promoter line, as printed. */
  venue?: string;
  /** True when a city hall is the named promoter. */
  municipal?: boolean;
  category: PosterCategory;
}

export const posters: Poster[] = [
  {
    src: images.barraBonita,
    alt: 'Cartaz do Réveillon 2020 da Estância Turística de Barra Bonita',
    town: 'Barra Bonita',
    event: 'Réveillon',
    when: '2020',
    venue: 'Praça do Teleférico · 28 a 31 dez',
    category: 'reveillon',
    aspect: '700/417',
  },
  {
    src: images.reveillomParanapanema,
    alt: 'Cartaz do Réveillon 2017 na Praça da Matriz de Paranapanema',
    town: 'Paranapanema',
    event: 'Réveillon',
    when: '2017',
    venue: 'Praça da Matriz · 31/12, 23h',
    municipal: true,
    category: 'municipal',
    aspect: '2048/1152',
  },
  {
    src: images.reveillomItatinga,
    alt: 'Cartaz da Festa Virada de Ano 2023 de Itatinga',
    town: 'Itatinga',
    event: 'Festa Virada de Ano',
    when: '2023',
    venue: 'Prefeitura Municipal · 30/12',
    municipal: true,
    category: 'municipal',
    aspect: '400/300',
  },
  {
    src: images.freebandJau,
    alt: 'Cartaz do show da Internacional Freeband no Palco do Salão Social do Caiçara Clube Jaú',
    town: 'Jaú',
    event: 'Show Salão Social',
    when: '09/Nov',
    venue: 'Caiçara Clube Jaú · Palco Social',
    category: 'clube',
    aspect: '1072/1076',
  },
  {
    src: images.freebandSocial,
    alt: 'Cartaz do Baile do Havaí da Internacional Freeband no Clube de Campo Céu Azul',
    town: 'Céu Azul',
    event: 'Baile do Havaí',
    when: '07/Dez',
    venue: 'Clube de Campo Céu Azul',
    category: 'clube',
    aspect: '1080/1080',
  },
  {
    src: images.reveillomIacanga,
    alt: 'Cartaz da virada de 2026 na Praia das Palmeiras',
    town: 'Iacanga',
    event: 'A virada é aqui',
    when: '2026',
    venue: 'Praia das Palmeiras · 22h',
    category: 'reveillon',
    aspect: '400/300',
  },
  {
    src: images.nauticoAraraquara,
    alt: 'Cartaz do Arraiá do Náutico com aviso de mesas esgotadas',
    town: 'Araraquara',
    event: 'Arraiá do Náutico',
    when: '08/06',
    venue: 'Clube Náutico · mesas esgotadas',
    category: 'clube',
    aspect: '400/300',
  },
  {
    src: images.cartazCosmopolitano,
    alt: 'Cartaz do Baile do Havaí no Cosmopolitano FC',
    town: 'Cosmopolitano FC',
    event: 'Baile do Havaí',
    when: '—',
    venue: 'Cosmopolitano Futebol Clube',
    category: 'clube',
    aspect: '400/300',
  },
  {
    src: images.baileTabatinga,
    alt: 'Cartaz do Baile do Havaí em Tabatinga',
    town: 'Tabatinga',
    event: 'Baile do Havaí',
    when: '07/12',
    venue: 'Clube de Campo de Tabatinga',
    category: 'clube',
    aspect: '400/300',
  },
];
