// src/components/pdf/LedWallPdf.tsx
// The backdrop, as the audience sees it: a wall of LED dots with the name lit
// on it, and the red acrylic standing in front. The dots are the wordmark
// itself sampled into a grid (src/lib/led/glyphs.ts), so the letters on the
// wall sit exactly behind the acrylic ones; what shows around the acrylic is
// the light they throw on the panel (src/components/pdf/wall.ts).
//
// One <Path> per dot size, each dot a zero-length segment with a round cap —
// a few thousand dots cost a dozen paths.
import { G, Path, Svg } from '@react-pdf/renderer';
import { WORDMARK } from '@/design/wordmark';
import { wordmarkCells } from '@/lib/led/glyphs';
import { gridPaths } from '@/lib/led/svg';
import { pdfLed } from './theme';
import { wallLayers, type WallFade, type WallPad } from './wall';
import { WordmarkAcrylic } from './WordmarkPdf';

/** Columns of dots across the mark — the site's LedWordmark: a stroke is a little over three dots wide. */
export const WALL_COLS = 128;

/** Diameter of an unlit dot, in dots. */
const UNLIT = 0.3;

const [dim, low, mid, bright, hot] = pdfLed.ramp;

interface Ring {
  /** Diameter in dots. */
  size: number;
  color: string;
}

// The light on the wall, nearest ring first. Behind the acrylic the letters'
// own dots are hidden, so the rings carry all of it: three of them, starting
// bright. With no acrylic the letters are the hot dots and two rings only
// soften their edge. More rings than that fill the bowls of the e, b, a and
// d, whose counters are barely five dots across.
const HALO: readonly Ring[] = [
  { size: 0.7, color: bright },
  { size: 0.56, color: mid },
  { size: 0.4, color: low },
];
const SOFT_EDGE: readonly Ring[] = [
  { size: 0.5, color: mid },
  { size: 0.36, color: low },
];

const NO_PAD: WallPad = { left: 0, right: 0, top: 0, bottom: 0 };

// Sampled once per module, like the site's.
const grid = wordmarkCells(WALL_COLS);
const lit = gridPaths(grid);

/** Points per dot for a mark `width` points wide. */
export const wallPitch = (width: number) => width / WALL_COLS;

/** Size in points of the wall drawn around a mark `width` wide. */
export function wallSize(width: number, pad: WallPad = NO_PAD) {
  const pitch = wallPitch(width);
  return {
    width: (pad.left + grid.cols + pad.right) * pitch,
    height: (pad.top + grid.rows + pad.bottom) * pitch,
    /** Where the mark's own box starts inside the wall. */
    markLeft: pad.left * pitch,
    markTop: (pad.top - grid.offsetY) * pitch,
  };
}

interface LedWallPdfProps {
  /** Width in points of the wordmark; the wall runs past it by `pad`. */
  width: number;
  /** Dots of wall around the mark. */
  pad?: WallPad;
  /** Rows over which the unlit dots shrink towards the top or bottom edge. */
  fade?: WallFade;
  /** The acrylic in front of the wall. Without it the name is the dots alone. */
  acrylic?: boolean;
}

export function LedWallPdf({ width, pad = NO_PAD, fade, acrylic = true }: LedWallPdfProps) {
  const size = wallSize(width, pad);
  const rings = acrylic ? HALO : SOFT_EDGE;
  const wall = wallLayers(grid, pad, rings.length, fade);
  const { viewBox } = wall;
  // One dot, in wordmark units.
  const cell = WORDMARK.viewBox.width / grid.cols;

  return (
    <Svg
      width={size.width}
      height={size.height}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
    >
      <G fill="none" strokeLinecap="round">
        {wall.field.map((layer) => (
          <Path key={layer.scale} d={layer.d} stroke={dim} strokeWidth={UNLIT * layer.scale} />
        ))}
        {wall.glow.map((d, i) => (
          <Path key={rings[i].size} d={d} stroke={rings[i].color} strokeWidth={rings[i].size} />
        ))}
        {lit.map((level) => (
          <Path key={level.width} d={level.d} stroke={acrylic ? bright : hot} strokeWidth={level.width} />
        ))}
      </G>
      {acrylic && (
        // Wordmark units onto the dots: the mark's box is the grid's, and the
        // grid's first dot sits half a cell in.
        <G transform={`translate(-0.5, ${-(grid.offsetY + 0.5)})`}>
          <G transform={`scale(${1 / cell})`}>
            <G transform={`translate(${-WORDMARK.viewBox.x}, ${-WORDMARK.viewBox.y})`}>
              <WordmarkAcrylic />
            </G>
          </G>
        </G>
      )}
    </Svg>
  );
}
