// src/data/media/videos.ts
// The clips the site plays with sound: four live cuts of 20–27 s from the
// band's own camera masters, 1920×1080, AAC stereo at −16 LUFS. Each one is
// four files in public/video — <id>.av1.mp4, <id>.mp4 (H.264), <id>.jpg (a
// frame of the clip) and <id>.levels.json (the audio's RMS envelope, which
// the LED wall listens to).
//
// scripts/video/clips.mjs is where the cuts are made and
// scripts/video/manifest.json what the encoder measured; titles,
// descriptions, durations and codec strings here are that manifest's, and
// src/data/__tests__/media.test.ts fails when the two disagree. The masters
// carry no song or performer names, so neither does this file.
import type { Aspect } from './paths';

export interface VideoSource {
  src: string;
  /** The full MIME type, `codecs` included: a browser that cannot decode the
   *  file rules it out without fetching a byte of it. */
  type: string;
}

/** A WebVTT file of subtitles or captions. */
export interface VideoTrack {
  src: string;
  kind: 'subtitles' | 'captions';
  /** BCP 47, e.g. "pt-BR". */
  srcLang: string;
  /** How the track is named to whoever picks it. */
  label: string;
}

export interface VideoClip {
  /** Names the four files and the clip's anchor on the page. */
  id: string;
  title: string;
  /** What one sees — printed under the player and read to whoever cannot watch. */
  description: string;
  /** In the order the browser should try them: AV1 first, H.264 for the rest. */
  sources: VideoSource[];
  /** The still shown before play: a frame of the clip itself. */
  poster: string;
  /** What that still shows. */
  alt: string;
  /** Pixel dimensions of the picture and of the poster, as "W/H". */
  aspect: Aspect;
  /** Seconds, as measured on the encoded file. */
  duration: number;
  /** `{ rate, levels }`: the audio's loudness 0..1, `rate` samples a second
   *  (see src/lib/media/level.ts). */
  levels: string;
  /** The day the clip went up, ISO 8601 — for structured data. */
  uploaded: string;
  /** Subtitles, when a clip has them. The player shows its button only then. */
  tracks?: VideoTrack[];
}

const AV1 = 'video/mp4; codecs="av01.0.08M.08, mp4a.40.2"';
const H264 = 'video/mp4; codecs="avc1.640028, mp4a.40.2"';

type ClipCopy = Pick<VideoClip, 'id' | 'title' | 'description' | 'alt' | 'duration'>;

function clip({ id, ...rest }: ClipCopy): VideoClip {
  return {
    id,
    ...rest,
    sources: [
      { src: `/video/${id}.av1.mp4`, type: AV1 },
      { src: `/video/${id}.mp4`, type: H264 },
    ],
    poster: `/video/${id}.jpg`,
    aspect: '1920/1080',
    levels: `/video/${id}.levels.json`,
    uploaded: '2026-10-06',
  };
}

export const videos: VideoClip[] = [
  clip({
    id: 'vocal-em-primeiro-plano',
    title: 'Vocal em primeiro plano',
    description:
      'A vocalista caminha até a frente do palco e canta em primeiro plano, com o letreiro do painel de LED desfocado ao fundo.',
    alt: 'Vocalista cantando ao microfone em close, sob luz magenta, com o painel de LED ao fundo',
    duration: 27.3,
  }),
  clip({
    id: 'dueto-com-a-banda',
    title: 'Dueto com a banda',
    description:
      'Os dois vocalistas cantam lado a lado, com baixo, bateria e teclado atrás deles e o painel de LED aceso.',
    alt: 'Vocalista de jaqueta espelhada e vocalista de vestido preto cantando lado a lado, com o baixista e a bateria atrás e o painel de LED aceso',
    duration: 23.4234,
  }),
  clip({
    id: 'solo-de-guitarra',
    title: 'Solo de guitarra',
    description:
      'Solo de guitarra: do palco inteiro, com uma guitarra desenhada no painel de LED, até o close nas mãos do guitarrista.',
    alt: 'Guitarrista em solo sob luz azul, à frente de uma guitarra branca desenhada no painel de LED, com bateria e teclados ao redor',
    duration: 24.6246,
  }),
  clip({
    id: 'palco-entre-luzes-e-fumaca',
    title: 'Palco entre luzes e fumaça',
    description:
      'O vocalista de bandana vermelha à frente da banda, entre fachos de luz, fumaça e os pontos coloridos do painel de LED.',
    alt: 'Vocalista de bandana vermelha cantando de braço aberto ao lado do tecladista, entre fachos de luz, fumaça e os pontos do painel de LED',
    duration: 20.4,
  }),
];
