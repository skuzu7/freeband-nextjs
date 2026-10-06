// src/components/pdf/WordmarkPdf.tsx
// The wordmark drawn with react-pdf's Svg primitives from the same geometry
// the site uses (src/design/wordmark.ts), so the mark in a PDF is the mark on
// the backdrop: vector, red, 19-unit strokes with butt caps. Never a font.
import { G, Path, Svg } from '@react-pdf/renderer';
import { WORDMARK, WORDMARK_VIEWBOX, wordmarkPaths } from '@/design/wordmark';
import { pdfLed } from './theme';

// Module scope: the eight glyphs as absolute path data, bowls included.
const GLYPH_PATHS = wordmarkPaths();

/** Depth of the acrylic, in wordmark units: the offset of the extruded side (the site's own). */
const SIDE = { dx: 1.5, dy: 2.5 } as const;

interface WordmarkStrokesProps {
  color: string;
  dx?: number;
  dy?: number;
}

/** The mark's strokes in wordmark units, for any <Svg> that already has them as its viewBox. */
export function WordmarkStrokes({ color, dx = 0, dy = 0 }: WordmarkStrokesProps) {
  return (
    <G fill="none" stroke={color} strokeWidth={WORDMARK.stroke} strokeLinecap="butt">
      {GLYPH_PATHS.map((glyph) => (
        <G key={glyph.x} transform={`translate(${glyph.x + dx}, ${dy})`}>
          {glyph.d.map((d) => (
            <Path key={d} d={d} />
          ))}
        </G>
      ))}
    </G>
  );
}

/** The acrylic as the stage shows it: the extruded side, then the face. */
export function WordmarkAcrylic() {
  return (
    <>
      <WordmarkStrokes color={pdfLed.acrylicSide} dx={SIDE.dx} dy={SIDE.dy} />
      <WordmarkStrokes color={pdfLed.acrylic} />
    </>
  );
}

interface WordmarkPdfProps {
  /** Rendered width in points; the height follows the mark's own ratio. */
  width: number;
  color?: string;
}

export function WordmarkPdf({ width, color = pdfLed.acrylic }: WordmarkPdfProps) {
  const { viewBox } = WORDMARK;
  return (
    <Svg viewBox={WORDMARK_VIEWBOX} width={width} height={(width * viewBox.height) / viewBox.width}>
      <WordmarkStrokes color={color} />
    </Svg>
  );
}
