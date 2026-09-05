// src/data/media/figurinos.ts
// The wardrobe, shot backstage. Evidence that the show has blocks.
import { images, type Photo } from './paths';

export interface WardrobeShot extends Photo {
  caption: string;
}

export const figurinos: WardrobeShot[] = [
  {
    src: images.figurinoPlumas,
    alt: 'Bailarinos em figurino vermelho com plumas e chapéus',
    caption: 'Plumas & Anos 70',
    aspect: '1179/1557',
  },
  {
    src: images.figurinoAnos50,
    alt: 'Bailarinos em figurino anos 50 de poá com luvas brancas',
    caption: 'Anos 50 & Retrô',
    aspect: '1200/1600',
  },
  {
    src: images.figurinoCountry,
    alt: 'Dupla em figurino country dourado com franjas e chapéu',
    caption: 'Country & Sertanejo',
    aspect: '1179/1551',
  },
];
