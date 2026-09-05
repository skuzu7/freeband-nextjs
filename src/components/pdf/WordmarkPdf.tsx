// src/components/pdf/WordmarkPdf.tsx
// The wordmark drawn with react-pdf's Svg primitives from the same GLYPHS the
// site uses, so the mark in a PDF is the mark on the backdrop: vector, red,
// 19-unit strokes with butt caps.
import { Circle, G, Path, Svg } from '@react-pdf/renderer';
import { GLYPHS, WORDMARK } from '@/components/brand/Wordmark';
import { pdfColors } from './theme';

interface WordmarkPdfProps {
  /** Rendered width in points; the height follows the mark's own ratio. */
  width: number;
  color?: string;
}

const { viewBox } = WORDMARK;
const VIEWBOX = `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`;

export function WordmarkPdf({ width, color = pdfColors.red }: WordmarkPdfProps) {
  const height = (width * viewBox.height) / viewBox.width;
  return (
    <Svg viewBox={VIEWBOX} width={width} height={height}>
      <G
        fill="none"
        stroke={color}
        strokeWidth={WORDMARK.stroke}
        strokeLinecap="butt"
        transform={`translate(${WORDMARK.overhang}, 0)`}
      >
        {GLYPHS.map((glyph, i) => (
          <G key={i} transform={`translate(${glyph.x}, 0)`}>
            {glyph.circle && <Circle cx={WORDMARK.bowl.cx} cy={WORDMARK.bowl.cy} r={WORDMARK.bowl.r} />}
            {glyph.d.map((d, j) => (
              <Path key={j} d={d} />
            ))}
          </G>
        ))}
      </G>
    </Svg>
  );
}
