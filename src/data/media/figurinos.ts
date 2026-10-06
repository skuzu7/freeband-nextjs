// src/data/media/figurinos.ts
// The wardrobe, shot backstage. Evidence that the show has blocks.
import { images, type CaptionedPhoto } from './paths';

export interface Figurino extends CaptionedPhoto {
  /** Slug of the file name: the photograph's address in the gallery. */
  id: string;
}

export const figurinos: Figurino[] = [
  {
    id: 'figurino-plumas',
    src: images.figurinoPlumas,
    alt: 'Bailarinos em figurino vermelho com plumas e chapéus',
    caption: 'Plumas & Anos 70',
    aspect: '1179/1557',
  },
  {
    id: 'figurino-anos-50',
    src: images.figurinoAnos50,
    alt: 'Bailarinos em figurino anos 50 de poá com luvas brancas',
    caption: 'Anos 50 & Retrô',
    aspect: '1200/1600',
  },
  {
    id: 'figurino-country',
    src: images.figurinoCountry,
    alt: 'Dupla em figurino country dourado com franjas e chapéu',
    caption: 'Country & Sertanejo',
    aspect: '1179/1551',
  },
];
