// src/components/pdf/portfolio/images.ts
// Every photograph the portfolio PDF prints, with its native aspect so the
// plate rows can lay it out whole. The PDF is generated in the browser and
// embeds each JPEG as-is, so this list is also the file's weight: about 3.7 MB
// of photographs with the eras', under the 5 MB the document is allowed (the
// render test pins the ceiling). Nothing here is below 1 000 px on its long
// edge except the three flyers, which only survive as small scans and are
// printed small.
// The media test checks every aspect below against the file on disk.
//
// The five eras' own photographs are not listed: the timeline page reads them
// from src/data/band.ts, where the media test already checks them.
import { images } from '@/data/media/paths';
import type { StageCategory } from '@/data/media/frames';
import type { PdfFrame } from '../motifs';

export const pdfPhotos = {
  // Cover: the band in front of its own wall of LED.
  capa: { src: images.nauticoBandaTriangulo, aspect: '1465/888' },
  // Quem somos.
  bandaCompleta: { src: images.palcoBandaCompleta, aspect: '1179/1438' },
  // O palco — Ato I, the voices.
  vocalDourado: { src: images.vocalDouradoPalco, aspect: '2560/1706' },
  vocalistas: { src: images.img0690, aspect: '1200/800' },
  // Ato II, the four thematic blocks.
  blocoAnos50: { src: images.palcoAnos50, aspect: '955/1365' },
  blocoAnos70: { src: images.palcoAnos70, aspect: '1112/1600' },
  blocoCountry: { src: images.palcoCountryLed, aspect: '1074/1600' },
  blocoCabare: { src: images.palcoCabare, aspect: '1174/1600' },
  // Ato III, light and LED. The first is also the timeline's "Hoje" (the PDF
  // embeds a file once however often it is printed).
  megaEstrutura: { src: images.festa55, aspect: '1200/800' },
  asasLed: { src: images.palcoAsasLed, aspect: '1179/1328' },
  // Do arquivo: three flyers.
  nautico: { src: images.nauticoAraraquara, aspect: '400/300' },
  cosmopolitano: { src: images.cartazCosmopolitano, aspect: '400/300' },
  barraBonita: { src: images.barraBonita, aspect: '700/417' },
  // The rig, mounted.
  estruturaBoate: { src: images.estruturaBoate, aspect: '1600/1200' },
} satisfies Record<string, PdfFrame>;

/** Flat list for the media test. */
export const pdfPhotoList: PdfFrame[] = Object.values(pdfPhotos);

/** The gallery page: one plate row per act of /palco, in the same order. */
export const pdfGalleryActs: { act: StageCategory; frames: PdfFrame[] }[] = [
  { act: 'vocais', frames: [pdfPhotos.vocalDourado, pdfPhotos.vocalistas] },
  { act: 'blocos', frames: [pdfPhotos.blocoAnos50, pdfPhotos.blocoAnos70, pdfPhotos.blocoCountry, pdfPhotos.blocoCabare] },
  { act: 'efeitos', frames: [pdfPhotos.megaEstrutura, pdfPhotos.asasLed] },
];

/** The gallery page, as plate rows. */
export const pdfGalleryRows: PdfFrame[][] = pdfGalleryActs.map((row) => row.frames);
