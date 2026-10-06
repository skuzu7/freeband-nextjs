// src/lib/gallery/sets.ts
// Walking a gallery set: where a photograph sits, what comes before and
// after it, and the addresses that follow from that. Pure — the sets
// themselves live in src/data/media/gallery.ts.
import type { GalleryItem, GallerySet } from '@/data/media/gallery';

type SetAddress = Pick<GallerySet, 'path' | 'segment'>;
type SetItems = Pick<GallerySet, 'items'>;

/** Position of a photograph in its set, or -1 when the id is not in it. */
export function indexOfItem(set: SetItems, id: string): number {
  return set.items.findIndex((item) => item.id === id);
}

export function findItem(set: SetItems, id: string): GalleryItem | undefined {
  return set.items.find((item) => item.id === id);
}

/** `index` brought back into the set, wrapping at both ends. */
export function wrapIndex(index: number, total: number): number {
  return ((index % total) + total) % total;
}

export interface Position {
  item: GalleryItem;
  /** Zero-based. */
  index: number;
  total: number;
  /** The neighbours wrap: the last photograph is followed by the first. */
  prev: GalleryItem;
  next: GalleryItem;
  first: GalleryItem;
  last: GalleryItem;
}

/** Everything the viewer needs to know about where `id` sits; null if absent. */
export function positionOf(set: SetItems, id: string): Position | null {
  const index = indexOfItem(set, id);
  if (index < 0) return null;
  const { items } = set;
  const total = items.length;
  return {
    item: items[index],
    index,
    total,
    prev: items[wrapIndex(index - 1, total)],
    next: items[wrapIndex(index + 1, total)],
    first: items[0],
    last: items[total - 1],
  };
}

/** The photograph's own address: /palco/foto/<id>. */
export function hrefFor(set: SetAddress, id: string): string {
  return `${set.path}/${set.segment}/${id}`;
}

/** The id of the thumbnail on the gallery page: where focus goes back to. */
export function anchorFor(set: Pick<GallerySet, 'segment'>, id: string): string {
  return `${set.segment}-${id}`;
}

/** The gallery page, scrolled to the photograph's thumbnail. */
export function backHrefFor(set: SetAddress, id: string): string {
  return `${set.path}#${anchorFor(set, id)}`;
}

/** The name the thumbnail and the viewer share, so one morphs into the other. */
export function transitionNameFor(set: Pick<GallerySet, 'key'>, id: string): string {
  return `${set.key}-${id}`;
}

/** What a thumbnail needs to open its photograph in the viewer. */
export interface PhotoLinkTarget {
  href: string;
  /** The thumbnail's own DOM id. */
  anchor: string;
  /** View-transition name shared with the viewer. */
  name: string;
  /** Accessible name: "Ampliar foto: <caption>". */
  label: string;
}

export function linkFor(set: GallerySet, id: string): PhotoLinkTarget {
  const item = findItem(set, id);
  if (!item) throw new Error(`gallery "${set.key}" has no photograph "${id}"`);
  return {
    href: hrefFor(set, id),
    anchor: anchorFor(set, id),
    name: transitionNameFor(set, id),
    label: `${set.labels.open}: ${item.caption}`,
  };
}

/** Native pixel size of a file, read from its "W/H" aspect. */
export function naturalSize(aspect: string): { width: number; height: number } {
  const [width, height] = aspect.split('/').map(Number);
  return { width, height };
}

/** Room the viewer's bars take above and below the photograph, in rem. */
const VIEWER_CHROME_REM = 11;
/** A file narrower than this is shown at its own size on any screen. */
const SMALL_FILE_PX = 828;

/**
 * next/image `sizes` for a photograph fitted whole into the viewer: bound by
 * the height on a screen wider than the picture, by the width otherwise, and
 * never asked for beyond the file's own pixels.
 */
export function viewerSizes(aspect: string): string {
  const { width, height } = naturalSize(aspect);
  if (width <= SMALL_FILE_PX) return `(min-width: ${width}px) ${width}px, 100vw`;
  const ratio = (width / height).toFixed(4);
  return `(min-aspect-ratio: ${width}/${height}) calc((100vh - ${VIEWER_CHROME_REM}rem) * ${ratio}), 100vw`;
}

/** `sizes` once the photograph is magnified to `cssWidth` px, capped at the file. */
export function zoomedSizes(aspect: string, cssWidth: number): string {
  return `${Math.min(naturalSize(aspect).width, Math.ceil(cssWidth))}px`;
}
