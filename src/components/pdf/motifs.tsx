// src/components/pdf/motifs.tsx
// The system's motifs, for paper: the dotted rule, a number in the 5×7 LED
// matrix, and a row of whole photographs laid out by the plate rule.
import { Circle, Image, Svg, View } from '@react-pdf/renderer';
import { ledDots } from '@/components/brand/LedNumber';
import { ratioOf } from '@/data/media/paths';
import { pdfColors, pdfUrl } from './theme';

/** One row of the panel: a dotted rule, 8pt pitch. */
export function DotLinePdf({ width, color = pdfColors.led }: { width: number; color?: string }) {
  const pitch = 6;
  const n = Math.floor(width / pitch);
  return (
    <Svg width={width} height={2} viewBox={`0 0 ${width} 2`}>
      {Array.from({ length: n }, (_, i) => (
        <Circle key={i} cx={i * pitch + 1} cy={1} r={0.8} fill={color} />
      ))}
    </Svg>
  );
}

interface LedNumberPdfProps {
  value: string;
  /** Height of the matrix in points; width follows. */
  height: number;
  color?: string;
  dimColor?: string;
}

/** Digits in the real dot matrix, unlit cells shown dim. */
export function LedNumberPdf({ value, height, color = pdfColors.ledBright, dimColor = pdfColors.ledDim }: LedNumberPdfProps) {
  const { width, rows, dots } = ledDots(value);
  const cell = height / rows;
  return (
    <Svg width={width * cell} height={height} viewBox={`0 0 ${width} ${rows}`}>
      {dots.map((d) => (
        <Circle
          key={`${d.x}-${d.y}`}
          cx={d.x + 0.5}
          cy={d.y + 0.5}
          r={d.on ? 0.42 : 0.14}
          fill={d.on ? color : dimColor}
        />
      ))}
    </Svg>
  );
}

export interface PdfFrame {
  src: string;
  /** Native "W/H" of the file — checked by the media test. */
  aspect: string;
}

interface PlateRowPdfProps {
  frames: PdfFrame[];
  /** Total row width in points. */
  width: number;
  gap?: number;
}

/**
 * Equal-height row, widths proportional to each photo's ratio, no cropping.
 * The same rule the site's plates follow.
 */
export function PlateRowPdf({ frames, width, gap = 6 }: PlateRowPdfProps) {
  const ratios = frames.map((f) => ratioOf(f.aspect));
  const sum = ratios.reduce((a, b) => a + b, 0);
  const net = width - gap * (frames.length - 1);
  const height = net / sum;
  return (
    <View style={{ flexDirection: 'row', gap }}>
      {frames.map((f, i) => (
        <Image key={f.src} src={pdfUrl(f.src)} style={{ width: ratios[i] * height, height }} />
      ))}
    </View>
  );
}

/** One photograph at a given width, whole. */
export function PhotoPdf({ frame, width }: { frame: PdfFrame; width: number }) {
  return <Image src={pdfUrl(frame.src)} style={{ width, height: width / ratioOf(frame.aspect) }} />;
}
