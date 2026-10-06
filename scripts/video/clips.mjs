// scripts/video/clips.mjs
// The clips the site plays with sound — the single source of truth for
// encode.mjs and for whoever wires the player. Times are seconds on the
// master's own clock, the one analyze.mjs prints on every contact-sheet cell.
//
// Every cut starts and ends inside a breath of the music, read off the audio
// envelope (20 ms RMS) and the beat grid rather than off the picture, and no
// second of a master is used twice. The masters never reach -0.5 dBTP (see
// saidas/video/analise/*.loudness.json), so there was no clipped stretch to
// steer around.
//
//   id           kebab-case pt-BR slug of what is on screen; names the files
//   master       key of MASTERS in workspace.mjs
//   in, dur      where the clip starts on the master and how long it runs (s)
//   posterAt     the still shown before play, in seconds from the clip's start
//   title, description   pt-BR, what one sees — the masters carry no song or
//                        performer names, so neither does this file
//
// Optional, per clip, only when the measurement asks for it:
//   videoIn      keep the picture black until this many seconds in (the sound
//                still starts at 0)
//   crf, av1Crf, denoise   override encode.mjs when a clip blows its size
//                          budget (10 MB H.264, 5 MB AV1); say why next to it
//
// Every clip carries its own av1Crf: at the recipe's 34 these four came out at
// 8, 12.6, 15.9 and 23.2 MB. What costs the bits is the picture itself — the
// LED wall's dot grid, smoke and beams moving behind a hand-held camera — not
// noise: a heavier hqdn3d (4:3:8:6) took 1-2% off at the same CRF. Each value
// is the lowest CRF that leaves the file a few percent under 5 MB, found by
// encoding its neighbours.
export const CLIPS = [
  {
    // From the pause at 18.7 s (the band stops, she walks to the front) to the
    // quiet tail after the phrase's last long note, which ends at 45.3 s.
    // The heaviest of the four: close-ups against the lit LED lettering. x264
    // is still pinned to its 3 Mbit/s ceiling at crf 30, and 27 s of that is
    // over 10 MB, so the CRF goes up until the file fits (32: 9.8 MB).
    id: 'vocal-em-primeiro-plano',
    master: 'ok',
    in: 18.72,
    dur: 27.3,
    crf: 32,
    av1Crf: 53,
    posterAt: 3.28,
    title: 'Vocal em primeiro plano',
    description:
      'A vocalista caminha até a frente do palco e canta em primeiro plano, com o letreiro do painel de LED desfocado ao fundo.',
  },
  {
    // Pause at 96.0 s, then the band comes back in on a crash; out in the
    // stop at 119.4 s. One camera angle after another, no flash in between.
    id: 'dueto-com-a-banda',
    master: 'ok',
    in: 96.02,
    dur: 23.4,
    av1Crf: 48,
    posterAt: 2.6,
    title: 'Dueto com a banda',
    description:
      'Os dois vocalistas cantam lado a lado, com baixo, bateria e teclado atrás deles e o painel de LED aceso.',
  },
  {
    // The phrase opens on the crash at 58.24 s (beat 78 of the 82.08 BPM
    // grid) and the clip runs four phrases plus the downbeat that resolves
    // them, out in the dip at 82.75 s. The LED wall flashes white on that
    // first crash (58.27-58.30 s), the last of a run of strobes: the sound
    // starts before it, the picture after.
    id: 'solo-de-guitarra',
    master: 'top',
    in: 58.15,
    dur: 24.6,
    videoIn: 0.2,
    av1Crf: 49,
    posterAt: 3.2,
    title: 'Solo de guitarra',
    description:
      'Solo de guitarra: do palco inteiro, com uma guitarra desenhada no painel de LED, até o close nas mãos do guitarrista.',
  },
  {
    // In on the half-second stop at 38.6 s, out on the one at 58.9 s, a
    // second before the edit cuts to a close-up.
    id: 'palco-entre-luzes-e-fumaca',
    master: 'top-1',
    in: 38.55,
    dur: 20.4,
    av1Crf: 41,
    posterAt: 12.2,
    title: 'Palco entre luzes e fumaça',
    description:
      'O vocalista de bandana vermelha à frente da banda, entre fachos de luz, fumaça e os pontos coloridos do painel de LED.',
  },
];
