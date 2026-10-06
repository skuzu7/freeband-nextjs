'use client';

// Client-only, like everything under src/components/pdf/: importing this
// from a Server Component is a build error, which is the point — the PDF
// toolkit must never enter the server module graph.
// src/components/pdf/motifs.tsx
// The system's motifs, for the PDFs: the dotted rule and rail, a number in the
// 5×7 LED matrix, and a row of whole photographs laid out by the plate rule.
//
// Every dot here is a zero-length segment stroked with round caps, the same
// trick src/lib/led/svg.ts plays on the site: a rule, a rail or a whole number
// is one <Path>, not one <Circle> per dot. react-pdf passes the segment through
// as `x y m x y l` under `1 J`, which the PDF spec paints as a filled circle;
// rendered and checked in the Windows and Chrome (PDFium) renderers.
import { Image, Path, Svg, View } from '@react-pdf/renderer';
import { ledPath } from '@/lib/led/matrix';
import { dotsPath } from '@/lib/led/svg';
import { ratioOf } from '@/data/media/paths';
import { DOT_PITCH, pdfGround, pdfTones, pdfUrl } from './theme';

/** Diameter of a rule's dot, in points. */
const RULE_DOT = 1.6;

interface DotLinePdfProps {
  width: number;
  color?: string;
}

/** One row of the panel: a dotted rule, 6pt pitch (the site's .dot-line uses 8px; paper is denser). */
export function DotLinePdf({ width, color = pdfTones.paper.led }: DotLinePdfProps) {
  const n = Math.floor(width / DOT_PITCH);
  const d = dotsPath(Array.from({ length: n }, (_, i) => [i * DOT_PITCH + 1, 1] as const));
  return (
    <Svg width={width} height={2} viewBox={`0 0 ${width} 2`}>
      <Path d={d} fill="none" stroke={color} strokeWidth={RULE_DOT} strokeLinecap="round" />
    </Svg>
  );
}

interface DotRailPdfProps {
  /** Distances from the top, in points, where an era begins: a lit dot with a ring of its own colour. */
  nodes: readonly number[];
  color?: string;
  nodeColor?: string;
  /** Colour of the gap between a node and its ring: the surface behind the rail. */
  surface?: string;
}

/** Width of the rail's box: the node's ring fits inside it. */
export const RAIL_WIDTH = 12;
/** Diameters of a node: its ring, the gap inside it, the dot. */
const NODE = { ring: 10, gap: 8, dot: 4.4 } as const;

/**
 * One column of the panel: the rule turned on its side, with the nodes of a
 * timeline on it. Nodes snap to the rail's own pitch, so a node is a dot of
 * the rail switched on, never one squeezed in between two; the rail runs from
 * the top to its last node and stops there.
 */
export function DotRailPdf({
  nodes,
  color = pdfTones.paper.led,
  nodeColor = pdfTones.paper.led,
  surface = pdfGround.paper,
}: DotRailPdfProps) {
  const x = RAIL_WIDTH / 2;
  // Index of the rail dot each node switches on.
  const rows = nodes.map((y) => Math.max(0, Math.round((y - 1) / DOT_PITCH)));
  const last = Math.max(0, ...rows);
  const at = (row: number) => [x, row * DOT_PITCH + 1] as const;
  const height = last * DOT_PITCH + 1 + NODE.ring / 2 + 1;
  const rail = dotsPath(Array.from({ length: last + 1 }, (_, row) => at(row)));
  const lit = dotsPath(rows.map(at));
  return (
    <Svg width={RAIL_WIDTH} height={height} viewBox={`0 0 ${RAIL_WIDTH} ${height}`}>
      <Path d={rail} fill="none" stroke={color} strokeWidth={RULE_DOT} strokeLinecap="round" />
      {/* Ring, gap, dot: three sizes of the same point. */}
      <Path d={lit} fill="none" stroke={nodeColor} strokeWidth={NODE.ring} strokeLinecap="round" />
      <Path d={lit} fill="none" stroke={surface} strokeWidth={NODE.gap} strokeLinecap="round" />
      <Path d={lit} fill="none" stroke={nodeColor} strokeWidth={NODE.dot} strokeLinecap="round" />
    </Svg>
  );
}

/** Dot diameters in cell units, lit and unlit — the site's LedNumber. */
const LIT = 0.84;
const UNLIT = 0.3;

interface LedNumberPdfProps {
  /** Digits, "+" and spaces only; anything else is a blank cell. */
  value: string;
  /** Height of the matrix in points; width follows. */
  height: number;
  color?: string;
  /** Colour of the unlit cells; `null` leaves the panel behind the digits out. */
  dimColor?: string | null;
}

/** Width in points of a value set at `height`: one cell is height / 7. */
export function ledNumberWidth(value: string, height: number): number {
  const { width, rows } = ledPath(value);
  return (width * height) / rows;
}

/**
 * Digits in the real dot matrix: the whole panel is one path, the lit cells
 * another (src/lib/led/matrix.ts), exactly the two the site draws.
 */
export function LedNumberPdf({
  value,
  height,
  color = pdfTones.paper.led,
  dimColor = pdfTones.paper.ledDim,
}: LedNumberPdfProps) {
  const { width, rows, all, lit } = ledPath(value);
  const cell = height / rows;
  // Cell centres fall on integers: the half-cell shift is in the viewBox, so
  // no transform is needed.
  return (
    <Svg width={width * cell} height={height} viewBox={`-0.5 -0.5 ${width} ${rows}`}>
      {dimColor && <Path d={all} fill="none" stroke={dimColor} strokeWidth={UNLIT} strokeLinecap="round" />}
      <Path d={lit} fill="none" stroke={color} strokeWidth={LIT} strokeLinecap="round" />
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

/** Height in points of a plate row of `frames` set `width` wide. */
export function plateHeight(frames: PdfFrame[], width: number, gap = 6): number {
  const sum = frames.reduce((acc, f) => acc + ratioOf(f.aspect), 0);
  return (width - gap * (frames.length - 1)) / sum;
}

/**
 * Equal-height row, widths proportional to each photo's ratio, no cropping.
 * The same rule the site's plates follow.
 */
export function PlateRowPdf({ frames, width, gap = 6 }: PlateRowPdfProps) {
  const height = plateHeight(frames, width, gap);
  return (
    <View style={{ flexDirection: 'row', gap }}>
      {frames.map((f) => (
        <Image key={f.src} src={pdfUrl(f.src)} style={{ width: ratioOf(f.aspect) * height, height }} />
      ))}
    </View>
  );
}

/** One photograph at a given width, whole. */
export function PhotoPdf({ frame, width }: { frame: PdfFrame; width: number }) {
  return <Image src={pdfUrl(frame.src)} style={{ width, height: width / ratioOf(frame.aspect) }} />;
}
