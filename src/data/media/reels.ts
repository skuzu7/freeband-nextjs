// src/data/media/reels.ts
// Twelve-second silent clips cut from the band's own AVCHD camera footage
// (1440×1080i masters), deinterlaced and delivered at 1280×720/30, each under
// ~2.3 MB. `poster` is the clip's own first frame, so nothing pops when the
// video takes over.

export interface Reel {
  src: string;
  poster: string;
  /** What the clip shows — read out to anyone who can't watch it. */
  alt: string;
  caption: string;
  tag: string;
  aspect: string;
}

export const reels: Reel[] = [
  {
    src: '/video/reel-dueto.mp4',
    poster: '/video/reel-dueto.jpg',
    alt: 'Dueto de vocalistas cantando à frente do painel de LED aceso',
    caption: 'Dueto de vocalistas',
    tag: 'Vozes',
    aspect: '16/9',
  },
  {
    src: '/video/reel-vocal-rock.mp4',
    poster: '/video/reel-vocal-rock.jpg',
    alt: 'Vocalista de bandana cantando em close sob luz azul e magenta',
    caption: 'Bloco rock · frente de palco',
    tag: 'Blocos',
    aspect: '16/9',
  },
  {
    src: '/video/reel-vocal-fem.mp4',
    poster: '/video/reel-vocal-fem.jpg',
    alt: 'Vocalista cantando em close sob luz magenta, com o painel de LED ao fundo',
    caption: 'Vocal feminino · ao vivo',
    tag: 'Vozes',
    aspect: '16/9',
  },
  {
    src: '/video/reel-guitarra.mp4',
    poster: '/video/reel-guitarra.jpg',
    alt: 'Guitarrista em solo sob luz azul, com uma guitarra gigante no telão de LED',
    caption: 'Solo de guitarra',
    tag: 'A banda',
    aspect: '16/9',
  },
];
