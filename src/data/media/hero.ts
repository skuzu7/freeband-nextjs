// src/data/media/hero.ts
// The fold: a twelve-second wide of the full stage under the moving-head
// show, looping silently behind the wordmark. The poster is the loop's own
// first frame and is the page's LCP; the video only attaches on idle and never
// under reduced motion.
export const heroMedia = {
  video: '/video/hero-loop.mp4',
  poster: '/video/hero-loop.jpg',
  alt: 'Palco completo da Internacional Freeband sob feixes de luz robotizada e fumaça, com o painel de LED em triângulos',
  aspect: '16/9',
} as const;
