// src/lib/plates.ts
// The plate rule as arithmetic: a row of whole photographs at one height.
// Column widths are fr values proportional to each photo's ratio, so every box
// ends level and no picture is cropped. Pure, so anything that needs its own
// markup around each frame — a link into the gallery, a caption — still lays
// the row out by the same rule.
import type { CSSProperties } from 'react';
import { ratioOf, type Photo } from '@/data/media/paths';

/** Widest the page column gets, in px (`--container-site` is 88rem). */
const COLUMN_PX = 1408;

/** `sizes` for a frame taking `fraction` of a row that itself takes `rowFraction` of the viewport. */
function sizesFor(fraction: number, rowFraction: number, sideBySide: boolean): string {
  const desktop = Math.ceil(fraction * rowFraction * 100);
  const capped = Math.ceil(fraction * rowFraction * COLUMN_PX);
  const mobile = sideBySide ? Math.ceil(fraction * 100) : 88;
  return `(min-width: ${COLUMN_PX}px) ${capped}px, (min-width: 640px) ${desktop}vw, ${mobile}vw`;
}

export interface PlateLayout {
  /** CSS variables for the `.plate` grid. */
  style: CSSProperties;
  /** next/image `sizes` per frame, in order. */
  sizes: string[];
}

/** The grid template and image sizes for one row of frames. */
export function plateLayout(frames: Pick<Photo, 'aspect'>[], rowFraction = 1): PlateLayout {
  const ratios = frames.map((f) => ratioOf(f.aspect));
  const total = ratios.reduce((a, b) => a + b, 0);
  const cols = ratios.map((r) => `${r.toFixed(4)}fr`).join(' ');
  // Under 40rem only portraits, or a pair, share the width; anything else
  // stacks so every photograph stays whole.
  const allPortrait = frames.length > 1 && ratios.every((r) => r < 1);
  const sideBySide = allPortrait || frames.length === 2;
  return {
    style: {
      '--plate-cols': cols,
      '--plate-cols-m': sideBySide ? cols : '1fr',
    } as CSSProperties,
    sizes: ratios.map((r) => sizesFor(r / total, rowFraction, sideBySide)),
  };
}
