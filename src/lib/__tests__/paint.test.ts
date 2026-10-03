// paintDots only talks to Path2D and a 2D context, so both are faked: the
// paths record what was drawn into them, the context records each fill.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { paintDots } from '../led/paint';
import { dotRadius, quantize, type DotLayout } from '../led/rasterize';

interface Arc {
  x: number;
  y: number;
  radius: number;
}

/** Every path built during the test, in creation order (one per level). */
let created: FakePath[] = [];

class FakePath {
  moves: [number, number][] = [];
  arcs: Arc[] = [];
  constructor() {
    created.push(this);
  }
  moveTo(x: number, y: number) {
    this.moves.push([x, y]);
  }
  arc(x: number, y: number, radius: number) {
    this.arcs.push({ x, y, radius });
  }
}

function fakeContext() {
  const fills: { style: string; path: FakePath }[] = [];
  const ctx = {
    fillStyle: '',
    fill(path: FakePath) {
      fills.push({ style: this.fillStyle, path });
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, fills };
}

/** The layout the marquee uses: dots at the centre of square cells. */
function stripLayout(pitch: number): DotLayout {
  return { pitch, offsetX: pitch / 2, offsetY: pitch / 2, maxRadius: pitch * 0.42 };
}

const palette = (n: number) => Array.from({ length: n }, (_, i) => `level-${i}`);

beforeEach(() => {
  created = [];
  vi.stubGlobal('Path2D', FakePath);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('paintDots', () => {
  it('centres each dot in its cell and sizes it by intensity', () => {
    const { ctx } = fakeContext();
    const layout = stripLayout(10);
    const cells = [0, 255, 128, 64];
    paintDots(ctx, cells, { cols: 2, rows: 2 }, layout, palette(12));

    const arcs = created.flatMap((p) => p.arcs);
    const moves = created.flatMap((p) => p.moves);
    expect(arcs).toHaveLength(4);
    const at = (x: number, y: number) => arcs.find((a) => a.x === x && a.y === y);
    expect(at(5, 5)?.radius).toBe(dotRadius(0, layout.maxRadius));
    expect(at(15, 5)?.radius).toBe(dotRadius(255, layout.maxRadius));
    expect(at(5, 15)?.radius).toBe(dotRadius(128, layout.maxRadius));
    expect(at(15, 15)?.radius).toBe(dotRadius(64, layout.maxRadius));
    // Each arc starts at its own rightmost point, so no stray line joins dots.
    for (const a of arcs) expect(moves).toContainEqual([a.x + a.radius, a.y]);
  });

  it.each([12, 16])('buckets dots into one path per palette level (%i levels)', (n) => {
    const { ctx } = fakeContext();
    const cells = [0, 128, 255];
    paintDots(ctx, cells, { cols: 3, rows: 1 }, stripLayout(4), palette(n));

    expect(created).toHaveLength(n);
    cells.forEach((v, c) => {
      const level = quantize(v, n);
      expect(created[level].arcs.map((a) => a.x)).toContain(2 + c * 4);
    });
    expect(created.reduce((sum, p) => sum + p.arcs.length, 0)).toBe(3);
  });

  it('draws unlit cells as dim dots unless skipUnlit is set', () => {
    const cells = [0, 255, 0, 0];
    const grid = { cols: 4, rows: 1 };
    const layout = stripLayout(10);

    const all = fakeContext();
    paintDots(all.ctx, cells, grid, layout, palette(16));
    expect(created[0].arcs).toHaveLength(3);
    expect(created[15].arcs).toHaveLength(1);

    created = [];
    const lit = fakeContext();
    paintDots(lit.ctx, cells, grid, layout, palette(16), { skipUnlit: true });
    expect(created[0].arcs).toHaveLength(0);
    expect(created[15].arcs).toEqual([{ x: 15, y: 5, radius: dotRadius(255, layout.maxRadius) }]);
  });

  it('scales each cell by its own progress before sizing and bucketing it', () => {
    const { ctx } = fakeContext();
    const layout = stripLayout(10);
    const seen: number[] = [];
    const progress = (i: number) => {
      seen.push(i);
      return i === 0 ? 0 : i === 1 ? 0.5 : 1;
    };
    paintDots(ctx, [255, 255, 255], { cols: 3, rows: 1 }, layout, palette(16), { skipUnlit: true, progress });

    expect(seen).toEqual([0, 1, 2]);
    // The first cell is still off and skipped; the second is half way.
    expect(created.flatMap((p) => p.arcs)).toHaveLength(2);
    expect(created[quantize(127.5, 16)].arcs).toEqual([{ x: 15, y: 5, radius: dotRadius(127.5, layout.maxRadius) }]);
    expect(created[15].arcs).toEqual([{ x: 25, y: 5, radius: dotRadius(255, layout.maxRadius) }]);
  });

  it('fills the levels in ascending order, each with its own colour', () => {
    const { ctx, fills } = fakeContext();
    const colours = palette(12);
    paintDots(ctx, [0, 255], { cols: 2, rows: 1 }, stripLayout(10), colours);

    expect(fills.map((f) => f.style)).toEqual(colours);
    expect(fills).toHaveLength(created.length);
    fills.forEach((f, i) => expect(f.path).toBe(created[i]));
  });
});
