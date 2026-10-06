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
  // Baile do Havaí: the organisers stamped a sponsor strip across the bottom
  // of the 2048×1365 original; it is cropped off the file (2048×1150).
  palcoFrenteHavai: '/images/palco-frente-havai.jpeg',
  // Clube Náutico Araraquara, photographs by Jonas Matheus. The club stamped
  // its logo over the bottom-right corner and the credit down the right
  // margin; both are cropped off the files (1465×888 landscape, 955×1365
  // portrait) and the credit is printed on the page instead.
  palcoAnos50: '/images/palco-anos-50.jpeg',
  nauticoQuatroVozes: '/images/nautico-quatro-vozes.jpeg',
  nauticoVozFeminina: '/images/nautico-voz-feminina.jpeg',
  nauticoDoisVocalistas: '/images/nautico-dois-vocalistas.jpeg',
  nauticoVocalistasPalco: '/images/nautico-vocalistas-palco.jpeg',
  nauticoVocalBandana: '/images/nautico-vocal-bandana.jpeg',
  nauticoVocalFloral: '/images/nautico-vocal-floral.jpeg',
  nauticoBlocoCirco: '/images/nautico-bloco-circo.jpeg',
  nauticoCircoFrente: '/images/nautico-circo-frente.jpeg',
  nauticoBailarinaCirco: '/images/nautico-bailarina-circo.jpeg',
  nauticoBlocoAnos50: '/images/nautico-bloco-anos-50.jpeg',
  nauticoBailarinoCirco: '/images/nautico-bailarino-circo.jpeg',
  nauticoBandaTriangulo: '/images/nautico-banda-triangulo.jpeg',
  nauticoPalcoLuzes: '/images/nautico-palco-luzes.jpeg',
  nauticoBaterista: '/images/nautico-baterista.jpeg',
  nauticoTecladoFeixes: '/images/nautico-teclado-feixes.jpeg',
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
  // People
  joao: '/images/joao.jpeg',
  // Venues & event posters
  baileTabatinga: '/images/baile-tabatinga.jpeg',
  barraBonita: '/images/barra-bonita.jpeg',
  nauticoAraraquara: '/images/nautico-araraquara.jpeg',
  freebandJau: '/images/freeband-jau.jpeg',
  freebandSocial: '/images/freeband-social.jpeg',
  // Historical — anos-70/80/antigas/2015 are re-encoded WHOLE from the
  // originals in the workspace's fontes/fotos/originais (outside this repo).
  anos70: '/images/freeband-anos-70.jpeg',
  anos80: '/images/freeband-anos-80.jpeg',
  antigas: '/images/freeband-antigas.jpeg',
  anos2000: '/images/freeband-anos-2000.jpeg',
  // The band's own album: paper prints photographed as they are and brought
  // in by scripts/import-archive.mjs (stood upright, trimmed to the print).
  arquivoBateriaMetais: '/images/arquivo-bateria-e-metais.jpeg',
  arquivoFormacaoBranco: '/images/arquivo-formacao-de-branco.jpeg',
  arquivoCartazBranco: '/images/arquivo-cartaz-de-branco.jpeg',
  arquivoGuitarraTeclado: '/images/arquivo-guitarra-e-teclado.jpeg',
  arquivoPalcoBranco: '/images/arquivo-palco-de-branco.jpeg',
  arquivoGuitarristaFev85: '/images/arquivo-guitarrista-fev-85.jpeg',
  arquivoVozesFev85: '/images/arquivo-vozes-fev-85.jpeg',
  arquivoGrupoVermelho: '/images/arquivo-grupo-de-vermelho.jpeg',
  arquivoPalcoCortina: '/images/arquivo-palco-cortina-vermelha.jpeg',
  arquivoPalcoMesaSom: '/images/arquivo-palco-e-mesa-de-som.jpeg',
  // Promotional
  fb2015: '/images/freeband-2015.jpeg',
  cartazCosmopolitano: '/images/cartaz-cosmopolitano.jpeg',
  // New Year events
  reveillomIacanga: '/images/reveillom-iacanga.jpeg',
  reveillomItatinga: '/images/reveillom-itatinga.jpeg',
  reveillomParanapanema: '/images/reveillom-paranapanema.jpeg',
} as const;

/** Pixel dimensions written as "W/H". */
export type Aspect = `${number}/${number}`;

/** A photograph as the layout needs it: file, description, real "W/H". */
export interface Photo {
  src: string;
  alt: string;
  /** The file's NATIVE pixel dimensions as "W/H" — checked by the media test. */
  aspect: Aspect;
}

/** A photograph that carries its own caption. */
export interface CaptionedPhoto extends Photo {
  /** Short caption rendered under the frame — what the picture shows. */
  caption: string;
}

/** Numeric ratio (w/h) of an "W/H" aspect string. */
export function ratioOf(aspect: string): number {
  const [w, h] = aspect.split('/').map(Number);
  return w / h;
}
