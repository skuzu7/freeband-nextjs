// @vitest-environment node
//
// The dots of the PDFs are paths, not circles: a rule, a rail and a number
// are each a handful of <Path> elements whose dots are zero-length segments
// (react-pdf paints them as discs under a round cap — rendered and checked
// when this was written). A motif that goes back to one <Circle> per dot
// fails here. The wall's arithmetic is pure and is checked here too.
import { isValidElement, type ReactElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { wordmarkCells } from '@/lib/led/glyphs';
import { gridPaths } from '@/lib/led/svg';
import { ledDots } from '@/lib/led/matrix';
import { DotLinePdf, DotRailPdf, LedNumberPdf, ledNumberWidth, plateHeight } from '../motifs';
import { DOT_PITCH } from '../theme';
import { wallLayers } from '../wall';

type Props = { children?: ReactNode; d?: string; strokeLinecap?: string; strokeWidth?: number };

/** Every element of a tree, by the name of its react-pdf primitive ("PATH", "CIRCLE"…). */
function elements(node: ReactNode, out: ReactElement<Props>[] = []): ReactElement<Props>[] {
  if (Array.isArray(node)) node.forEach((child) => elements(child, out));
  else if (isValidElement<Props>(node)) {
    out.push(node);
    elements(node.props.children, out);
  }
  return out;
}
const named = (node: ReactNode, name: string) => elements(node).filter((el) => String(el.type) === name);
/** Dots in a path drawn by dotsPath(): one "M x y h0" each. */
const dotsIn = (d: string | undefined) => (d?.match(/M/g) ?? []).length;

describe('PDF motifs', () => {
  it('draws the dotted rule as one path of zero-length segments', () => {
    const rule = DotLinePdf({ width: 120 });
    const paths = named(rule, 'PATH');
    expect(named(rule, 'CIRCLE')).toHaveLength(0);
    expect(paths).toHaveLength(1);
    expect(paths[0].props.strokeLinecap).toBe('round');
    expect(paths[0].props.d).toMatch(/^(M[\d.]+ [\d.]+h0)+$/);
    expect(dotsIn(paths[0].props.d)).toBe(120 / DOT_PITCH);
  });

  it('draws a number as two paths — the panel and the lit cells — or one without the panel', () => {
    const { dots } = ledDots('1969');
    const number = LedNumberPdf({ value: '1969', height: 28 });
    const paths = named(number, 'PATH');
    expect(named(number, 'CIRCLE')).toHaveLength(0);
    expect(paths.map((p) => dotsIn(p.props.d))).toEqual([dots.length, dots.filter((d) => d.on).length]);
    for (const path of paths) expect(path.props.strokeLinecap).toBe('round');

    expect(named(LedNumberPdf({ value: '1969', height: 28, dimColor: null }), 'PATH')).toHaveLength(1);
    // Four characters: 4 × 5 columns and three blank ones between, on 7 rows.
    expect(ledNumberWidth('1969', 28)).toBe((23 * 28) / 7);
  });

  it('runs the rail from the top to its last node, one dot per pitch, each node a dot of the rail', () => {
    const rail = DotRailPdf({ nodes: [10, 100, 205] });
    const [dots, ring, gap, dot] = named(rail, 'PATH');
    // 205pt snaps to the 34th dot of a 6pt rail (1 + 34 × 6): 35 dots in all.
    expect(dotsIn(dots.props.d)).toBe(35);
    for (const node of [ring, gap, dot]) expect(dotsIn(node.props.d)).toBe(3);
    expect(Number(ring.props.strokeWidth)).toBeGreaterThan(Number(gap.props.strokeWidth));
    expect(Number(gap.props.strokeWidth)).toBeGreaterThan(Number(dot.props.strokeWidth));
    const railDots = new Set(dots.props.d?.match(/M[\d.]+ [\d.]+/g));
    for (const node of dot.props.d?.match(/M[\d.]+ [\d.]+/g) ?? []) expect(railDots.has(node)).toBe(true);
  });

  it('sizes a plate row by its photographs, so none is cropped', () => {
    const frames = [
      { src: '/a.jpeg', aspect: '3/2' },
      { src: '/b.jpeg', aspect: '1/1' },
    ];
    // (500 − 10) / (1.5 + 1)
    expect(plateHeight(frames, 500, 10)).toBeCloseTo(196);
  });
});

describe('the wall behind the wordmark', () => {
  const grid = wordmarkCells(64);
  const pad = { left: 5, right: 5, top: 8, bottom: 9 };
  const lit = gridPaths(grid).reduce((sum, level) => sum + dotsIn(level.d), 0);

  it('puts every dot of the wall in exactly one layer', () => {
    const wall = wallLayers(grid, pad, 3);
    const field = wall.field.reduce((sum, layer) => sum + dotsIn(layer.d), 0);
    const glow = wall.glow.reduce((sum, d) => sum + dotsIn(d), 0);
    expect(wall.viewBox.width).toBe(pad.left + grid.cols + pad.right);
    expect(wall.viewBox.height).toBe(pad.top + grid.rows + pad.bottom);
    expect(lit + glow + field).toBe(wall.viewBox.width * wall.viewBox.height);
    // No dot twice: the layers share no coordinate.
    const seen = new Set<string>();
    for (const d of [...wall.field.map((layer) => layer.d), ...wall.glow]) {
      for (const dot of d.match(/M-?\d+ -?\d+/g) ?? []) {
        expect(seen.has(dot), dot).toBe(false);
        seen.add(dot);
      }
    }
  });

  it('throws light around the letters, less of it with fewer rings', () => {
    const three = wallLayers(grid, pad, 3);
    const one = wallLayers(grid, pad, 1);
    expect(three.glow).toHaveLength(3);
    for (const ring of three.glow) expect(dotsIn(ring)).toBeGreaterThan(0);
    expect(one.glow[0]).toBe(three.glow[0]);
  });

  it('fades the unlit dots towards an edge in steps, and not at all unless asked', () => {
    expect(wallLayers(grid, pad, 3).field.map((layer) => layer.scale)).toEqual([1]);
    const faded = wallLayers(grid, pad, 3, { bottom: 8 }).field.map((layer) => layer.scale);
    expect(faded.length).toBeGreaterThan(1);
    expect(Math.max(...faded)).toBe(1);
    expect(Math.min(...faded)).toBeGreaterThan(0);
  });
});
