// src/components/pdf/portfolio/images.ts
// Every photograph the portfolio PDF prints, with its native aspect so the
// plate rows can lay it out whole. The PDF is generated in the browser and
// embeds each JPEG as-is, so this list stays on the lighter files: the old
// site's 600×400 thumbnails survive in the archive only for this document.
// The media test checks every aspect below against the file on disk.
import { images } from '@/data/media/paths';
import type { PdfFrame } from '../motifs';

export const pdfPhotos = {
  hero: { src: '/video/hero-loop.jpg', aspect: '1920/1080' },
  bandaCompleta: { src: images.festa55, aspect: '1200/800' },
  vocalistas: { src: images.img0690, aspect: '1200/800' },
  joao: { src: images.joao, aspect: '1479/1173' },
  festa70: { src: images.festa70, aspect: '600/400' },
  festa82: { src: images.festa82, aspect: '600/400' },
  img0437: { src: images.img0437, aspect: '600/400' },
  img0679: { src: images.img0679, aspect: '600/400' },
  img0867: { src: images.img0867, aspect: '600/400' },
  nautico: { src: images.nauticoAraraquara, aspect: '400/300' },
  cosmopolitano: { src: images.cartazCosmopolitano, aspect: '400/300' },
  barraBonita: { src: images.barraBonita, aspect: '700/417' },
  estruturaLuz: { src: images.estruturaLuz, aspect: '1200/1600' },
  estruturaBoate: { src: images.estruturaBoate, aspect: '1600/1200' },
} satisfies Record<string, PdfFrame>;

/** Flat list for the media test. */
export const pdfPhotoList: PdfFrame[] = Object.values(pdfPhotos);

/** The gallery page, as plate rows. */
export const pdfGalleryRows: PdfFrame[][] = [
  [pdfPhotos.bandaCompleta, pdfPhotos.vocalistas],
  [pdfPhotos.festa70, pdfPhotos.festa82, pdfPhotos.img0437],
  [pdfPhotos.joao, pdfPhotos.img0679, pdfPhotos.img0867],
];
