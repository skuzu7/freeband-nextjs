// src/data/media/gallery.ts
// The three sets the photo viewer walks, in reading order. `palco` is every
// photograph on /palco — the three acts, then wardrobe, then the rig —
// `arquivo` is the nine flyers, and `historia` is the timeline: each era's
// own photographs, then its album. Each photograph has its own address
// (/palco/foto/<id>, /arquivo/cartaz/<id>, /historia/foto/<id>), so the order
// here is also the order of "previous" and "next", and an id can never change
// once shared.
import { eraPhotos, timeline } from '../band';
import { arquivo } from '../copy/arquivo';
import { historia } from '../copy/historia';
import { palco } from '../copy/palco';
import { estrutura } from './estrutura';
import { figurinos } from './figurinos';
import { stageFrames } from './frames';
import type { Photo } from './paths';
import { posters, type Poster } from './posters';

export const GALLERY_KEYS = ['palco', 'arquivo', 'historia'] as const;
export type GalleryKey = (typeof GALLERY_KEYS)[number];

/** One photograph as the viewer shows it. */
export interface GalleryItem extends Photo {
  /** Unique within its set and stable: it is the last segment of the URL. */
  id: string;
  /** What the picture shows — the viewer's heading. */
  caption: string;
  /** Where it belongs: the act of the show, or a flyer's date and venue. */
  meta?: string;
  /** A third line, printed as a label (a flyer promoted by a city hall). */
  note?: string;
}

/** Every string the viewer prints or announces for one set. */
export interface ViewerLabels {
  /** Names the dialog and the page's viewer region. */
  title: string;
  /** Prefix of a thumbnail's accessible name: "<open>: <caption>". */
  open: string;
  close: string;
  /** The way out of a photograph's own page. */
  back: string;
  prev: string;
  next: string;
  counter: (index: number, total: number) => string;
  zoomIn: string;
  zoomOut: string;
  share: string;
  /** Said once the address is on the clipboard. */
  copied: string;
  /** Said when neither sharing nor copying is available. */
  shareFailed: string;
  /** The keyboard, described once for whoever cannot see the controls. */
  keys: string;
}

export interface GallerySet {
  key: GalleryKey;
  /** The page the set is laid out on. */
  path: `/${string}`;
  /** The URL segment between that page and a photograph's id. */
  segment: string;
  items: GalleryItem[];
  labels: ViewerLabels;
}

const actOf = Object.fromEntries(
  palco.acts.map((act) => [act.key, `${palco.actWord} ${act.numeral} · ${act.title}`]),
);

/** A flyer's heading and its line of facts, as printed under it everywhere. */
export const posterTitle = (p: Poster): string => `${p.town} · ${p.event}`;
export const posterMeta = (p: Poster): string =>
  [p.when !== '—' ? p.when : null, p.venue].filter(Boolean).join(' · ');

const palcoItems: GalleryItem[] = [
  ...stageFrames.map((f) => ({
    id: f.id,
    src: f.src,
    alt: f.alt,
    aspect: f.aspect,
    caption: f.caption,
    meta: actOf[f.category],
  })),
  ...figurinos.map((f) => ({
    id: f.id,
    src: f.src,
    alt: f.alt,
    aspect: f.aspect,
    caption: f.caption,
    meta: `${palco.figurinos.label} · ${palco.figurinos.headline}`,
  })),
  ...estrutura.map((f) => ({
    id: f.id,
    src: f.src,
    alt: f.alt,
    aspect: f.aspect,
    caption: f.caption,
    meta: `${palco.estrutura.label} · ${palco.estrutura.headline}`,
  })),
];

const arquivoItems: GalleryItem[] = posters.map((p) => ({
  id: p.id,
  src: p.src,
  alt: p.alt,
  aspect: p.aspect,
  caption: posterTitle(p),
  meta: posterMeta(p) || undefined,
  note: p.municipal ? arquivo.municipalNote : undefined,
}));

// A photograph of the timeline is placed by its era: "Anos 80–90 · Expansão Nacional".
const historiaItems: GalleryItem[] = timeline.flatMap((era) =>
  eraPhotos(era).map((photo) => ({
    id: photo.id,
    src: photo.src,
    alt: photo.alt,
    aspect: photo.aspect,
    caption: photo.caption,
    meta: `${era.year} · ${era.title}`,
  })),
);

export const gallery: Record<GalleryKey, GallerySet> = {
  palco: { key: 'palco', path: '/palco', segment: 'foto', items: palcoItems, labels: palco.viewer },
  arquivo: { key: 'arquivo', path: '/arquivo', segment: 'cartaz', items: arquivoItems, labels: arquivo.viewer },
  historia: { key: 'historia', path: '/historia', segment: 'foto', items: historiaItems, labels: historia.viewer },
};
