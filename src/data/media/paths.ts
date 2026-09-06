// src/data/media/paths.ts
// The registry of every image file the site and the PDFs may reference. No
// component names a path directly: it goes through here, so the media test
// can prove each one exists.
//
// The archive holds three genuinely different kinds of picture:
//   stage photography — real shows, saturated light, high resolution; runs
//                       large and in full colour.
//   posters           — actual event flyers. Artefacts, presented as such;
//                       the town and date on each one is the credential.
//   heritage          — pre-digital band shots, already faded.

export const images = {
  // 2026 batch — the current line-up, shot at full shows. Highest-resolution
  // frames in the archive; vocal-dourado-palco is from a 4331×2887 original.
  vocalDouradoPalco: '/images/vocal-dourado-palco.jpeg',
  vocalEspelhado: '/images/vocal-espelhado.jpeg',
  palcoBandaCompleta: '/images/palco-banda-completa.jpeg',
  palcoLedCoracoes: '/images/palco-led-coracoes.jpeg',
  palcoAsasLed: '/images/palco-asas-led.jpeg',
  palcoCountryLed: '/images/palco-country-led.jpeg',
  palcoAnos70: '/images/palco-anos-70.jpeg',
  palcoCabare: '/images/palco-cabare.jpeg',
  // Clube Náutico Araraquara (Jonas Matheus), watermark strip cropped off.
  palcoAnos50: '/images/palco-anos-50.jpeg',
  // Golden sequin frontman, 2010×2130 camera scan.
  vocalPaete: '/images/vocal-paete-ouro.jpeg',
  // Wardrobe — shot backstage, one per block of the show.
  figurinoPlumas: '/images/figurino-plumas.jpeg',
  figurinoAnos50: '/images/figurino-anos-50.jpeg',
  figurinoCountry: '/images/figurino-country.jpeg',
  // The rig itself, mounted.
  bateriaFreebandNeon: '/images/bateria-freeband-neon.jpeg',
  vocalRockPb: '/images/vocal-rock-pb.jpeg',
  estruturaBoate: '/images/estrutura-boate.jpeg',
  estruturaSalao: '/images/estrutura-salao.jpeg',
  estruturaLuz: '/images/estrutura-luz.jpeg',
  // Show photos — festa-209/308 are 2560px pro-camera frames.
  festa55: '/images/festa-55.jpeg',
  festa209: '/images/festa-209.jpeg',
  festa308: '/images/festa-308.jpeg',
  img0690: '/images/img-0690.jpeg',
  // 600×400 thumbnails from the band's old site. NEVER in the web galleries —
  // they survive only because the portfolio PDF prints them small.
  festa70: '/images/festa-70.jpeg',
  festa82: '/images/festa-82.jpeg',
  img0437: '/images/img-0437.jpeg',
  img0679: '/images/img-0679.jpeg',
  img0867: '/images/img-0867.jpeg',
  // People
  joao: '/images/joao.jpeg',
  // Venues & event posters
  baileTabatinga: '/images/baile-tabatinga.jpeg',
  barraBonita: '/images/barra-bonita.jpeg',
  nauticoAraraquara: '/images/nautico-araraquara.jpeg',
  freebandJau: '/images/freeband-jau.jpeg',
  freebandSocial: '/images/freeband-social.jpeg',
  // Historical — anos-70/80/antigas/2015 are re-encoded WHOLE from the
  // originals in Desktop/Freeband/_originais.
  anos70: '/images/freeband-anos-70.jpeg',
  anos80: '/images/freeband-anos-80.jpeg',
  anos90: '/images/freeband-anos-90.jpeg',
  antigas: '/images/freeband-antigas.jpeg',
  // Promotional
  fb2015: '/images/freeband-2015.jpeg',
  cartazCosmopolitano: '/images/cartaz-cosmopolitano.jpeg',
  // New Year events
  reveillomIacanga: '/images/reveillom-iacanga.jpeg',
  reveillomItatinga: '/images/reveillom-itatinga.jpeg',
  reveillomParanapanema: '/images/reveillom-paranapanema.jpeg',
} as const;

export type ImageKey = keyof typeof images;

/** A photograph as the layout needs it: file, description, real "W/H". */
export interface Photo {
  src: string;
  alt: string;
  /** The file's NATIVE pixel dimensions as "W/H" — checked by the media test. */
  aspect: string;
}

/** Numeric ratio (w/h) of an "W/H" aspect string. */
export function ratioOf(aspect: string): number {
  const [w, h] = aspect.split('/').map(Number);
  return w / h;
}
