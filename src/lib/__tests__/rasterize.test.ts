// The LED rasteriser is pure arithmetic over RGBA arrays, so it is tested with
// synthetic pixel buffers — no canvas involved.
import { describe, it, expect } from 'vitest';
import {
  sampleGrid,
  fitGrid,
  lightUpOrder,
  dotRadius,
  layoutDots,
  quantize,
} from '../led/rasterize';

/** Builds an opaque RGBA buffer from a matrix of grey levels. */
function greys(rows: number[][]): { data: Uint8ClampedArray; width: number; height: number } {
  const height = rows.length;
  const width = rows[0].length;
  const data = new Uint8ClampedArray(width * height * 4);
  rows.forEach((row, y) =>
    row.forEach((v, x) => {
      const i = (y * width + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = v;
      data[i + 3] = 255;
    }),
  );
  return { data, width, height };
}

describe('sampleGrid', () => {
  it('averages each cell of a 4×4 image into a 2×2 grid', () => {
    const img = greys([
      [255, 255, 0, 0],
      [255, 255, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const grid = sampleGrid(img.data, img.width, img.height, 2, 2);
    expect(Array.from(grid)).toEqual([255, 0, 0, 0]);
  });

  it('weights luminance by alpha so transparent pixels read as off', () => {
    const img = greys([[255, 255]]);
    img.data[3] = 0; // first pixel fully transparent
    const grid = sampleGrid(img.data, img.width, img.height, 2, 1);
    expect(Array.from(grid)).toEqual([0, 255]);
  });

  it('handles cells that do not divide the image evenly', () => {
    const img = greys([
      [255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255],
      [255, 255, 255, 255, 255],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
    const grid = sampleGrid(img.data, img.width, img.height, 2, 2);
    expect(grid).toHaveLength(4);
    // Top row is entirely lit, bottom row mostly dark; nothing is NaN.
    expect(grid[0]).toBe(255);
    expect(grid[1]).toBe(255);
    expect(grid[2]).toBeLessThan(128);
    expect(grid[3]).toBeLessThan(128);
  });

  it('uses Rec. 709 luma, so pure blue reads darker than pure green', () => {
    const data = new Uint8ClampedArray([0, 255, 0, 255, 0, 0, 255, 255]);
    const grid = sampleGrid(data, 2, 1, 2, 1);
    expect(grid[0]).toBeGreaterThan(grid[1]);
  });
});

describe('fitGrid', () => {
  it('derives rows from the aspect ratio', () => {
    expect(fitGrid(2, 100)).toEqual({ cols: 100, rows: 50 });
  });

  it('caps the total number of dots while keeping the aspect', () => {
    const grid = fitGrid(2, 200, 6000);
    expect(grid.cols * grid.rows).toBeLessThanOrEqual(6000);
    expect(grid.cols / grid.rows).toBeCloseTo(2, 0);
  });

  it('never returns fewer than one row or column', () => {
    expect(fitGrid(100, 4)).toEqual({ cols: 4, rows: 1 });
  });
});

describe('lightUpOrder', () => {
  it('sweep: delay grows left to right and is normalised to [0, 1]', () => {
    const d = lightUpOrder(4, 2, 'sweep');
    expect(d[0]).toBe(0);
    expect(d[3]).toBe(1);
    expect(d[4]).toBe(0); // second row starts over
    expect(d[1]).toBeLessThan(d[2]);
  });

  it('radial: the centre lights first and the corners last', () => {
    const d = lightUpOrder(5, 5, 'radial');
    expect(d[12]).toBe(0);
    expect(d[0]).toBeCloseTo(1, 5);
    expect(d[24]).toBeCloseTo(1, 5);
  });

  it('scatter: deterministic for a seed, every delay inside [0, 1]', () => {
    const a = lightUpOrder(10, 10, 'scatter', 7);
    const b = lightUpOrder(10, 10, 'scatter', 7);
    expect(Array.from(a)).toEqual(Array.from(b));
    for (const v of a) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
    expect(new Set(Array.from(a).map((v) => v.toFixed(3))).size).toBeGreaterThan(50);
  });
});

describe('dotRadius', () => {
  it('keeps an "off" dot visible and grows monotonically to the maximum', () => {
    const max = 3;
    expect(dotRadius(0, max)).toBeGreaterThan(0);
    expect(dotRadius(0, max)).toBeLessThan(dotRadius(128, max));
    expect(dotRadius(128, max)).toBeLessThan(dotRadius(255, max));
    expect(dotRadius(255, max)).toBe(max);
  });
});

describe('quantize', () => {
  it('maps 0..255 onto 0..levels-1 with the extremes preserved', () => {
    expect(quantize(0, 16)).toBe(0);
    expect(quantize(255, 16)).toBe(15);
    expect(quantize(128, 16)).toBe(8);
  });
});

describe('layoutDots', () => {
  it('centres the grid in the box and fits the pitch to the tighter axis', () => {
    const l = layoutDots(4, 2, 100, 100);
    expect(l.pitch).toBe(25);
    expect(l.offsetX).toBe(12.5);
    expect(l.offsetY).toBe(37.5);
    expect(l.maxRadius).toBeLessThan(l.pitch / 2);
  });
});
